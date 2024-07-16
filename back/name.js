import express from 'express';
import fs, { readFileSync } from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
const loadData = async (filePath) => {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream
            (filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
    }
    );
}

const products = await loadData(path.join(__dirname, './data/olist_products_dataset.csv'));
//read lines
const productNames = readFileSync(path.join(__dirname, './data/ecommerce_product_names.csv'), 'utf-8').split('\n');

for (let i = 0; i < products.length; i++) {
    products[i].product_name = productNames[i % 12000 + 1];
}

//Output while keeping the first line
fs.createWriteStream(path.join(__dirname, './data/olist_products_dataset.csv'))
    .write(`"product_id","product_category_name","product_name_lenght","product_description_lenght","product_photos_qty","product_weight_g","product_length_cm","product_height_cm","product_width_cm","product_name"\n` + products.map(product => Object.values(product).join(',')).join('\n'))