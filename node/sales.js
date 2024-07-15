export async function top_rated_products(reviews, orderItems, products) {
    const orderReviews = {};

    reviews.forEach(review => {
        if (!orderReviews[review.order_id]) {
            orderReviews[review.order_id] = [];
        }
        orderReviews[review.order_id].push(parseInt(review.review_score));
    });

    // Calculate average review score for each product
    const productRatings = {};
    orderItems.forEach(item => {
        const reviewScores = orderReviews[item.order_id];
        if (reviewScores) {
            const averageReviewScore = reviewScores.reduce((sum, score) => sum + score, 0) / reviewScores.length;
            if (!productRatings[item.product_id]) {
                productRatings[item.product_id] = { totalScore: 0, count: 0 };
            }
            productRatings[item.product_id].totalScore += averageReviewScore;
            productRatings[item.product_id].count += 1;
        }
    });

    // Calculate average rating for each product
    const productAverageRatings = Object.entries(productRatings).map(([productId, ratingData]) => ({
        productId,
        averageRating: ratingData.totalScore / ratingData.count
    }));

    // Sort products by average rating and get the top 10
    const topRatedProducts = productAverageRatings.sort((a, b) => b.averageRating - a.averageRating).slice(0, 10).map(({ productId, averageRating }) => {
        const product = products.find(p => p.product_id === productId);
        return { productId, averageRating };
    });

    return topRatedProducts;
}

export async function best_selling_products(orderItems, products) {
    // Calculate total sales for each product
    const productSales = {};
    orderItems.forEach(item => {
        if (!productSales[item.product_id]) {
            productSales[item.product_id] = 0;
        }
        productSales[item.product_id] += 1;
    });

    // Find the top 10 best-selling products
    const bestSellingProducts = Object.entries(productSales).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([productId, sales]) => {
        return { productId, sales };
    });

    return bestSellingProducts;
}

export async function average_orders_per_customer(orders, customer_id_map) {
    const customerOrders = {};
    orders.forEach(order => {
        let unique_id = customer_id_map.get(order.customer_id);
        if (!customerOrders[unique_id]) {
            customerOrders[unique_id] = 0;
        }
        customerOrders[unique_id] += 1;
    });

    const totalOrders = Object.values(customerOrders).reduce((sum, count) => sum + count, 0);
    const totalCustomers = Object.keys(customerOrders).length;

    return totalOrders / totalCustomers;
}

// Percentages of orders with a review per month
export async function percentage_of_reviews(orders, orderReviews) {
    const orderReviewCounts = {};
    orders.forEach(order => {
        const reviews = orderReviews.filter(review => review.order_id === order.order_id);

        let date = parseDate(order.order_purchase_timestamp);
        let key = `${date.getFullYear()}-${date.getMonth()}`;
        if (!orderReviewCounts[key]) {
            orderReviewCounts[key] = { total: 0, reviewed: 0 };
        }
        orderReviewCounts[key].total += 1;
        orderReviewCounts[key].reviewed += reviews.length > 0 ? 1 : 0;
    });

    const reviewPercentages = Object.entries(orderReviewCounts).map(([key, counts]) => {
        return {
            month: key,
            percentage: (counts.reviewed / counts.total) * 100
        };
    });

    return reviewPercentages;

}

// 2018-07-24 20:41:37
function parseDate(date) {
    const [year, month, day] = date.split(' ')[0].split('-');
    return new Date(year, month - 1, day);
}
