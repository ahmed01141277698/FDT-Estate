

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import net from 'net';
import connectLivereload from 'connect-livereload';
import livereload from 'livereload';
import cors from 'cors';
import userRoute from './Routes/userRoute.js';
import authRoute from './Routes/auth_route.js';
import listingRoute from './Routes/listingRoutong.js';
import uploadRoute from './Routes/uploadRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.static(path.join(__dirname, 'public')));

// Serve uploaded avatars
app.use('/uploads', express.static(join(__dirname, 'uploads')));

const checkPortAvailable = (port) =>
  new Promise((resolve) => {
    const tester = net.createServer();
    tester.once('error', () => { tester.close(); resolve(false); });
    tester.once('listening', () => { tester.close(); resolve(true); });
    tester.listen(port, '127.0.0.1');
  });

// Live Reload (development only)
if (process.env.NODE_ENV === 'development') {
  const liveReloadPort = Number(process.env.LIVERELOAD_PORT) || 35729;
  checkPortAvailable(liveReloadPort).then((available) => {
    if (!available) {
      console.warn(`⚠️ LiveReload port ${liveReloadPort} is already in use. Skipping live reload.`);
      return;
    }
    const liveReloadServer = livereload.createServer({ port: liveReloadPort });
    liveReloadServer.watch(path.join(process.cwd(), 'public'));
    app.use(connectLivereload());
    liveReloadServer.server.once('connection', () => {
      setTimeout(() => liveReloadServer.refresh('/'), 100);
    });
  });
}

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Required environment variables
const requiredEnv = ['Mongo', 'JWT_SECRET'];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);
if (missingEnv.length > 0) {
  console.error('✗ Missing required environment variables:', missingEnv.join(', '));
  process.exit(1);
}

// MongoDB Connection
mongoose
  .connect(process.env.Mongo, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 5000,
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`✓ Server running at http://localhost:${port}`);
      console.log('✓ Connected to MongoDB');
    });
  })
  .catch((err) => {
    console.error('✗ Error connecting to MongoDB:', err.message);
    process.exit(1);
  });

// Routes
app.use('/api/user', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/upload', uploadRoute);
app.use('/api/listing', listingRoute);

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: `المسار ${req.method} ${req.path} غير موجود`,
  });
});

// Error Handling
app.use((err, req, res, next) => {
  console.error('✗ Error:', { message: err.message, statusCode: err.statusCode });
  const statusCode = err.statusCode || 500;
  const message = err.message || 'حدث خطأ في الخادم';
  res.status(statusCode).json({ success: false, statusCode, message });
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n✓ Server shutting down gracefully...');
  mongoose.connection.close();
  process.exit(0);
});