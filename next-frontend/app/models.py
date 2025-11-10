from sqlalchemy import Column, Integer, String, Float, DateTime, JSON
from datetime import datetime
from app import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    monthly_income = Column(Float)
    monthly_expenses = Column(Float)
    monthly_savings_goal = Column(Float)
    risk_profile = Column(String, default="medium")  # low, medium, high
    expenses_breakdown = Column(JSON)  # {groceries, entertainment, utilities, transportation, others}
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Finance(Base):
    __tablename__ = "finances"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    month = Column(String)  # YYYY-MM format
    income = Column(Float)
    expenses = Column(Float)
    savings = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)

class Alert(Base):
    __tablename__ = "alerts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    message = Column(String)
    level = Column(String)  # info, warning, critical
    status = Column(String, default="unread")  # unread, read
    created_at = Column(DateTime, default=datetime.utcnow)

class ChatHistory(Base):
    __tablename__ = "chat_history"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    role = Column(String)  # user, assistant
    content = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
