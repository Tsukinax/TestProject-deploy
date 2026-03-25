const Product = require('../models/productModel');
const Category = require('../models/categoryModel');

const backofficeController = {
    // Render the main admin dashboard
    getDashboard: async (req, res) => {
        try {
            // Fetch up to 100 products for the admin table
            const products = await Product.getProductsPaginated(100, 0); 
            res.render('admin/dashboard', { products: products });
        } catch (error) {
            console.error('Admin dashboard error:', error);
            res.status(500).send('Internal Server Error');
        }
    }
    
    // Note: You will eventually add functions here for adding/editing/deleting products 
    // depending on exactly how your admin HTML forms are set up.
};

module.exports = backofficeController;