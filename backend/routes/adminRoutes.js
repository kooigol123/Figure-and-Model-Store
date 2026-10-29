import { Router } from 'express';
import * as c from '../controllers/adminController.js';
import { auth, requireRole } from './middleware.js';

const router = Router();

router.use(auth, requireRole('admin')); // ทุก route ในไฟล์นี้ต้องเป็น admin

router.get('/users', c.listUsers);
router.get('/orders', c.listOrders);
router.patch('/users/:id/role', c.changeRole);
router.patch('/users/:id/status', c.changeStatus);
router.delete('/users/:id', c.deleteUser);

export default router;