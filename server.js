const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise'); // Use the promise-based version for cleaner code

// This line uses the PORT provided by the environment (Render),
// or defaults to 3000 if running locally.
const PORT = process.env.PORT || 3000; 

// In your server.js file:

// Create a connection pool using EXPLICIT environment variables
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT, 
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME
});

// Also, ensure your PORT variable is still correctly used here:
// const PORT = process.env.PORT || 3000; 
// app.listen(PORT, ...);
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



// Start the server using the dynamic PORT variable
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
