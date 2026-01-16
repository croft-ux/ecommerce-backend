const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const PORT = process.env.PORT || 3000; 

// --- ADD THIS LINE HERE ---
const app = express(); 
// ---------------------------

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT, 
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: true // Ensure this is here for TiDB!
    }
});

app.use(cors());
app.use(express.json());

// ... (rest of your routes like app.get('/api/products')...)
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
