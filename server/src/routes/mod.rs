pub mod auth;

use axum::{
    http::{Method, HeaderValue},
    routing::get,
    Router,
};
use sqlx::PgPool;
use tower_http::cors::{CorsLayer, Any};

pub fn create_router(pool: PgPool) -> Router {
    let cors = CorsLayer::new()
        .allow_methods([Method::GET, Method::POST, Method::PATCH, Method::DELETE])
        .allow_origin([
            "http://localhost:5173".parse::<HeaderValue>().unwrap(),
            "https://personal-finance.soham.app".parse::<HeaderValue>().unwrap(),
        ])
        .allow_headers(Any);

    Router::new()
        .route("/health", get(|| async { "Healthy" }))
        .nest("/auth", auth::auth_routes())
        .layer(cors)
        .with_state(pool)
}