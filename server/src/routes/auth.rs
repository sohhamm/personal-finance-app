use crate::handlers::auth::{login, reset_password, reset_password_request, signup};
use axum::{routing::post, Router};
use sqlx::PgPool;

pub fn auth_routes() -> Router<PgPool> {
    Router::new()
        .route("/signup", post(signup))
        .route("/login", post(login))
        .route("/reset-password-request", post(reset_password_request))
        .route("/reset-password", post(reset_password))
}
