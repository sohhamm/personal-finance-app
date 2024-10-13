use axum::{
    routing::post,
    Router,
};
use crate::handlers::auth::{signup, login, reset_password_request, reset_password};

pub fn auth_routes() -> Router {
    Router::new()
        .route("/signup", post(signup))
        .route("/login", post(login))
        .route("/reset-password-request", post(reset_password_request))
        .route("/reset-password", post(reset_password))
}