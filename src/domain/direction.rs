use axum::Json;

#[derive(serde::Serialize)]
pub struct DirectionDashboardData {}

pub async fn get_direction_dashboard() -> Json<DirectionDashboardData> {
    Json(DirectionDashboardData {})
}
