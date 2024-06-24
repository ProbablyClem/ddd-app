use serde::{de::DeserializeOwned, Deserialize};

use super::models::*;

/// load ../data/olist_orders_dataset   .csv into a Vec<Order>
pub fn load_orders() -> Vec<Order> {
    load("data/olist_orders_dataset.csv")
}

pub fn load_order_items() -> Vec<OrderItem> {
    load("data/olist_order_items_dataset.csv")
}

pub fn load_products() -> Vec<Product> {
    load("data/olist_products_dataset.csv")
}

pub fn load_customers() -> Vec<Customer> {
    load("data/olist_customers_dataset.csv")
}

pub fn load_sellers() -> Vec<Seller> {
    load("data/olist_sellers_dataset.csv")
}

pub fn load_reviews() -> Vec<Review> {
    load("data/olist_order_reviews_dataset.csv")
}

pub fn load<T: DeserializeOwned>(path: &str) -> Vec<T> {
    let mut rdr = csv::Reader::from_path(path).unwrap();
    let mut items = Vec::new();
    for result in rdr.deserialize() {
        let item: T = result.unwrap();
        items.push(item);
    }
    items
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_load_orders() {
        let orders = load_orders();
        assert!(!orders.is_empty());
    }

    #[test]
    fn test_load_order_items() {
        let order_items = load_order_items();
        assert!(!order_items.is_empty());
    }

    #[test]
    fn test_load_products() {
        let products = load_products();
        assert!(!products.is_empty());
    }

    #[test]
    fn test_load_customers() {
        let customers = load_customers();
        assert!(!customers.is_empty());
    }

    #[test]
    fn test_load_sellers() {
        let sellers = load_sellers();
        assert!(!sellers.is_empty());
    }

    #[test]
    fn test_load_reviews() {
        let reviews = load_reviews();
        assert!(!reviews.is_empty());
    }
}
