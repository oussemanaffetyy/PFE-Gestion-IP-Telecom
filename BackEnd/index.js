import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cron from 'node-cron';
import { runAnomalyScan } from './services/anomalyService.js';
import path from 'path';
import { fileURLToPath } from 'url';

// --- Configuration ---
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

// --- ES Module Fix for __dirname ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Middleware ---
const allowedOrigins = ['http://localhost:3000', 'http://192.168.1.17:3000'];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files like uploaded avatars

// --- Routes ---
import routerAuth from './routes/auth.js';
import routerIp from './routes/ipRoutes.js';
import siteRoutes from './routes/siteRoutes.js';
import regionRoutes from './routes/regionRoutes.js';
import typeRoutes from './routes/typeRoutes.js';
import vlanRoutes from './routes/vlanRoutes.js';
import ipAddressRoutes from './routes/ipAddressRoutes.js';
import anomalyRoutes from './routes/anomalyRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

app.use("/api/auth", routerAuth);
app.use("/api/ip", routerIp);
app.use("/api/sites", siteRoutes);
app.use("/api/regions", regionRoutes);
app.use("/api/types", typeRoutes);
app.use("/api/vlans", vlanRoutes);
app.use("/api/ip-addresses", ipAddressRoutes);
app.use('/api/anomalies', anomalyRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admins', adminRoutes);

// --- Scheduled Task ---
cron.schedule('*/10 * * * * *', () => {
    console.log(`[AUTO-SCAN] Running scheduled anomaly scan...`);
    runAnomalyScan();
});

// --- Server Start ---
app.listen(PORT, () => {
  console.log(`✅ Server launched on port ${PORT}`);
  runAnomalyScan();
});