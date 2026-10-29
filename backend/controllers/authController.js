import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as users from '../services/userService.js';

const emailOk = (e) => typeof e === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

export const register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !emailOk(email) || !password || password.length < 8)
        return res.status(400).json({ message: 'ข้อมูลไม่ถูกต้อง (รหัสผ่านอย่างน้อย 8 ตัว)' });
    try {
        const hash = await bcrypt.hash(password, 10);
        const user = await users.create(name, email.toLowerCase(), hash); // role = user เสมอ
        res.status(201).json(user);
    } catch (e) {
        if (e.code === '23505') return res.status(409).json({ message: 'อีเมลนี้ถูกใช้แล้ว' });
        console.error(e);
        res.status(500).json({ message: 'server error' });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!emailOk(email) || !password)
        return res.status(400).json({ message: 'กรอกอีเมลและรหัสผ่าน' });
    try {
        const user = await users.findByEmail(email.toLowerCase());
        if (!user || !(await bcrypt.compare(password, user.password)))
            return res.status(401).json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
        if (user.status === 'suspended')
            return res.status(403).json({ message: 'บัญชีนี้ถูกระงับการใช้งาน กรุณาติดต่อผู้ดูแลระบบ' });

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '1d',
        });
        res.cookie('token', token, { httpOnly: true, sameSite: 'lax', maxAge: 24 * 60 * 60 * 1000 });
        res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'server error' });
    }
};

export const me = async (req, res) => {
    const user = await users.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'ไม่พบผู้ใช้' });
    // ถูกระงับระหว่างที่ login อยู่ → ลบ cookie ให้หลุดออกจากระบบ
    if (user.status === 'suspended') {
        res.clearCookie('token');
        return res.status(403).json({ message: 'บัญชีนี้ถูกระงับการใช้งาน' });
    }
    res.json(user);
};

export const updateMe = async (req, res) => {
    const name = (req.body.name || '').trim();
    if (!name || name.length > 100)
        return res.status(400).json({ message: 'กรุณากรอกชื่อ (ไม่เกิน 100 ตัวอักษร)' });
    try {
        const user = await users.updateName(req.user.id, name);
        if (!user) return res.status(404).json({ message: 'ไม่พบผู้ใช้' });
        res.json(user);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'server error' });
    }
};

// รูปถูกบันทึกโดย multer ใน authRoutes แล้ว (img_mem/<id>.jpg)
export const uploadAvatar = (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'กรุณาเลือกไฟล์รูปภาพ (JPG หรือ PNG)' });
    res.json({ message: 'อัปโหลดรูปสำเร็จ' });
};

export const logout = (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'ออกจากระบบแล้ว' });
};