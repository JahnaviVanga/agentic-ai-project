from apscheduler.schedulers.background import BackgroundScheduler
from app import db, create_app
from app.database import User, Finance, Alert
from app.finance_tools import FinanceAnalyzer
from datetime import datetime
import json
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def daily_financial_check():
    """Run daily financial analysis and generate alerts - Daily at 9 AM"""
    app = create_app()
    with app.app_context():
        users = User.query.all()
        
        for user in users:
            analyzer = FinanceAnalyzer(
                monthly_income=user.monthly_income,
                monthly_expenses=user.monthly_expenses,
                goal_amount=0,
                goal_months=12,
                emergency_fund=0
            )
            
            insights = analyzer.generate_insights()
            
            if user.monthly_income > 0:
                expense_percentage = (user.monthly_expenses / user.monthly_income) * 100
                if expense_percentage > 75:
                    alert = Alert(
                        user_id=user.id,
                        message=f"Critical: Expenses at {expense_percentage:.1f}% of income (₹{user.monthly_expenses:,.0f}). Urgent action needed!",
                        level='critical',
                        status='unread'
                    )
                    db.session.add(alert)
                elif expense_percentage > 60:
                    alert = Alert(
                        user_id=user.id,
                        message=f"Warning: Expenses at {expense_percentage:.1f}% of income. Consider budget review.",
                        level='warning',
                        status='unread'
                    )
                    db.session.add(alert)
            
            for insight in insights:
                alert = Alert(
                    user_id=user.id,
                    message=insight['message'],
                    level=insight['type'],
                    status='unread'
                )
                db.session.add(alert)
            
            db.session.commit()
            logger.info(f"✅ Daily check completed for user {user.id}")

def weekly_goal_monitor():
    """Monitor goal progress weekly - Every Monday at 10 AM"""
    app = create_app()
    with app.app_context():
        users = User.query.all()
        
        for user in users:
            monthly_savings = user.monthly_income - user.monthly_expenses
            
            if monthly_savings > 0:
                alert = Alert(
                    user_id=user.id,
                    message=f"Great! You saved ₹{monthly_savings:,.0f} this week. Keep up the momentum!",
                    level='success',
                    status='unread'
                )
                db.session.add(alert)
        
        db.session.commit()
        logger.info("✅ Weekly goal monitoring completed")

def monthly_report_generation():
    """Generate comprehensive monthly reports - 1st of each month at 12 PM"""
    app = create_app()
    with app.app_context():
        report_data = {}
        users = User.query.all()
        
        for user in users:
            monthly_savings = user.monthly_income - user.monthly_expenses
            
            report_data[f"user_{user.id}"] = {
                'name': user.name,
                'monthly_income': f"₹{user.monthly_income:,.0f}",
                'monthly_expenses': f"₹{user.monthly_expenses:,.0f}",
                'monthly_savings': f"₹{monthly_savings:,.0f}",
                'monthly_savings_goal': f"₹{user.monthly_savings_goal:,.0f}",
                'risk_profile': user.risk_profile,
                'timestamp': datetime.utcnow().isoformat()
            }
        
        import os
        os.makedirs('data', exist_ok=True)
        
        with open('data/agent_logs.json', 'a') as f:
            json.dump(report_data, f, indent=2)
            f.write('\n')
        
        logger.info(f"✅ Monthly report generated for {len(users)} users")

def start_scheduler():
    """Initialize and start the background scheduler with agentic tasks"""
    scheduler = BackgroundScheduler()
    
    scheduler.add_job(daily_financial_check, 'cron', hour=9, minute=0, 
                     id='daily_check', name='Daily Financial Check')
    scheduler.add_job(weekly_goal_monitor, 'cron', day_of_week='mon', hour=10, minute=0,
                     id='weekly_monitor', name='Weekly Goal Monitor')
    scheduler.add_job(monthly_report_generation, 'cron', day=1, hour=12, minute=0,
                     id='monthly_report', name='Monthly Report Generation')
    
    scheduler.start()
    logger.info("✅ Scheduler started with 3 autonomous agentic background tasks:")
    logger.info("   - Daily Financial Check (9 AM) - with expense range alerts")
    logger.info("   - Weekly Goal Monitor (Monday 10 AM)")
    logger.info("   - Monthly Report Generation (1st of month 12 PM)")
    
    return scheduler
