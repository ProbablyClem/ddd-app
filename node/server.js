import express from 'express';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import * as sales from './sales.js';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const app = express();
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

    const customer_id_map = new Map();
    customers.forEach(customer => {
        customer_id_map.set(customer.customer_id, customer.customer_unique_id);
    });

    let [topRatedProducts, bestSellingProducts, averageOrdersPerCustomer] = await Promise.all([
        sales.top_rated_products(reviews, orderItems, products),
        sales.best_selling_products(orderItems, products),
        sales.average_orders_per_customer(orders, customer_id_map),
    ])

    return {
        topRatedProducts,
        bestSellingProducts,
        averageOrdersPerCustomer,
        monthlyRevenue: {}, // Implement this logic
        averageBasketValue: 0, // Implement this logic
        pendingPayments: [], // Implement this logic
        topPerformingSellers: [], // Implement this logic
        monthlyOrderCount: 0, // Implement this logic
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

app.get('/api/compta/monthly-revenue', async (req, res) => {
    res.json(metrics.monthlyRevenue);
});

app.get('/api/compta/average-basket-value', async (req, res) => {
    res.json(metrics.averageBasketValue);
});

app.get('/api/compta/pending-payments', async (req, res) => {
    res.json(metrics.pendingPayments);
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
