import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './modules/auth/auth.routes.js';
import uploadRoutes from './modules/upload/upload.routes.js';
import itineraryRoutes from './modules/itinerary/itinerary.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();


app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));


app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/itinerary', itineraryRoutes);


app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is up and running' });
});


app.use(errorHandler);

export default app;