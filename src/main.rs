use router::get_router;

mod data;
mod domain;
mod router;
#[tokio::main]
async fn main() {
    let app = get_router();

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3002").await.unwrap();
    println!("Server running on port 3002");
    axum::serve(listener, app).await.unwrap();
}
