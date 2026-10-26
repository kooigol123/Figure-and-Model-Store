import db from './db.js';

const PUBLIC = 'id, name, email, role, created_at';

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

export const updateRole = async (id, role) =>
  (await db.query(`UPDATE users SET role=$1 WHERE id=$2 RETURNING ${PUBLIC}`, [role, id])).rows[0];

export const remove = async (id) =>
  (await db.query('DELETE FROM users WHERE id = $1', [id])).rowCount > 0;
