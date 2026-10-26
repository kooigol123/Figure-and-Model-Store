import * as users from '../services/userService.js';
export const listUsers = async (req, res) => res.json(await users.list());

export const changeRole = async (req, res) => {
  const { role } = req.body;
  if (!['user', 'admin'].includes(role))
    return res.status(400).json({ message: 'role ไม่ถูกต้อง' });
  if (Number(req.params.id) === req.user.id)
    return res.status(400).json({ message: 'ห้ามเปลี่ยน role ตัวเอง' });
  const user = await users.updateRole(req.params.id, role);
  if (!user) return res.status(404).json({ message: 'ไม่พบผู้ใช้' });
  res.json(user);
};

export const deleteUser = async (req, res) => {
  if (Number(req.params.id) === req.user.id)
    return res.status(400).json({ message: 'ห้ามลบตัวเอง' });
  const ok = await users.remove(req.params.id);
  if (!ok) return res.status(404).json({ message: 'ไม่พบผู้ใช้' });
  res.json({ message: 'ลบแล้ว' });
};
