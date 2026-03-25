const db = require('../config/db');

const Category = {
    // For the public webstore (only shows active categories)
    getVisibleCategories: async () => {
        const [rows] = await db.query('SELECT * FROM categories WHERE is_visible = TRUE');
        return rows;
    },

    // For the back-office (shows everything)
    getAllCategories: async () => {
        const [rows] = await db.query('SELECT * FROM categories');
        return rows;
    },

    // Admin: Toggle visibility
    updateVisibility: async (categoryId, isVisible) => {
        const [result] = await db.query(
            'UPDATE categories SET is_visible = ? WHERE category_id = ?',
            [isVisible, categoryId]
        );
        return result.affectedRows > 0;
    }
};

module.exports = Category;