require('dotenv').config();
const express = require('express');
const cors = require('cors');

// 1. Import Database Connection (from your config file)
// Make sure your db.js is located at ./src/config/db.js
const connectDB = require('./src/config/db'); 

// 2. Import Routes
const policyRoutes = require('./src/routes/policyRoutes');

// Initialize App
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to Database
connectDB();

// ==========================================
//  Essential Middleware
// ==========================================

// Enable CORS (Allows Angular to connect)
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON bodies
app.use(express.json());

// Simple Request Logger (Optional but recommended for debugging)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// ==========================================
//  Routes
// ==========================================

// Mount Policy Routes
app.use('/api/policies', policyRoutes);

// Root/Health Check
app.get('/', (req, res) => {
    res.send('Policy Service API is running...');
});

// ==========================================
//  Global Error Handler
// ==========================================
app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        // Only show stack trace in development mode
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
});

// ==========================================
//  Start Server
// ==========================================
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});