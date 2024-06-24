use axum::Json;

#[derive(serde::Serialize)]
pub struct ComptaDashboardData {}

pub async fn get_compta_dashboard() -> Json<ComptaDashboardData> {
    Json(ComptaDashboardData {})
}
