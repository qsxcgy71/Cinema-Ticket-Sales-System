// index.js
import express from 'express';
import session from 'express-session';
import route from './login.js';
import mongostore from 'connect-mongo';
import client from './dbclient.js';
import profileRoute from "./profile.js";
import eventAdminRouter from './eventAdmin.js'; 
import bookingsRouter from './bookings.js'; 
import seatsRouter from './seats.js';
import ticketRouter from './ticket.js'; // 引入 ticket.js
import adminRouter from './admin.js'; // 引入 admin.js
import eventRouter from './event.js'; // 引入 event.js 路由
import serverless from 'serverless-http';

import dotenv from 'dotenv';
dotenv.config(); // 加载环境变量
const app = express(); // 确保 app 被定义

// 中间件
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'eie4432_project',
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true },
    store: mongostore.create({
      client,
      dbName: 'projectdb',
      collectionName: 'session',
    }),
  })
);

// 根路由，根据用户登录状态重定向
app.get('/', (req, res) => {
  if (req.session.logged) {
    res.redirect('/index.html');
  } else {
    res.redirect('/login.html');
  }
});

// 使用登录相关的路由
app.use('/auth', route);

// 使用管理员相关的路由
app.use('/api/admin', adminRouter);

// 使用其他 API 路由
app.use('/api', eventAdminRouter);
app.use('/api/bookings', bookingsRouter); 
app.use('/api/seats', seatsRouter);
app.use('/api/ticket', ticketRouter);
app.use('/api/events', eventRouter);

// 销毁服务器端会话
route.post('/logout', (req, res) => {
  if (req.session.logged) {   
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
        console.error("Error destroying session:", err);
        res.status(500).json({ status: 'error', message: 'Failed to logout' });
      } else {
        res.status(200).json({ status: 'success', message: 'Logged out successfully' });
      }
    });
  } else {
    res.status(401).json({ status: 'error', message: 'User not logged in' });
  }
});

/* 启动服务器
app.listen(port, () => {
  console.log(new Date().toLocaleString('en-HK'));
  console.log(`Server started at http://127.0.0.1:${port}`);
});*/
// 导出 handler 以供 Vercel 使用
export const handler = serverless(app);
