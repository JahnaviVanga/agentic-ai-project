import json
import os
from datetime import datetime
from huggingface_hub import InferenceClient
from app.finance_tools import FinanceAnalyzer
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class FinancialAdvisor:
    def __init__(self):
        self.hf_token = os.getenv('HUGGINGFACEHUB_API_TOKEN')
        self.client = InferenceClient(token=self.hf_token)
        self.model = "mistralai/Mistral-7B-Instruct-v0.3"
    
    def generate_financial_advice(self, user_data, chat_history=None):
        """Generate personalized financial advice using AI"""
        
        analyzer = FinanceAnalyzer(
            monthly_income=user_data['monthly_income'],
            monthly_expenses=user_data['monthly_expenses'],
            goal_amount=user_data.get('goal_amount', 0),
            goal_months=user_data.get('goal_months', 12),
            emergency_fund=user_data.get('emergency_fund', 0)
        )
        
        insights = analyzer.generate_insights()
        
        # Build context for AI
        context = f"""
        User Financial Profile:
        - Monthly Income: ₹{user_data['monthly_income']:,.0f}
        - Monthly Expenses: ₹{user_data['monthly_expenses']:,.0f}
        - Savings Rate: {analyzer.savings_rate:.1f}%
        - Risk Profile: {user_data.get('risk_profile', 'Medium')}
        - Goal: {user_data.get('financial_goal', 'General savings')} (₹{user_data.get('goal_amount', 0):,.0f} in {user_data.get('goal_months', 12)} months)
        
        Current Insights:
        {json.dumps(insights, indent=2)}
        """
        
        system_prompt = """You are FinAI, an expert agentic AI finance and investment advisor. 
        You provide rational, actionable, and ethical financial advice based on data.
        Your response should include:
        1. Short Insight (1-2 sentences)
        2. Reasoning (explain your logic)
        3. Action Steps (2-4 specific recommendations)
        4. Forecast or Tip (optional future outlook)
        """
        
        user_message = chat_history[-1]['content'] if chat_history else "Analyze my financial situation and provide recommendations."
        
        try:
            response = self.client.text_generation(
                prompt=f"{system_prompt}\n\nContext:\n{context}\n\nUser: {user_message}",
                max_new_tokens=500,
                temperature=0.7
            )
            
            return {
                'status': 'success',
                'advice': response,
                'insights': insights,
                'timestamp': datetime.utcnow().isoformat()
            }
        except Exception as e:
            logger.error(f"Error generating advice: {str(e)}")
            return {
                'status': 'error',
                'error': str(e),
                'fallback_advice': self._get_fallback_advice(analyzer)
            }
    
    def _get_fallback_advice(self, analyzer):
        """Provide fallback advice when AI service is unavailable"""
        recommendations = analyzer.get_portfolio_rebalance_advice()
        return f"Based on your financial profile, consider this allocation: 60% Equities (₹{recommendations['equity_sip']:,.0f}), 30% Debt (₹{recommendations['debt_sip']:,.0f}), 10% Gold (₹{recommendations['gold_sip']:,.0f})."
