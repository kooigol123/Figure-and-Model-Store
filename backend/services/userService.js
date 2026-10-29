import db from './db.js';

const PUBLIC = 'id, name, email, role, status, created_at';

// admin หลัก: ห้ามถูกเปลี่ยนสถานะ/role และเป็นคนเดียวที่สลับ role ให้คนอื่นได้
export const MAIN_ADMIN_EMAIL = 'admin@model.store';

export const create = async (name, email, passwordHash) => {
    const { rows } = await db.query(
        `INSERT INTO users (name, email, password) VALUES ($1,$2,$3) RETURNING ${PUBLIC}`,
        [name, email, passwordHash]
    );
    return rows[0];
};

export const findByEmail = async (email) =>
    (await db.query('SELECT * FROM users WHERE email = $1', [email])).rows[0];

export const findById = async (id) =>
    (await db.query(`SELECT ${PUBLIC} FROM users WHERE id = $1`, [id])).rows[0];

export const list = async () =>
    (await db.query(`SELECT ${PUBLIC} FROM users ORDER BY id`)).rows;

export const updateName = async (id, name) =>
    (await db.query(`UPDATE users SET name=$1 WHERE id=$2 RETURNING ${PUBLIC}`, [name, id])).rows[0];

export const updateStatus = async (id, status) =>
    (await db.query(`UPDATE users SET status=$1 WHERE id=$2 RETURNING ${PUBLIC}`, [status, id])).rows[0];

export const updateRole = async (id, role) =>
    (await db.query(`UPDATE users SET role=$1 WHERE id=$2 RETURNING ${PUBLIC}`, [role, id])).rows[0];

export const remove = async (id) =>
    (await db.query('DELETE FROM users WHERE id = $1', [id])).rowCount > 0;