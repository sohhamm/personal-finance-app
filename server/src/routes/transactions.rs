use crate::handlers::transactions::{
    create_transaction, delete_transaction, get_categories, get_transactions, update_transaction,
};
use axum::{
    routing::{get, put},
    Router,
};
use sqlx::PgPool;

pub fn transactions_routes() -> Router<PgPool> {
    Router::new()
        .route("/", get(get_transactions).post(create_transaction))
        .route("/:id", put(update_transaction).delete(delete_transaction))
        .route("/categories", get(get_categories))
}
