import streamlit as st
import requests
import json
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime
import os

st.set_page_config(page_title="FinAI - Personal Finance Advisor", layout="wide", initial_sidebar_state="expanded")

# Sidebar styling
st.markdown("""
    <style>
    .main { background-color: #0f172a; color: #e2e8f0; }
    .sidebar { background-color: #1e293b; }
    h1, h2 { color: #3b82f6; }
    .currency { font-weight: bold; color: #10b981; }
    </style>
""", unsafe_allow_html=True)

st.title("FinAI - Personal Finance Advisor")
st.markdown("### Autonomous AI-Powered Financial Planning (Indian Rupees ₹)")

if 'user_id' not in st.session_state:
    st.session_state.user_id = None
if 'user_data' not in st.session_state:
    st.session_state.user_data = {}
if 'show_update_form' not in st.session_state:
    st.session_state.show_update_form = False

def load_user_data(user_id):
    try:
        response = requests.get(f'http://localhost:5000/api/users/{user_id}')
        if response.status_code == 200:
            return response.json()
    except:
        pass
    return None

# Helper function to format INR currency
def format_inr(amount):
    return f"₹{amount:,.0f}"

# Sidebar navigation
with st.sidebar:
    st.header("Navigation")
    
    if st.session_state.user_id:
        user_info = load_user_data(st.session_state.user_id)
        if user_info:
            st.markdown(f"**User:** {user_info['name']}")
            st.markdown(f"**ID:** {st.session_state.user_id}")
            st.divider()
    
    mode = st.radio("Select Mode:", ["Dashboard", "Update Details", "View Alerts", "AI Advisor", "Chat"])
    
    col1, col2 = st.columns(2)
    with col1:
        if st.button("⚙️ Update Details"):
            st.session_state.show_update_form = True
    with col2:
        if st.button("🔄 Reset Data"):
            st.session_state.user_id = None
            st.session_state.user_data = {}
            st.session_state.show_update_form = False
            st.success("Data reset! Ready for new profile.")
            st.rerun()

