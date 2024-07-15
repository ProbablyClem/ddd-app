import { compare_month } from "./utils.js";
import { parseDate } from "./utils.js";

// Top selling sellers grouped my month
export async function top_performing_sellers(sellers, orders, orderItems) {
    const months = {};
    orderItems.forEach(orderItem => {
        const seller = sellers.find(seller => seller.seller_id === orderItem.seller_id);
        if (!seller) {
            return;
        }
        const order = orders.find(order => order.order_id === orderItem.order_id);
        let date = parseDate(order.order_purchase_timestamp);
        let key = `${date.getFullYear()}-${date.getMonth()}`;
        if (!months[key]) {
            months[key] = {};
        }
        if (!months[key][seller.seller_id]) {
            months[key][seller.seller_id] = { sales: 0 };
            months[key][seller.seller_id].name = seller.seller_id;
        }
        months[key][seller.seller_id].sales += 1;
    });

    const sortedMonths = {}
    Object.keys(months).sort(compare_month).forEach(key => {
        sortedMonths[key] = months[key];
    });

    //keep  only the 5 best sellers
    for (let month in sortedMonths) {
        sortedMonths[month] = Object.values(sortedMonths[month]).sort((a, b) => b.sales - a.sales).slice(0, 5);
    }

    return sortedMonths
}

export async function monthly_order_count(orders) {
    const monthlyOrderCount = {};
    orders.forEach(order => {
        let date = parseDate(order.order_purchase_timestamp);
        let key = `${date.getFullYear()}-${date.getMonth()}`;
        if (!monthlyOrderCount[key]) {
            monthlyOrderCount[key] = 0;
        }
        monthlyOrderCount[key] += 1;
    });

    const sortedMonthlyOrderCount = {};
    Object.keys(monthlyOrderCount).sort(compare_month).forEach(key => {
        sortedMonthlyOrderCount[key] = monthlyOrderCount[key];
    });

    return sortedMonthlyOrderCount;
}

export async function score_by_delivery_time(orders, reviews) {
    orders = [...orders]
    // Add delivery time as days to each order
    orders.forEach(order => {
        const purchaseDate = parseDate(order.order_purchase_timestamp);
        const deliveryDate = parseDate(order.order_delivered_customer_date);
        order.deliveryTime = Math.floor((deliveryDate - purchaseDate) / (1000 * 60 * 60 * 24));
    });

    // get score for each order
    orders.forEach(order => {
        const review = reviews.find(review => review.order_id === order.order_id);
        if (review) {
            order.score = review.review_score;
        }
    })

    orders = orders.filter(order => order.score && order.deliveryTime);
    orders = orders.filter(order => order.deliveryTime > 0 && order.deliveryTime < 50);

    const scoreByDeliveryTime = {};
    orders.forEach(order => {
        let key = order.deliveryTime;
        if (!scoreByDeliveryTime[key]) {
            scoreByDeliveryTime[key] = [];
        }
        scoreByDeliveryTime[key].push(parseInt(order.score));
    });
    console.log(scoreByDeliveryTime)

    for (let key in scoreByDeliveryTime) {
        scoreByDeliveryTime[key] = scoreByDeliveryTime[key].reduce((sum, score) => sum + score, 0) / scoreByDeliveryTime[key].length;
    }

    return scoreByDeliveryTime;
}