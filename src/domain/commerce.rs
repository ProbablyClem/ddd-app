use axum::Json;

#[derive(serde::Serialize)]
pub struct CommerceDashboardData {}

pub async fn get_commerce_dashboard() -> Json<CommerceDashboardData> {
    Json(CommerceDashboardData {})
}

/// 10 best rated products
fn best_rated_products() -> Vec<String> {
    let raw_reviews = crate::data::loader::load_reviews();
    let raw_products = crate::data::loader::load_products();
    let mut product_reviews = std::collections::HashMap::new();
    for review in raw_reviews {
        let product_id = review.order_id;
        let score = review.review_score;
        let count = product_reviews.entry(product_id).or_insert((0, 0));
        count.0 += score;
        count.1 += 1;
    }
    let mut product_scores = Vec::new();
    for (product_id, (total_score, count)) in product_reviews {
        let average_score = total_score as f64 / count as f64;
        product_scores.push((product_id, average_score));
    }
    product_scores.sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap());
    let best_rated_products = product_scores
        .iter()
        .take(10)
        .map(|(product_id, _)| {
            raw_products
                .iter()
                .find(|product| product.product_id == Some(product_id.clone()))
                .unwrap()
        })
        .collect::<Vec<_>>();
    best_rated_products
        .iter()
        .map(|product| product.product_category_name.clone().unwrap())
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_best_rated_products() {
        let best_rated_products = best_rated_products();
        assert_eq!(best_rated_products.len(), 10);
    }
}
