import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import connectLivereload from 'connect-livereload';
import livereload from 'livereload';
import userRoute from './Routes/userRoute.js';
import authRoute from './Routes/auth_route.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

const __dirname = path.resolve();
// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
// Live Reload
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(process.cwd(), 'public'));
app.use(connectLivereload());
liveReloadServer.server.once("connection", () => {
  setTimeout(() => liveReloadServer.refresh("/"), 100);
});

// MongoDB Connection
mongoose.connect(process.env.Mongo).then(() => {
    app.listen(port, () => {
        console.log(`http://localhost:${port}`);
        console.log('Connected to MongoDB');    
    })
}).catch(err => console.error('Error connecting to MongoDB', err));

// Routes
app.use('/api/user', userRoute);
app.use('/api/signUp', authRoute);