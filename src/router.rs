use axum::{routing::get, Router};

pub fn get_router() -> Router {
    Router::new().route("/", get(|| async { "Hello, world!" }))
}
