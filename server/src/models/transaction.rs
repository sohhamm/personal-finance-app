// File: src/models/transaction.rs

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Transaction {
    pub id: Uuid,
    pub user_id: Uuid,
    pub recipient_sender: String,
    pub category: String,
    pub transaction_date: DateTime<Utc>,
    pub amount: f64,
    pub transaction_type: TransactionType,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "transaction_type", rename_all = "lowercase")]
pub enum TransactionType {
    Income,
    Expense,
}

#[derive(Debug, Deserialize)]
pub struct CreateTransactionPayload {
    pub recipient_sender: String,
    pub category: String,
    pub transaction_date: DateTime<Utc>,
    pub amount: f64,
    pub transaction_type: TransactionType,
}

#[derive(Debug, Deserialize)]
pub struct UpdateTransactionPayload {
    pub recipient_sender: Option<String>,
    pub category: Option<String>,
    pub transaction_date: Option<DateTime<Utc>>,
    pub amount: Option<f64>,
    pub transaction_type: Option<TransactionType>,
}
