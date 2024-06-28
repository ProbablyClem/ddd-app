const express = require('express');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const sales = require('./sales');

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

    // Calculate the required metrics
    // 1. Produits les mieux notés
    // 2. Produits les plus vendus
    // 3. Nombre Commandes moyennes par clients
    // 4. CA mensuel
    // 5. Panier moyen
    // 6. Commandes en attente de paiement
    // 7. Vendeurs les plus performants
    // 8. Nombre de commandes du mois
    // Implement these calculations below and provide the routes

    return {
        topRatedProducts: sales.top_rated_products(reviews, orderItems, products), // Implement this logic
        bestSellingProducts: sales.best_selling_products(orderItems, products), // Implement this logic
        averageOrdersPerCustomer: 0, // Implement this logic
        monthlyRevenue: {}, // Implement this logic
        averageBasketValue: 0, // Implement this logic
        pendingPayments: [], // Implement this logic
        topPerformingSellers: [], // Implement this logic
        monthlyOrderCount: 0, // Implement this logic
    };
};

app.get('/api/sales/top-rated-products', async (req, res) => {
    const metrics = await calculateMetrics();
    res.json(metrics.topRatedProducts);
});

app.get('/api/sales/best-selling-products', async (req, res) => {
    const metrics = await calculateMetrics();
    res.json(metrics.bestSellingProducts);
});

app.get('/api/sales/average-orders-per-customer', async (req, res) => {
    const metrics = await calculateMetrics();
    res.json(metrics.averageOrdersPerCustomer);
});

app.get('/api/compta/monthly-revenue', async (req, res) => {
    const metrics = await calculateMetrics();
    res.json(metrics.monthlyRevenue);
});

app.get('/api/compta/average-basket-value', async (req, res) => {
    const metrics = await calculateMetrics();
    res.json(metrics.averageBasketValue);
});

app.get('/api/compta/pending-payments', async (req, res) => {
    const metrics = await calculateMetrics();
    res.json(metrics.pendingPayments);
});

app.get('/api/direction/top-performing-sellers', async (req, res) => {
    const metrics = await calculateMetrics();
    res.json(metrics.topPerformingSellers);
});

app.get('/api/direction/best-selling-products', async (req, res) => {
    const metrics = await calculateMetrics();
    res.json(metrics.bestSellingProducts);
});

app.get('/api/direction/monthly-order-count', async (req, res) => {
    const metrics = await calculateMetrics();
    res.json(metrics.monthlyOrderCount);
});

app.get('/api/direction/monthly-revenue', async (req, res) => {
    const metrics = await calculateMetrics();
    res.json(metrics.monthlyRevenue);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
