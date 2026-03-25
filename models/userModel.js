const db = require('../config/db');

const User = {
    // Find a user for login
    findByEmail: async (email) => {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    },

    // Find a user by ID (useful for profile pages)
    findById: async (userId) => {
        const [rows] = await db.query('SELECT user_id, username, email, phone, role FROM users WHERE user_id = ?', [userId]);
        return rows[0];
    },

    // Create a new customer during registration
    createCustomer: async (username, email, passwordHash) => {
        const [result] = await db.query(
            'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
            [username, email, passwordHash, 'customer']
        );
        return result.insertId;
    }
};

module.exports = User;