pub struct Commande {
    pub id: String,
    pub avis: f64,
    pub articles: Vec<String>, //Id des articles
}

pub fn get_commandes() -> Vec<Commande> {
    let raw_reviews = crate::data::loader::load_reviews();
    let raw_orders = crate::data::loader::load_orders();
    let raw_order_items = crate::data::loader::load_order_items();
    let mut order_reviews = std::collections::HashMap::new();
    for review in raw_reviews {
        let order_id = review.order_id;
        let score = review.review_score;
        order_reviews.insert(order_id, score);
    }
    let mut commandes = Vec::new();
    for order in raw_orders {
        let id = order.order_id;
        let avis = order_reviews.get(&id).unwrap_or(&0);
        let articles = raw_order_items
            .iter()
            .filter(|item| item.order_id == id)
            .map(|item| item.product_id.clone())
            .collect();
        commandes.push(Commande {
            id,
            avis: *avis as f64,
            articles,
        });
    }
    commandes
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_get_commandes() {
        let mut commandes = get_commandes();
        assert!(!commandes.is_empty());

        assert!(!commandes.pop().unwrap().articles.is_empty());
    }
}
