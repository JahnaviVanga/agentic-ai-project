from flask import Blueprint, request, jsonify
from app import db
from app.database import User, Finance, Alert, ChatHistory
from app.agent import FinancialAdvisor
from app.finance_tools import FinanceAnalyzer
from datetime import datetime
import uuid

api_bp = Blueprint('api', __name__)

# ✅ Create or Save User (called from Next.js /setup page)
@api_bp.route('/api/save_user', methods=['POST'])
def save_user():
    try:
        data = request.get_json()
        print("✅ Received data from frontend:", data)

        # Handle both new & existing users
        user_id = str(uuid.uuid4())
        total_expenses = data.get("totalExpenses", 0)
        expenses = data.get("expenses", {})

        user = User(
            id=user_id,
            name=data.get("name", "User"),
            monthly_income=data.get("monthlyIncome", 0),
            monthly_savings_goal=data.get("monthlySavingsGoal", 0),
            total_expenses=total_expenses,
            expenses_breakdown=expenses,
            risk_profile="medium",
            created_at=datetime.utcnow()
        )

        db.session.add(user)
        db.session.commit()

        # Add an automatic alert if spending is high
        monthly_income = data.get("monthlyIncome", 0)
        if monthly_income > 0 and total_expenses > monthly_income * 0.7:
            alert = Alert(
                user_id=user.id,
                message=f"⚠️ Warning: Your expenses (₹{total_expenses:,.0f}) are {(total_expenses/monthly_income*100):.1f}% of your income.",
                level='warning',
                status='unread'
            )
            db.session.add(alert)
            db.session.commit()

        return jsonify({"message": "User saved successfully!", "user_id": user.id}), 201

    except Exception as e:
        print("❌ Error saving user:", str(e))
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# ✅ Fetch User Info by ID
@api_bp.route('/users/<string:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({
        'id': user.id,
        'name': user.name,
        'risk_profile': user.risk_profile,
        'monthly_income': user.monthly_income,
        'monthly_savings_goal': user.monthly_savings_goal,
        'total_expenses': user.total_expenses,
        'expenses_breakdown': user.expenses_breakdown,
        'created_at': user.created_at.isoformat()
    }), 200


# ✅ Update User
@api_bp.route('/users/<string:user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    data = request.get_json()
    user.monthly_income = data.get('monthly_income', user.monthly_income)
    user.monthly_savings_goal = data.get('monthly_savings_goal', user.monthly_savings_goal)
    user.total_expenses = data.get('total_expenses', user.total_expenses)
    user.expenses_breakdown = data.get('expenses', user.expenses_breakdown)
    user.risk_profile = data.get('risk_profile', user.risk_profile)
    user.updated_at = datetime.utcnow()

    # Generate critical alert if spending > 75%
    if user.monthly_income > 0 and user.total_expenses > user.monthly_income * 0.75:
        alert = Alert(
            user_id=user_id,
            message=f"🚨 Alert: Your expenses are now {(user.total_expenses / user.monthly_income * 100):.1f}% of your income.",
            level='critical',
            status='unread'
        )
        db.session.add(alert)

    db.session.commit()
    return jsonify({'message': 'User updated successfully'}), 200


# ✅ Get User Alerts
@api_bp.route('/alerts/<string:user_id>', methods=['GET'])
def get_alerts(user_id):
    alerts = Alert.query.filter_by(user_id=user_id).order_by(Alert.created_at.desc()).all()
    return jsonify([
        {
            'id': a.id,
            'message': a.message,
            'level': a.level,
            'status': a.status,
            'created_at': a.created_at.isoformat()
        } for a in alerts
    ]), 200


# ✅ Mark Alert as Read
@api_bp.route('/alerts/<string:user_id>/<int:alert_id>', methods=['PUT'])
def mark_alert_read(user_id, alert_id):
    alert = Alert.query.filter_by(id=alert_id, user_id=user_id).first()
    if not alert:
        return jsonify({'error': 'Alert not found'}), 404

    alert.status = 'read'
    db.session.commit()
    return jsonify({'message': 'Alert marked as read'}), 200


# ✅ Chat API - AI Financial Advisor
@api_bp.route('/chat/<string:user_id>', methods=['POST'])
def chat(user_id):
    data = request.get_json()
    message = data.get('message', '')

    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    user_msg = ChatHistory(user_id=user_id, role='user', content=message)
    db.session.add(user_msg)
    db.session.commit()

    advisor = FinancialAdvisor()
    user_data = {
        'monthly_income': user.monthly_income,
        'monthly_savings_goal': user.monthly_savings_goal,
        'total_expenses': user.total_expenses,
        'risk_profile': user.risk_profile,
    }

    response = advisor.generate_financial_advice(user_data, [{'role': 'user', 'content': message}])
    assistant_msg = ChatHistory(user_id=user_id, role='assistant', content=response.get('advice', ''))
    db.session.add(assistant_msg)
    db.session.commit()

    return jsonify({'response': response.get('advice', 'Unable to generate advice')}), 200
