import pandas as pd
import numpy as np
from datetime import datetime, timedelta

class FinanceAnalyzer:
    def __init__(self, monthly_income, monthly_expenses, goal_amount, goal_months, emergency_fund):
        self.monthly_income = monthly_income
        self.monthly_expenses = monthly_expenses
        self.monthly_savings = monthly_income - monthly_expenses
        self.savings_rate = (self.monthly_savings / monthly_income * 100) if monthly_income > 0 else 0
        self.goal_amount = goal_amount
        self.goal_months = goal_months
        self.emergency_fund = emergency_fund
    
    def analyze_expenses(self):
        """Analyze spending patterns and identify concerns"""
        insights = []
        
        if self.savings_rate < 20:
            insights.append({
                'type': 'warning',
                'message': f'Low savings rate ({self.savings_rate:.1f}%). Consider increasing SIP or cutting expenses.'
            })
        
        if self.monthly_expenses > self.monthly_income * 0.8:
            insights.append({
                'type': 'critical',
                'message': f'Expenses are {(self.monthly_expenses/self.monthly_income*100):.1f}% of income. Budget tightening recommended.'
            })
        
        return insights
    
    def analyze_emergency_fund(self):
        """Check emergency fund adequacy"""
        months_covered = self.emergency_fund / self.monthly_expenses if self.monthly_expenses > 0 else 0
        insights = []
        
        if months_covered < 3:
            required = self.monthly_expenses * 3
            gap = required - self.emergency_fund
            insights.append({
                'type': 'warning',
                'message': f'Emergency fund covers only {months_covered:.1f} months. Target: 3-6 months. Shortfall: ₹{gap:,.0f}'
            })
        
        return insights
    
    def forecast_goal_achievement(self):
        """Predict if goal will be achieved"""
        monthly_contribution = self.monthly_savings
        projected_savings = monthly_contribution * self.goal_months
        achievement_rate = (projected_savings / self.goal_amount * 100) if self.goal_amount > 0 else 0
        
        return {
            'projected_savings': projected_savings,
            'goal_amount': self.goal_amount,
            'achievement_rate': achievement_rate,
            'shortfall': max(0, self.goal_amount - projected_savings),
            'on_track': achievement_rate >= 100
        }
    
    def get_portfolio_rebalance_advice(self):
        """Generate portfolio rebalancing suggestions"""
        total_investable = self.monthly_savings + self.emergency_fund
        
        recommendations = {
            'emergency_fund': self.emergency_fund,
            'equity_sip': total_investable * 0.6,
            'debt_sip': total_investable * 0.3,
            'gold_sip': total_investable * 0.1
        }
        
        return recommendations
    
    def generate_insights(self):
        """Generate comprehensive financial insights with INR formatting"""
        all_insights = []
        
        all_insights.extend(self.analyze_expenses())
        all_insights.extend(self.analyze_emergency_fund())
        
        goal_forecast = self.forecast_goal_achievement()
        if not goal_forecast['on_track']:
            shortfall = goal_forecast['shortfall']
            all_insights.append({
                'type': 'warning',
                'message': f"Goal off track by {100 - goal_forecast['achievement_rate']:.1f}%. Need to save ₹{shortfall:,.0f} more."
            })
        
        return all_insights

def calculate_monthly_trends(finance_records):
    """Calculate month-over-month trends"""
    if not finance_records or len(finance_records) < 2:
        return {}
    
    df = pd.DataFrame([{
        'timestamp': r.timestamp,
        'expenses': r.expenses
    } for r in finance_records])
    
    if len(df) >= 2:
        latest_expense = df.iloc[-1]['expenses']
        prev_expense = df.iloc[-2]['expenses']
        change = ((latest_expense - prev_expense) / prev_expense * 100) if prev_expense > 0 else 0
        
        if abs(change) > 15:
            return {
                'spike_detected': True,
                'change_percent': change,
                'message': f"Expense spike detected: {change:+.1f}% (₹{latest_expense:,.0f})"
            }
    
    return {'spike_detected': False}
