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