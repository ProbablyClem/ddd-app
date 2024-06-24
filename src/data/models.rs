use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct RawOrder {
    order_id: String,
    customer_id: String,
    order_status: String,
    order_purchase_timestamp: String,
    order_approved_at: String,
    order_delivered_carrier_date: String,
    order_delivered_customer_date: String,
    order_estimated_delivery_date: String,
}

#[derive(Debug, Deserialize)]
pub struct RawOrderItem {
    order_id: String,
    order_item_id: String,
    product_id: String,
    seller_id: String,
    shipping_limit_date: String,
    price: f64,
    freight_value: f64,
}

#[derive(Debug, Deserialize)]
pub struct RawProduct {
    product_id: Option<String>,
    product_category_name: Option<String>,
    product_name_lenght: Option<i64>,
    product_description_lenght: Option<i64>,
    product_photos_qty: Option<i64>,
    product_weight_g: Option<f64>,
    product_length_cm: Option<f64>,
    product_height_cm: Option<f64>,
    product_width_cm: Option<f64>,
}

#[derive(Debug, Deserialize)]
pub struct RawCustomer {
    customer_id: String,
    customer_unique_id: String,
    customer_zip_code_prefix: String,
    customer_city: String,
    customer_state: String,
}

#[derive(Debug, Deserialize)]
pub struct RawSeller {
    seller_id: String,
    seller_zip_code_prefix: String,
    seller_city: String,
    seller_state: String,
}

#[derive(Debug, Deserialize)]
pub struct RawReview {
    review_id: String,
    order_id: String,
    review_score: i64,
    review_comment_title: String,
    review_comment_message: String,
    review_creation_date: String,
    review_answer_timestamp: String,
}
