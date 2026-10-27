import dotenv from 'dotenv';
dotenv.config(); // ดึงค่า .env ในโฟลเดอร์ปัจจุบันที่รันอยู่
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoute from "./routes/cartRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use(productRoutes);
app.use(cartRoute);
app.use((req, res) => res.status(404).json({ message: 'ไม่พบ endpoint' }));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API running on http://localhost:${port}`));