from flask import Blueprint, request, jsonify
from app import db
from app.database import User, Finance, Alert, ChatHistory
from app.agent import FinancialAdvisor
from app.finance_tools import FinanceAnalyzer
from datetime import datetime

api_bp = Blueprint('api', __name__)

@api_bp.route('/users', methods=['POST'])
def create_user():
    data = request.json
    user = User(
        name=data.get('name', 'User'),
        risk_profile=data.get('risk_profile', 'Medium'),
        monthly_income=data.get('monthly_income', 0),
        monthly_expenses=data.get('monthly_expenses', 0),
        monthly_savings_goal=data.get('monthly_savings_goal', 0),
        expenses_breakdown=data.get('expenses', {}),
        created_at=datetime.utcnow()
    )
    db.session.add(user)
    db.session.commit()
    
    total_expenses = data.get('monthly_expenses', 0)
    monthly_income = data.get('monthly_income', 0)
    if monthly_income > 0 and total_expenses > monthly_income * 0.7:
        alert = Alert(
            user_id=user.id,
            message=f"Warning: Your expenses (₹{total_expenses:,.0f}) are {(total_expenses/monthly_income*100):.1f}% of your income.",
            level='warning',
            status='unread'
        )
        db.session.add(alert)
        db.session.commit()
    
    return jsonify({'user_id': user.id, 'name': user.name}), 201

@api_bp.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({
        'id': user.id,
        'name': user.name,
        'risk_profile': user.risk_profile,
        'monthly_income': user.monthly_income,
        'monthly_expenses': user.monthly_expenses,
        'monthly_savings_goal': user.monthly_savings_goal,
        'expenses_breakdown': user.expenses_breakdown
    }), 200

@api_bp.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.json
    user.monthly_income = data.get('monthly_income', user.monthly_income)
    user.monthly_expenses = data.get('monthly_expenses', user.monthly_expenses)
    user.monthly_savings_goal = data.get('monthly_savings_goal', user.monthly_savings_goal)
    user.expenses_breakdown = data.get('expenses', user.expenses_breakdown)
    user.risk_profile = data.get('risk_profile', user.risk_profile)
    user.updated_at = datetime.utcnow()
    
    if user.monthly_income > 0 and user.monthly_expenses > user.monthly_income * 0.75:
        alert = Alert(
            user_id=user_id,
            message=f"Alert: Expenses now at {(user.monthly_expenses/user.monthly_income*100):.1f}% of income. Consider budget adjustments.",
            level='critical',
            status='unread'
        )
        db.session.add(alert)
    
    db.session.commit()
    return jsonify({'message': 'User updated successfully'}), 200

@api_bp.route('/alerts/<int:user_id>', methods=['GET'])
def get_alerts(user_id):
    alerts = Alert.query.filter_by(user_id=user_id).order_by(Alert.created_at.desc()).all()
    return jsonify([{
        'id': a.id,
        'message': a.message,
        'level': a.level,
        'status': a.status,
        'created_at': a.created_at.isoformat()
    } for a in alerts]), 200

@api_bp.route('/alerts/<int:user_id>/<int:alert_id>', methods=['PUT'])
def mark_alert_read(user_id, alert_id):
    """Mark alert as read"""
    alert = Alert.query.filter_by(id=alert_id, user_id=user_id).first()
    if not alert:
        return jsonify({'error': 'Alert not found'}), 404
    
    alert.status = 'read'
    db.session.commit()
    return jsonify({'message': 'Alert marked as read'}), 200

@api_bp.route('/chat/<int:user_id>', methods=['POST'])
def chat(user_id):
    """Enhanced chat endpoint with AI advisor"""
    data = request.json
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
        'monthly_expenses': user.monthly_expenses,
        'monthly_savings_goal': user.monthly_savings_goal,
        'risk_profile': user.risk_profile
    }
    response = advisor.generate_financial_advice(user_data, [{'role': 'user', 'content': message}])
    
    assistant_msg = ChatHistory(user_id=user_id, role='assistant', content=response.get('advice', ''))
    db.session.add(assistant_msg)
    db.session.commit()
    
    return jsonify({'response': response.get('advice', 'Unable to generate advice')}), 200
