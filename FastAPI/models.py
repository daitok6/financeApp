from sqlalchemy import Boolean, Column, Integer, String, Float
from database import base

class Transaction(base):
    __tablename__ = 'transactions'

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float)
    category = Column(String)
    description =  Column(String)
    is_income = Column(Boolean)
    date = Column(String)

class Post(base):
    __tablename__ = 'posts'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(50))
    content = Column(String(100))
    user_id = Column(Integer)