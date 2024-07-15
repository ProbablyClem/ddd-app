import fs from 'fs';

//paralelize the code
// split the orders into chunks and process them in parallel
export async function get_monthly_revenue(orders, orderItems) {


    const monthlyRevenue = {};
    const chunks = chunkArray(orders, 1000);
    await Promise.all(chunks.map(async chunk => {
        await Promise.all(chunk.map(async order => {
            const orderTotal = orderItems
                .filter(item => item.order_id === order.order_id)
                .reduce((sum, item) => sum + parseFloat(item.price), 0);
            let date = parseDate(order.order_purchase_timestamp);
            let key = `${date.getFullYear()}-${date.getMonth()}`;
            if (!monthlyRevenue[key]) {
                monthlyRevenue[key] = 0;
            }
            monthlyRevenue[key] += parseFloat(orderTotal);
        }));
    }));

    return monthlyRevenue;
}

// split the array into chunks
function chunkArray(array, chunkSize) {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
}

// 2018-07-24 20:41:37
function parseDate(date) {
    const [year, month, day] = date.split(' ')[0].split('-');
    return new Date(year, month - 1, day);
}

//Average order value
export async function average_basket_value(orders, orderItems) {
    const orderValues = orders.map(order => {
        return orderItems
            .filter(item => item.order_id === order.order_id)
            .reduce((sum, item) => sum + parseFloat(item.price), 0);
    });

    return orderValues.reduce((sum, value) => sum + value, 0) / orderValues.length;
}

// Percentage of payments type by month
export async function payments_type(orders, ordersPayment) {
    const paymentsType = {};
    orders.forEach(order => {
        const payment = ordersPayment.find(op => op.order_id === order.order_id);
        if (!payment) {
            return;
        }
        let date = parseDate(order.order_purchase_timestamp);
        let key = `${date.getFullYear()}-${date.getMonth()}`;
        if (!paymentsType[key]) {
            paymentsType[key] = {};
        }
        if (!paymentsType[key][payment.payment_type]) {
            paymentsType[key][payment.payment_type] = 0;
        }
        paymentsType[key][payment.payment_type]++;
    });

    return paymentsType;
}