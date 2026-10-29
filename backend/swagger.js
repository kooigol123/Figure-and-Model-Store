const port = process.env.PORT || 3000;

const userSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer', example: 2 },
    name: { type: 'string', example: 'Tan' },
    email: { type: 'string', example: 'tan@test.com' },
    role: { type: 'string', enum: ['user', 'admin'] },
    created_at: { type: 'string', format: 'date-time' },
  },
};
const userRef = { $ref: '#/components/schemas/User' };
const msg = (description) => ({
  description,
  content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' } } } } },
});
const ok = (description, schema) => ({ description, content: { 'application/json': { schema } } });
const body = (schema) => ({ required: true, content: { 'application/json': { schema } } });
const secured = [{ bearerAuth: [] }];
const idParam = { name: 'id', in: 'path', required: true, schema: { type: 'integer' } };

export default {
  openapi: '3.0.3',
  info: { title: 'Auth API', version: '1.0.0' },
  servers: [{ url: `http://localhost:${port}` }],
  components: {
    securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
    schemas: { User: userSchema },
  },
  paths: {
    '/auth/register': {
      post: {
        tags: ['Auth'], summary: 'สมัครสมาชิก (role = user เสมอ)',
        requestBody: body({
          type: 'object', required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', example: 'Tan' },
            email: { type: 'string', example: 'tan@test.com' },
            password: { type: 'string', minLength: 8, example: '12345678' },
          },
        }),
        responses: { 201: ok('สำเร็จ', userRef), 400: msg('ข้อมูลไม่ถูกต้อง'), 409: msg('อีเมลซ้ำ') },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'], summary: 'เข้าสู่ระบบ (user และ admin ใช้ตัวเดียวกัน)',
        requestBody: body({
          type: 'object', required: ['email', 'password'],
          properties: {
            email: { type: 'string', example: 'admin@gmail.com' },
            password: { type: 'string', example: '1234' },
          },
        }),
        responses: {
          200: ok('ได้ token', { type: 'object', properties: { token: { type: 'string' }, user: userRef } }),
          400: msg('ข้อมูลไม่ครบ'), 401: msg('อีเมลหรือรหัสผ่านผิด'),
        },
      },
    },
    '/auth/me': {
      get: {
        tags: ['Auth'], summary: 'ดูข้อมูลตัวเอง', security: secured,
        responses: { 200: ok('สำเร็จ', userRef), 401: msg('ไม่ได้ login') },
      },
    },
    '/admin/users': {
      get: {
        tags: ['Admin'], summary: 'รายชื่อ user ทั้งหมด', security: secured,
        responses: {
          200: ok('สำเร็จ', { type: 'array', items: userRef }),
          401: msg('ไม่ได้ login'), 403: msg('ไม่ใช่ admin'),
        },
      },
    },
    '/admin/users/{id}/role': {
      patch: {
        tags: ['Admin'], summary: 'เปลี่ยน role', security: secured, parameters: [idParam],
        requestBody: body({
          type: 'object', required: ['role'],
          properties: { role: { type: 'string', enum: ['user', 'admin'] } },
        }),
        responses: {
          200: ok('สำเร็จ', userRef), 400: msg('role ไม่ถูกต้อง / เปลี่ยนตัวเอง'),
          401: msg('ไม่ได้ login'), 403: msg('ไม่ใช่ admin'), 404: msg('ไม่พบผู้ใช้'),
        },
      },
    },
    '/admin/users/{id}': {
      delete: {
        tags: ['Admin'], summary: 'ลบ user', security: secured, parameters: [idParam],
        responses: {
          200: msg('ลบแล้ว'), 400: msg('ลบตัวเองไม่ได้'), 401: msg('ไม่ได้ login'),
          403: msg('ไม่ใช่ admin'), 404: msg('ไม่พบผู้ใช้'),
        },
      },
    },
  },
};

//http://localhost:3000/api-docs