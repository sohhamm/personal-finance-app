use sqlx::migrate::Migrator;
use sqlx::PgPool;

pub static MIGRATOR: Migrator = sqlx::migrate!();

pub async fn run_migrations(pool: &PgPool) -> Result<(), sqlx::Error> {
    MIGRATOR
        .run(pool)
        .await
        .map_err(|e| sqlx::Error::Migrate(Box::new(e)))
}
