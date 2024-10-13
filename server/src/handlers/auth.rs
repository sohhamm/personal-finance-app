use crate::models::user::{
    LoginPayload, ResetPasswordPayload, ResetPasswordRequestPayload, SignupPayload, User,
};
use crate::utils::jwt::{create_token, verify_token};
use argon2::{
    password_hash::{rand_core::OsRng, PasswordHash, PasswordHasher, PasswordVerifier, SaltString},
    Argon2,
};
use axum::{extract::State, http::StatusCode, Json};
use sqlx::PgPool;

pub async fn signup(
    State(pool): State<PgPool>,
    Json(payload): Json<SignupPayload>,
) -> Result<(StatusCode, Json<String>), (StatusCode, String)> {
    let salt = SaltString::generate(&mut OsRng);
    let argon2 = Argon2::default();
    let password_hash = argon2
        .hash_password(payload.password.as_bytes(), &salt)
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
        .to_string();

    let user = sqlx::query_as!(
        User,
        "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *",
        payload.name,
        payload.email,
        password_hash
    )
    .fetch_one(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let token =
        create_token(user.id).map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok((StatusCode::CREATED, Json(token)))
}

pub async fn login(
    State(pool): State<PgPool>,
    Json(payload): Json<LoginPayload>,
) -> Result<(StatusCode, Json<String>), (StatusCode, String)> {
    let user = sqlx::query_as!(User, "SELECT * FROM users WHERE email = $1", payload.email)
        .fetch_optional(&pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
        .ok_or((StatusCode::UNAUTHORIZED, "Invalid credentials".to_string()))?;

    let parsed_hash = PasswordHash::new(&user.password_hash)
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Argon2::default()
        .verify_password(payload.password.as_bytes(), &parsed_hash)
        .map_err(|_| (StatusCode::UNAUTHORIZED, "Invalid credentials".to_string()))?;

    let token =
        create_token(user.id).map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok((StatusCode::OK, Json(token)))
}

pub async fn reset_password_request(
    State(pool): State<PgPool>,
    Json(payload): Json<ResetPasswordRequestPayload>,
) -> Result<StatusCode, (StatusCode, String)> {
    let user = sqlx::query_as!(User, "SELECT * FROM users WHERE email = $1", payload.email)
        .fetch_optional(&pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    if user.is_some() {
        // In a real app, send an email with a reset link
        // For this example, we'll just return OK
        Ok(StatusCode::OK)
    } else {
        Err((StatusCode::NOT_FOUND, "User not found".to_string()))
    }
}

pub async fn reset_password(
    State(pool): State<PgPool>,
    Json(payload): Json<ResetPasswordPayload>,
) -> Result<StatusCode, (StatusCode, String)> {
    let user_id = verify_token(&payload.token)
        .map_err(|_| (StatusCode::UNAUTHORIZED, "Invalid token".to_string()))?;

    let salt = SaltString::generate(&mut OsRng);
    let argon2 = Argon2::default();
    let password_hash = argon2
        .hash_password(payload.new_password.as_bytes(), &salt)
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
        .to_string();

    sqlx::query!(
        "UPDATE users SET password_hash = $1 WHERE id = $2",
        password_hash,
        user_id
    )
    .execute(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(StatusCode::OK)
}
