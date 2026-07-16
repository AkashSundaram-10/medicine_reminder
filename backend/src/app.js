import express from 'express';
import cors from 'cors';
import medicineRoutes from './routes/medicine.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import insightRoutes from './routes/insight.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/medicines', medicineRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/insights', insightRoutes);

export default app;
