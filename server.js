// server.js

// 1. โหลด Environment Variables จากไฟล์ .env
// package 'dotenv' จะมองหาไฟล์ชื่อ '.env' ใน root directory โดยอัตโนมัติ
require('dotenv').config();

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0'; // 👈 เปลี่ยนเป็น 0.0.0.0 เพื่อให้เข้าถึงได้จากภายนอก Docker/VM

// 2. อ่านค่า PORT จาก .env, ถ้าไม่มีให้ใช้ 3000 เป็นค่าเริ่มต้น
const port = parseInt(process.env.PORT || '3000', 10);

// 3. สร้าง Next.js app instance
// ไม่ต้องใช้ 'dir' อีกต่อไป เพราะเราจะรันจาก root ของ standalone build
const app = next({ 
  dev, 
  hostname, 
  port,
});

const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  })
  .once('error', (err) => {
    console.error(err);
    process.exit(1);
  })
  .listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});