use sqlx::postgres::PgPoolOptions;
use sqlx::PgPool;
use crate::config::Config;

pub async fn init_db() -> Result<PgPool, sqlx::Error> {
    let config = Config::from_env();
    
    PgPoolOptions::new()
        .max_connections(5)
        .connect(&config.database_url)
        .await
}