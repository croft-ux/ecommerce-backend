const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise'); // Use the promise-based version for cleaner code

const app = express();
const PORT = process.env.PORT || 3001;

// Create a connection pool for MySQL
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Ndamzi2007.', // Use your MySQL root password here
    database: 'ecomm'
});

app.use(cors());
app.use(express.json());

// Test the database connection
const connectDB = async () => {
    try {
        await pool.getConnection();
        console.log('MySQL connected successfully.');
    } catch (err) {
        console.error('MySQL connection error:', err);
        process.exit(1);
    }
};

// API endpoint to get all products from the database
app.get('/api/products', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM products');
        res.json(rows);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ message: 'Error fetching products', error: err.message });
    }
});

// Start the server after connecting to the database
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});