from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import Annotated, List, Optional
import models
from database import engine, SessionLocal
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    'http://localhost:3000',
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

class TransactionBase(BaseModel):
    id: Optional[int] = None
    amount: float
    category: str
    description: str
    is_income: bool
    date: str

class TransactionModel(TransactionBase):
    id: int

    class Config:
        from_attributes = True

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

models.base.metadata.create_all(bind=engine)

# Create new transaction api
@app.post("/transactions/", response_model=TransactionModel)
async def create_transaction(transaction: TransactionBase, db: db_dependency):
    db_transaction = models.Transaction(**transaction.dict())
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

# Get all transaction api
@app.get("/transactions/", response_model=List[TransactionModel])
async def read_transactions(db: db_dependency, skip: int = 0, limit: int = 100):
    transactions = db.query(models.Transaction).offset(skip).limit(limit).all()
    return transactions

# Get 1 transaction api
@app.get("/transactions/{transaction_id}", response_model=TransactionModel)
async def read_transaction( db: db_dependency, transaction_id: int, skip: int = 0, limit: int = 100):
    transactions = db.query(models.Transaction).offset(skip).limit(limit).all()
    for transaction in transactions:
        if transaction.id == transaction_id:
            return transaction

    raise HTTPException(status_code=404, detail="Transaction not found")

# Update transaction api
@app.put("/transactions/{transaction_id}", response_model=TransactionModel)
async def update_transaction( db: db_dependency, transaction_id: int, transaction_update: TransactionBase):
    db_transaction = db.query(models.Transaction).filter(models.Transaction.id == transaction_id).first()

    if not db_transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    update_data = transaction_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_transaction, key, value)

    db.commit()
    db.refresh(db_transaction)

    return db_transaction


@app.delete("/transactions/{transaction_id}", response_model=TransactionModel)
async def delete_transaction(transaction_id: int, db: db_dependency):
    db_transaction = db.query(models.Transaction).filter(models.Transaction.id == transaction_id).first()

    if not db_transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    db.delete(db_transaction)
    db.commit()

    return db_transaction