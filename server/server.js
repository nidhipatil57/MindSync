import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import winston from 'winston';
import rateLimit from 'express-rate-limit';
import apiRouter from './routes/api.js';
import { seedDatabase } from './services/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Setup logger using Winston
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// Seed database on launch
seedDatabase().then(() => {
  logger.info('Database seeded and ready.');
}).catch(err => {
  logger.error('Database seeding failed:', err);
});

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173', // Allow client port
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Rate Limiting (to simulate production practices)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per window
  message: { message: 'Too many requests from this IP, please try again after 15 minutes.' }
});
app.use('/api/', limiter);

// Register API Routes
app.use('/api', apiRouter);

// Root Hello Endpoint
app.get('/', (req, res) => {
  res.json({ message: 'MindSync AI API is active. Call /api endpoints.' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({
    message: 'An internal server error occurred.',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Start Server
app.listen(PORT, () => {
  logger.info(`MindSync Express server running on port ${PORT}`);
});
