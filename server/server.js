import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './config/database.config.js';

import mountRoutes from './routes/index.js';


// Load Env Variables
dotenv.config();


// Connect to Database
connectDB();

// Express App Initialization
const app = express();

// Importing Environment Variable for PORT
const PORT = process.env.PORT || 3000;  


// Middleware
app.use(express.json());

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// Enable CORS
app.use(cors());

// Mount all Routes
mountRoutes(app);


// Sanity Test Route
app.get('/', (req, res) => {
    res.json({msg: 'Welcome to the world behind the app'});
});

// Handle undefined routes
app.use('*splat', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});


// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});


// Start Server/Listen for Requests with CLI sanity Test
app.listen(process.env.PORT, () => {
    console.log(`listening on : 🦄🦄${PORT}🦄🦄 `);
});

