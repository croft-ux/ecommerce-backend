const mysql = require('mysql2');
const products = require('./products');

// Create a connection pool to handle multiple connections efficiently
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root', // The default username is 'root'
    password: 'Ndamzi2007.', // Use the password you set during installation
    database: 'ecomm',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Get a connection from the pool
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }

    console.log('Successfully connected to MySQL database.');

    // Clear the existing products table
    connection.query('DELETE FROM products', (err, result) => {
        if (err) {
            console.error('Error clearing products table:', err);
            connection.release();
            return;
        }

        // Prepare the SQL statement for inserting a product
        const insertQuery = `
            INSERT INTO products (
                id, name, price, image, description, category, discount, discountedPrice, isNewArrival, isBestSeller
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        // Iterate through products and insert each one
        products.forEach(product => {
            connection.query(insertQuery, [
                product.id,
                product.name,
                product.price,
                product.image,
                product.description,
                product.category,
                product.discount,
                product.discountedPrice,
                product.isNewArrival,
                product.isBestSeller
            ], (err, result) => {
                if (err) {
                    console.error('Error inserting product:', err);
                } else {
                    console.log(`Inserted product: ${product.name}`);
                }
            });
        });

        // Release the connection back to the pool
        connection.release();
        console.log('Seeding process complete. Connection released.');
    });
});