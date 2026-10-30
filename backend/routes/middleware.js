import jwt from 'jsonwebtoken';

export const auth = (req, res, next) => {
    const token = req.cookies?.token || (req.headers.authorization || '').replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'ไม่พบ token' });
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET); // { id, role }
        next();
    } catch {
        res.status(401).json({ message: 'token ไม่ถูกต้องหรือหมดอายุ' });
    }
};

// ใช้: requireRole('admin') หรือ requireRole('admin','staff')
export const requireRole = (...roles) => (req, res, next) =>
    roles.includes(req.user.role)
        ? next()
        : res.status(403).json({ message: 'ไม่มีสิทธิ์เข้าถึง' });