# Dashboard Mode
if mode == "Dashboard":
    if not st.session_state.user_id:
        st.subheader("Welcome! Let's Set Up Your Financial Profile")
        st.markdown("First-time setup - your data will be saved for future visits.")
        
        with st.form("setup_form", clear_on_submit=True):
            col1, col2 = st.columns(2)
            with col1:
                name = st.text_input("Your Name", placeholder="Enter your full name")
                monthly_income = st.number_input("Monthly Income (₹)", min_value=0, value=50000, step=1000)
                monthly_expenses = st.number_input("Monthly Expenses (₹)", min_value=0, value=30000, step=1000)
            
            with col2:
                financial_goal = st.text_input("Financial Goal", placeholder="e.g., Save for home down payment")
                goal_amount = st.number_input("Goal Amount (₹)", min_value=0, value=500000, step=50000)
                goal_months = st.number_input("Goal Timeline (months)", min_value=1, value=24, step=1)
            
            risk_profile = st.selectbox("Risk Preference", ["Low", "Medium", "High"], index=1)
            
            if st.form_submit_button("✅ Create Profile", use_container_width=True):
                if not name:
                    st.error("Please enter your name")
                else:
                    try:
                        response = requests.post('http://localhost:5000/api/users', json={
                            'name': name,
                            'monthly_income': monthly_income,
                            'monthly_expenses': monthly_expenses,
                            'financial_goal': financial_goal,
                            'goal_amount': goal_amount,
                            'goal_months': goal_months,
                            'risk_profile': risk_profile
                        })
                        
                        if response.status_code == 201:
                            user_data = response.json()
                            st.session_state.user_id = user_data['user_id']
                            st.session_state.user_data = {
                                'name': name,
                                'income': monthly_income,
                                'expenses': monthly_expenses,
                                'goal': goal_amount,
                                'goal_months': goal_months,
                                'risk_profile': risk_profile
                            }
                            st.success(f"✅ Profile created successfully! User ID: {user_data['user_id']}")
                            st.rerun()
                    except Exception as e:
                        st.error(f"Error creating profile: {str(e)}")
    else:
        user_info = load_user_data(st.session_state.user_id)
        if user_info:
            st.session_state.user_data = {
                'name': user_info['name'],
                'income': user_info['monthly_income'],
                'expenses': user_info['monthly_expenses'],
                'goal': user_info['goal_amount'],
                'goal_months': user_info['goal_months'],
                'risk_profile': user_info['risk_profile']
            }
        
        # Display dashboard metrics
        col1, col2, col3, col4 = st.columns(4)
        
        income = st.session_state.user_data.get('income', 0)
        expenses = st.session_state.user_data.get('expenses', 0)
        savings = income - expenses
        savings_rate = (savings / income * 100) if income > 0 else 0
        
        with col1:
            st.metric("Monthly Income", format_inr(income))
        with col2:
            st.metric("Monthly Expenses", format_inr(expenses))
        with col3:
            st.metric("Monthly Savings", format_inr(savings), delta=f"{savings_rate:.1f}%")
        with col4:
            st.metric("Savings Rate", f"{savings_rate:.1f}%")
        
        # Charts section
        st.subheader("Financial Overview")
        
        col1, col2 = st.columns(2)
        
        with col1:
            # Expense pie chart
            expenses_data = {
                'Category': ['Housing', 'Food', 'Transport', 'Utilities', 'Entertainment', 'Other'],
                'Amount': [
                    expenses * 0.30,  # Housing 30%
                    expenses * 0.25,  # Food 25%
                    expenses * 0.15,  # Transport 15%
                    expenses * 0.10,  # Utilities 10%
                    expenses * 0.12,  # Entertainment 12%
                    expenses * 0.08   # Other 8%
                ]
            }
            fig = px.pie(expenses_data, values='Amount', names='Category', 
                         title="Expense Breakdown (Calculated from Total)")
            fig.update_traces(textposition='inside', textinfo='percent+label')
            st.plotly_chart(fig, use_container_width=True)
        
        with col2:
            # Goal progress gauge
            goal_amount = st.session_state.user_data.get('goal', 0)
            goal_months = st.session_state.user_data.get('goal_months', 12)
            projected_savings = savings * goal_months
            progress = min((projected_savings / goal_amount * 100) if goal_amount > 0 else 0, 100)
            
            fig = go.Figure(go.Indicator(
                mode="gauge+number+delta",
                value=progress,
                title={'text': f"Goal Progress ({goal_months} months)"},
                delta={'reference': 100, 'increasing': {'color': '#10b981'}},
                gauge={
                    'axis': {'range': [0, 100]},
                    'bar': {'color': "#3b82f6"},
                    'steps': [
                        {'range': [0, 50], 'color': "#fee2e2"},
                        {'range': [50, 100], 'color': "#dbeafe"}
                    ],
                    'threshold': {
                        'line': {'color': "red"}, 
                        'thickness': 4, 
                        'value': 100
                    }
                }
            ))
            st.plotly_chart(fig, use_container_width=True)
        
        # Summary card
        st.markdown("---")
        col1, col2, col3 = st.columns(3)
        with col1:
            st.metric("Goal Amount", format_inr(goal_amount))
        with col2:
            st.metric("Projected Savings", format_inr(projected_savings))
        with col3:
            shortfall = max(0, goal_amount - projected_savings)
            st.metric("Shortfall/Surplus", format_inr(shortfall), 
                     delta="On Track!" if shortfall <= 0 else "Behind Target")

