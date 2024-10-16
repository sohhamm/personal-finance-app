mod config;
mod db;
mod handlers;
mod migrations;
mod models;
mod routes;
mod utils;

use std::net::SocketAddr;
use tokio::signal;

#[tokio::main]
async fn main() {
    dotenvy::dotenv().ok();

    let pool = db::init_db().await.expect("Failed to connect to database");

    // Run migrations
    if let Err(e) = migrations::run_migrations(&pool).await {
        eprintln!("Failed to run migrations: {:?}", e);
        // Decide whether to panic or continue based on your requirements
        // panic!("Failed to run migrations");
    } else {
        println!("Migrations completed successfully");
    }
    let app = routes::create_router(pool);

    let addr = SocketAddr::from(([0, 0, 0, 0], 3000));
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    println!("Listening on {}", addr);

    axum::serve(listener, app)
        .with_graceful_shutdown(shutdown_signal())
        .await
        .unwrap();
}

async fn shutdown_signal() {
    let ctrl_c = async {
        signal::ctrl_c()
            .await
            .expect("failed to install Ctrl+C handler");
    };

    #[cfg(unix)]
    let terminate = async {
        signal::unix::signal(signal::unix::SignalKind::terminate())
            .expect("failed to install signal handler")
            .recv()
            .await;
    };

    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>();

    tokio::select! {
        _ = ctrl_c => {},
        _ = terminate => {},
    }

    println!("signal received, starting graceful shutdown");
}
