const db = require('../config/db');

const Product = {
    // The required 15-item pagination query for the frontend
    getProductsPaginated: async (limit = 15, offset = 0) => {
        const [rows] = await db.query(
            `SELECT p.*, c.category_name 
             FROM products p 
             JOIN categories c ON p.category_id = c.category_id 
             WHERE p.is_visible = TRUE 
             ORDER BY p.created_at DESC 
             LIMIT ? OFFSET ?`,
            [Number(limit), Number(offset)]
        );
        return rows;
    },

    // Get a single product by ID for the details page
    getProductById: async (productId) => {
        const [rows] = await db.query(
            `SELECT p.*, c.category_name 
             FROM products p 
             JOIN categories c ON p.category_id = c.category_id 
             WHERE p.product_id = ?`,
            [productId]
        );
        return rows[0];
    },

    // Search bar functionality
    searchProducts: async (keyword) => {
        const searchTerm = `%${keyword}%`;
        const [rows] = await db.query(
            `SELECT * FROM products 
             WHERE is_visible = TRUE AND (product_name LIKE ? OR product_description LIKE ?)`,
            [searchTerm, searchTerm]
        );
        return rows;
    },

    // Filter by specific category
    getProductsByCategory: async (categoryId) => {
        const [rows] = await db.query(
            'SELECT * FROM products WHERE category_id = ? AND is_visible = TRUE',
            [categoryId]
        );
        return rows;
    }
};

module.exports = Product;