# Update Details Mode
elif mode == "Update Details":
    if st.session_state.user_id:
        st.subheader("Update Your Financial Details")
        
        user_info = load_user_data(st.session_state.user_id)
        if user_info:
            with st.form("update_form"):
                col1, col2 = st.columns(2)
                with col1:
                    new_name = st.text_input("Name", value=user_info['name'])
                    new_income = st.number_input("Monthly Income (₹)", 
                                                 value=user_info['monthly_income'], step=1000)
                    new_expenses = st.number_input("Monthly Expenses (₹)", 
                                                   value=user_info['monthly_expenses'], step=1000)
                
                with col2:
                    new_goal = st.text_input("Financial Goal", value=user_info['financial_goal'])
                    new_goal_amount = st.number_input("Goal Amount (₹)", 
                                                      value=user_info['goal_amount'], step=50000)
                    new_goal_months = st.number_input("Goal Timeline (months)", 
                                                      value=user_info['goal_months'], min_value=1)
                
                new_risk = st.selectbox("Risk Profile", ["Low", "Medium", "High"], 
                                       index=["Low", "Medium", "High"].index(user_info['risk_profile']))
                
                if st.form_submit_button("💾 Save Changes", use_container_width=True):
                    try:
                        requests.put(f'http://localhost:5000/api/users/{st.session_state.user_id}', json={
                            'name': new_name,
                            'monthly_income': new_income,
                            'monthly_expenses': new_expenses,
                            'financial_goal': new_goal,
                            'goal_amount': new_goal_amount,
                            'goal_months': new_goal_months,
                            'risk_profile': new_risk
                        })
                        st.session_state.user_data.update({
                            'name': new_name,
                            'income': new_income,
                            'expenses': new_expenses,
                            'goal': new_goal_amount,
                            'goal_months': new_goal_months,
                            'risk_profile': new_risk
                        })
                        st.success("✅ Profile updated successfully!")
                        st.rerun()
                    except Exception as e:
                        st.error(f"Error updating profile: {str(e)}")
    else:
        st.warning("Please create a profile first!")

# View Alerts Mode
elif mode == "View Alerts":
    if st.session_state.user_id:
        st.subheader("Financial Alerts & Notifications")
        try:
            response = requests.get(f'http://localhost:5000/api/alerts/{st.session_state.user_id}')
            alerts = response.json()
            
            if alerts:
                for alert in alerts[:15]:
                    if alert['level'] == 'critical':
                        st.error(f"🔴 **CRITICAL**: {alert['message']}")
                    elif alert['level'] == 'warning':
                        st.warning(f"🟡 **WARNING**: {alert['message']}")
                    else:
                        st.info(f"🟢 **INFO**: {alert['message']}")
            else:
                st.info("✅ No alerts at this time. Your finances look good!")
        except Exception as e:
            st.error(f"Error fetching alerts: {str(e)}")
    else:
        st.warning("Please create a profile first!")

# AI Advisor Mode
elif mode == "AI Advisor":
    if st.session_state.user_id:
        st.subheader("AI Financial Advisor")
        st.markdown("Get personalized financial advice powered by FinAI (Mistral-7B)")
        
        try:
            user_info = load_user_data(st.session_state.user_id)
            
            response = requests.post(f'http://localhost:5000/api/advice/{st.session_state.user_id}', json={
                'emergency_fund': 150000
            })
            advice_data = response.json()
            
            if advice_data.get('status') == 'success':
                st.markdown("### 💡 AI Advisor Recommendation")
                st.info(advice_data.get('advice', 'Unable to generate advice'))
                
                if advice_data.get('insights'):
                    st.markdown("### 📊 Financial Insights")
                    for insight in advice_data['insights']:
                        if insight['type'] == 'critical':
                            st.error(f"🔴 {insight['message']}")
                        elif insight['type'] == 'warning':
                            st.warning(f"🟡 {insight['message']}")
                        else:
                            st.success(f"🟢 {insight['message']}")
            else:
                st.error(advice_data.get('error', 'Unable to generate advice'))
                if advice_data.get('fallback_advice'):
                    st.info(f"**Fallback Advice**: {advice_data['fallback_advice']}")
        except Exception as e:
            st.error(f"Error getting advice: {str(e)}")
    else:
        st.warning("Please create a profile first!")

# Chat Mode
elif mode == "Chat":
    if st.session_state.user_id:
        st.subheader("💬 Chat with FinAI")
        st.markdown("Ask any financial questions and get AI-powered responses")
        
        user_input = st.text_input("Ask a financial question:")
        if user_input:
            try:
                response = requests.post(f'http://localhost:5000/api/chat/{st.session_state.user_id}', json={
                    'message': user_input
                })
                chat_data = response.json()
                st.markdown("### FinAI Response")
                st.info(chat_data.get('response', 'Unable to process request'))
            except Exception as e:
                st.error(f"Error: {str(e)}")
    else:
        st.warning("Please create a profile first!")

st.markdown("---")
st.markdown("*FinAI - Your Autonomous Personal Finance Advisor | Powered by Mistral-7B via Hugging Face*")
