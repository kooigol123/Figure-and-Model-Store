import * as users from '../services/userService.js';
import database from '../services/db.js';
export const listUsers = async (req, res) => res.json(await users.list());

// คำสั่งซื้อของสมาชิกทุกคน (เฉพาะตะกร้าที่มีสินค้า) พร้อมยอดรวม
export const listOrders = async (req, res) => {
    try {
        const result = await database.query(`
            SELECT ct."cartId", ct."cartDate", ct."cartCf", ct."cartPay", ct."cartSend", ct."cartRecv",
                   u.id AS "userId", u.name AS "userName", u.email AS "userEmail",
                   COALESCE(SUM(ctd.qty), 0) AS total_items,
                   COALESCE(SUM(ctd.price * ctd.qty), 0) AS total_amount
            FROM carts ct
            JOIN users u ON u.id = ct."userId"
            JOIN "cartDtl" ctd ON ctd."cartId" = ct."cartId"
            GROUP BY ct."cartId", u.id
            ORDER BY ct."cartId" DESC
        `);
        res.json(result.rows);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'server error' });
    }
};

// สลับ role: เฉพาะ admin หลัก (admin@model.store) เท่านั้น
export const changeRole = async (req, res) => {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role))
        return res.status(400).json({ message: 'role ไม่ถูกต้อง' });
    if (Number(req.params.id) === req.user.id)
        return res.status(400).json({ message: 'ห้ามเปลี่ยน role ตัวเอง' });

    const me = await users.findById(req.user.id);
    if (me?.email !== users.MAIN_ADMIN_EMAIL)
        return res.status(403).json({ message: 'เฉพาะ admin หลักเท่านั้นที่สลับ role ได้' });

    const target = await users.findById(req.params.id);
    if (!target) return res.status(404).json({ message: 'ไม่พบผู้ใช้' });
    if (target.email === users.MAIN_ADMIN_EMAIL)
        return res.status(400).json({ message: 'ห้ามเปลี่ยน role ของ admin หลัก' });

    res.json(await users.updateRole(req.params.id, role));
};

// เปลี่ยนสถานะ active / suspended: admin ทุกคนทำได้ ยกเว้นกับตัวเองและ admin หลัก
export const changeStatus = async (req, res) => {
    const { status } = req.body;
    if (!['active', 'suspended'].includes(status))
        return res.status(400).json({ message: 'status ไม่ถูกต้อง' });
    if (Number(req.params.id) === req.user.id)
        return res.status(400).json({ message: 'ห้ามเปลี่ยนสถานะตัวเอง' });

    const target = await users.findById(req.params.id);
    if (!target) return res.status(404).json({ message: 'ไม่พบผู้ใช้' });
    if (target.email === users.MAIN_ADMIN_EMAIL)
        return res.status(400).json({ message: 'ห้ามเปลี่ยนสถานะของ admin หลัก' });

    res.json(await users.updateStatus(req.params.id, status));
};

export const deleteUser = async (req, res) => {
    if (Number(req.params.id) === req.user.id)
        return res.status(400).json({ message: 'ห้ามลบตัวเอง' });
    const ok = await users.remove(req.params.id);
    if (!ok) return res.status(404).json({ message: 'ไม่พบผู้ใช้' });
    res.json({ message: 'ลบแล้ว' });
};
