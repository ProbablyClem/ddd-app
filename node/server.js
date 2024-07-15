import express from 'express';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import * as sales from './sales.js';
import * as compta from './compta.js';
import * as management from './management.js'
import cors from 'cors';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

const port = 3000;


const loadData = (filePath) => {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
    });
};

const calculateMetrics = async () => {
    const customers = await loadData(path.join(__dirname, '../data/olist_customers_dataset.csv'));
    const orders = await loadData(path.join(__dirname, '../data/olist_orders_dataset.csv'));
    const orderItems = await loadData(path.join(__dirname, '../data/olist_order_items_dataset.csv'));
    const products = await loadData(path.join(__dirname, '../data/olist_products_dataset.csv'));
    const payments = await loadData(path.join(__dirname, '../data/olist_order_payments_dataset.csv'));
    const reviews = await loadData(path.join(__dirname, '../data/olist_order_reviews_dataset.csv'));
    const sellers = await loadData(path.join(__dirname, '../data/olist_sellers_dataset.csv'));

    const customer_id_map = new Map();
    customers.forEach(customer => {
        customer_id_map.set(customer.customer_id, customer.customer_unique_id);
    });

    let time = Date.now();
    let [topRatedProducts, bestSellingProducts, averageOrdersPerCustomer, percentageOfReviews, monthlyRevenue, averageBasketValue, paymentsType, topPerformingSellers, monthlyOrderCount] = await Promise.all([
        cache(sales.top_rated_products, reviews, orderItems, products),
        cache(sales.best_selling_products, orderItems, products),
        cache(sales.average_orders_per_customer, orders, customer_id_map),
        cache(sales.percentage_of_reviews, orders, reviews),
        cache(compta.get_monthly_revenue, orders, orderItems),
        cache(compta.average_basket_value, orders, orderItems),
        cache(compta.payments_type, orders, payments),
        cache(management.top_performing_sellers, sellers, orders, orderItems),
        cache(management.monthly_order_count, orders)
    ])
    console.log('Total Time taken:', Date.now() - time, 'ms');

    return {
        topRatedProducts,
        bestSellingProducts,
        averageOrdersPerCustomer,
        percentageOfReviews, // Implement this logic
        monthlyRevenue,
        averageBasketValue,
        paymentsType,
        topPerformingSellers,
        monthlyOrderCount, // Implement this logic
    };
};

app.get('/api/sales/top-rated-products', async (req, res) => {
    res.json(metrics.topRatedProducts);
});

app.get('/api/sales/best-selling-products', async (req, res) => {
    res.json(metrics.bestSellingProducts);
});

app.get('/api/sales/average-orders-per-customer', async (req, res) => {
    res.json(metrics.averageOrdersPerCustomer);
});

app.get('/api/sales/percentage-of-reviews', async (req, res) => {
    res.json(metrics.percentageOfReviews);
})

app.get('/api/compta/monthly-revenue', async (req, res) => {
    res.json(metrics.monthlyRevenue);
});

app.get('/api/compta/average-basket-value', async (req, res) => {
    res.json(metrics.averageBasketValue);
});

app.get('/api/compta/payment-types', async (req, res) => {
    res.json(metrics.paymentsType);
});

app.get('/api/direction/top-performing-sellers', async (req, res) => {
    res.json(metrics.topPerformingSellers);
});

app.get('/api/direction/best-selling-products', async (req, res) => {
    res.json(metrics.bestSellingProducts);
});

app.get('/api/direction/monthly-order-count', async (req, res) => {
    res.json(metrics.monthlyOrderCount);
});

app.get('/api/direction/monthly-revenue', async (req, res) => {
    res.json(metrics.monthlyRevenue);
});

const metrics = await calculateMetrics();

app.listen(port, async () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// load the file with the name of the fn function or return the result of the function and cache it
async function cache(fn, ...args) {
    let time = Date.now();
    const cacheFile = path.join(__dirname, `cache/${fn.name}.json`);

    let result;
    if (fs.existsSync(cacheFile)) {
        console.log(`Cache hit for ${fn.name}`);
        result = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
    }
    else {
        console.log(`Cache miss for ${fn.name}`);
        result = await fn(...args);
        fs.writeFileSync(cacheFile, JSON.stringify(result));
        result = result;
    }
    console.log(`Time taken for ${fn.name}:`, Date.now() - time, 'ms');
    return result;
}