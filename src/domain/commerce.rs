use axum::Json;

#[derive(serde::Serialize)]
pub struct CommerceDashboardData {}

pub async fn get_commerce_dashboard() -> Json<CommerceDashboardData> {
    Json(CommerceDashboardData {})
}
