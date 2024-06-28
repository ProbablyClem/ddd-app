function top_rated_products(reviews, orderItems, products) {
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
        return { productId, averageRating, productName: product.product_category_name };
    });

    return topRatedProducts;
}
exports.top_rated_products = top_rated_products;