use crate::models::transaction::{CreateTransactionPayload, Transaction, UpdateTransactionPayload};
use crate::utils::jwt::AuthUser;
use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    Json,
};
use chrono::Utc;
use serde::Deserialize;
use sqlx::PgPool;
use uuid::Uuid;

#[derive(Debug, Deserialize)]
pub struct TransactionQuery {
    page: Option<u32>,
    page_size: Option<u32>,
    sort: Option<String>,
    category: Option<String>,
    search: Option<String>,
}

pub async fn get_transactions(
    State(pool): State<PgPool>,
    auth_user: AuthUser,
    Query(query): Query<TransactionQuery>,
) -> Result<Json<Vec<Transaction>>, StatusCode> {
    let page = query.page.unwrap_or(1);
    let page_size = query.page_size.unwrap_or(10);
    let offset = ((page - 1) * page_size) as i64;

    let mut sql = sqlx::QueryBuilder::new("SELECT * FROM transactions WHERE user_id = ");
    sql.push_bind(auth_user.user_id);

    if let Some(category) = &query.category {
        sql.push(" AND category = ");
        sql.push_bind(category);
    }

    if let Some(search) = &query.search {
        sql.push(" AND (recipient_sender ILIKE ");
        sql.push_bind(format!("%{}%", search));
        sql.push(" OR CAST(amount AS TEXT) = ");
        sql.push_bind(search);
        sql.push(")");
    }

    sql.push(" ORDER BY ");
    match query.sort.as_deref() {
        Some("latest") => sql.push("transaction_date DESC"),
        Some("oldest") => sql.push("transaction_date ASC"),
        Some("highest") => sql.push("amount DESC"),
        Some("lowest") => sql.push("amount ASC"),
        Some("a-z") => sql.push("recipient_sender ASC"),
        Some("z-a") => sql.push("recipient_sender DESC"),
        _ => sql.push("transaction_date DESC"),
    };

    sql.push(" LIMIT ");
    sql.push_bind(page_size as i64);
    sql.push(" OFFSET ");
    sql.push_bind(offset);

    let transactions = sql
        .build_query_as::<Transaction>()
        .fetch_all(&pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(transactions))
}

pub async fn create_transaction(
    State(pool): State<PgPool>,
    auth_user: AuthUser,
    Json(payload): Json<CreateTransactionPayload>,
) -> Result<Json<Transaction>, StatusCode> {
    let transaction = sqlx::query_as::<_, Transaction>(
        "INSERT INTO transactions (id, user_id, recipient_sender, category, transaction_date, amount, transaction_type, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $8)
         RETURNING *"
    )
    .bind(Uuid::new_v4())
    .bind(auth_user.user_id)
    .bind(&payload.recipient_sender)
    .bind(&payload.category)
    .bind(payload.transaction_date)
    .bind(payload.amount)
    .bind(&payload.transaction_type)
    .bind(Utc::now())
    .fetch_one(&pool)
    .await
    .map_err(|e| {
        eprintln!("Database error: {:?}", e);
        StatusCode::INTERNAL_SERVER_ERROR
    })?;
    // .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(transaction))
}

pub async fn update_transaction(
    State(pool): State<PgPool>,
    auth_user: AuthUser,
    Path(transaction_id): Path<Uuid>,
    Json(payload): Json<UpdateTransactionPayload>,
) -> Result<Json<Transaction>, StatusCode> {
    let mut transaction = sqlx::query_as::<_, Transaction>(
        "SELECT * FROM transactions WHERE id = $1 AND user_id = $2",
    )
    .bind(transaction_id)
    .bind(auth_user.user_id)
    .fetch_one(&pool)
    .await
    .map_err(|_| StatusCode::NOT_FOUND)?;

    if let Some(recipient_sender) = payload.recipient_sender {
        transaction.recipient_sender = recipient_sender;
    }
    if let Some(category) = payload.category {
        transaction.category = category;
    }
    if let Some(transaction_date) = payload.transaction_date {
        transaction.transaction_date = transaction_date;
    }
    if let Some(amount) = payload.amount {
        transaction.amount = amount;
    }
    if let Some(transaction_type) = payload.transaction_type {
        transaction.transaction_type = transaction_type;
    }
    transaction.updated_at = Utc::now();

    let updated_transaction = sqlx::query_as::<_, Transaction>(
        "UPDATE transactions
         SET recipient_sender = $1, category = $2, transaction_date = $3, amount = $4, transaction_type = $5, updated_at = $6
         WHERE id = $7 AND user_id = $8
         RETURNING *"
    )
    .bind(&transaction.recipient_sender)
    .bind(&transaction.category)
    .bind(transaction.transaction_date)
    .bind(transaction.amount)
    .bind(&transaction.transaction_type)
    .bind(transaction.updated_at)
    .bind(transaction_id)
    .bind(auth_user.user_id)
    .fetch_one(&pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(updated_transaction))
}

pub async fn delete_transaction(
    State(pool): State<PgPool>,
    auth_user: AuthUser,
    Path(transaction_id): Path<Uuid>,
) -> Result<StatusCode, StatusCode> {
    let result = sqlx::query("DELETE FROM transactions WHERE id = $1 AND user_id = $2")
        .bind(transaction_id)
        .bind(auth_user.user_id)
        .execute(&pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    if result.rows_affected() == 0 {
        return Err(StatusCode::NOT_FOUND);
    }

    Ok(StatusCode::NO_CONTENT)
}

pub async fn get_categories() -> Json<Vec<String>> {
    Json(vec![
        "Entertainment".to_string(),
        "Bills".to_string(),
        "Groceries".to_string(),
        "Dining Out".to_string(),
        "Transportation".to_string(),
        "Personal Care".to_string(),
        "Education".to_string(),
        "Lifestyle".to_string(),
        "Shopping".to_string(),
        "General".to_string(),
    ])
}
