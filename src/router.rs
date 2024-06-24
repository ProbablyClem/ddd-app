use axum::{routing::get, Router};

use crate::domain::{
    commerce::get_commerce_dashboard, compta::get_compta_dashboard,
    direction::get_direction_dashboard,
};

pub fn get_router() -> Router {
    Router::new()
        .route("/compta", get(get_compta_dashboard))
        .route("/direction", get(get_direction_dashboard))
        .route("/commerce", get(get_commerce_dashboard))
}
