use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct RawOrder {
    pub order_id: String,
    pub customer_id: String,
    pub order_status: String,
    pub order_purchase_timestamp: String,
    pub order_approved_at: String,
    pub order_delivered_carrier_date: String,
    pub order_delivered_customer_date: String,
    pub order_estimated_delivery_date: String,
}

#[derive(Debug, Deserialize)]
pub struct RawOrderItem {
    pub order_id: String,
    pub order_item_id: String,
    pub product_id: String,
    pub seller_id: String,
    pub shipping_limit_date: String,
    pub price: f64,
    pub freight_value: f64,
}

#[derive(Debug, Deserialize)]
pub struct RawProduct {
    pub product_id: Option<String>,
    pub product_category_name: Option<String>,
    pub product_name_lenght: Option<i64>,
    pub product_description_lenght: Option<i64>,
    pub product_photos_qty: Option<i64>,
    pub product_weight_g: Option<f64>,
    pub product_length_cm: Option<f64>,
    pub product_height_cm: Option<f64>,
    pub product_width_cm: Option<f64>,
}

#[derive(Debug, Deserialize)]
pub struct RawCustomer {
    pub customer_id: String,
    pub customer_unique_id: String,
    pub customer_zip_code_prefix: String,
    pub customer_city: String,
    pub customer_state: String,
}

#[derive(Debug, Deserialize)]
pub struct RawSeller {
    pub seller_id: String,
    pub seller_zip_code_prefix: String,
    pub seller_city: String,
    pub seller_state: String,
}

#[derive(Debug, Deserialize)]
pub struct RawReview {
    pub review_id: String,
    pub order_id: String,
    pub review_score: i64,
    pub review_comment_title: String,
    pub review_comment_message: String,
    pub review_creation_date: String,
    pub review_answer_timestamp: String,
}
