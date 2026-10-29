import dotenv from 'dotenv';
dotenv.config(); // ดึงค่า .env ในโฟลเดอร์ปัจจุบันที่รันอยู่
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoute from "./routes/cartRoutes.js";

const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true })); // อนุญาตให้ frontend ส่ง cookie มาได้
app.use(express.json());
app.use(cookieParser());
app.use('/img_pd', express.static('img_pd'));
app.use('/img_mem', express.static('img_mem'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use(productRoutes);
app.use(cartRoute);
app.use((req, res) => res.status(404).json({ message: 'ไม่พบ endpoint' }));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API running on http://localhost:${port}`));