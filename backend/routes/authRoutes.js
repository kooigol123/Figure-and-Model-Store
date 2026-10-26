import { Router } from 'express';
import * as c from '../controllers/authController.js';
import { auth } from './middleware.js';

const router = Router();

router.post('/register', c.register);
router.post('/login', c.login);
router.get('/me', auth, c.me);

export default router;
