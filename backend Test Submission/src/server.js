import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import allRoutes from './routes/index.js';
import loggingMiddleware from './middleware/loggingMiddleware.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Successfully connected to MongoDB.');
}).catch(err => {
    console.error('Connection error', err);
    process.exit();
});

// Middleware
app.use(cors()); // Allow requests from our React frontend
app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true }));

// ** MANDATORY LOGGING MIDDLEWARE **
app.use(loggingMiddleware);

// Routes
app.use('/', allRoutes);

// Error Handling Middleware (should be the last one)
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});