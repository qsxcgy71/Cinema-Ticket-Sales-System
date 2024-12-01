/*服务器主入口文件：该文件初始化 Express 应用程序，设置中间件，定义路由，并启动服务器。
中间件配置：
使用 express.json() 解析 JSON 请求体。
使用 express-session 管理会话，使用 MongoDB 作为会话存储。
路由配置：
静态文件服务：app.use('/', express.static('static'));，将 static 目录作为静态文件目录。
路由模块：
app.use('/auth', route);：挂载 login.js 中的路由到 /auth 前缀。
app.use('/api', eventAdminRouter);：挂载 eventAdmin.js 中的路由到 /api 前缀。
启动服务器：监听指定端口，启动服务器。*/
import express from 'express';
import session from 'express-session';
import route from './login.js';
import mongostore from 'connect-mongo';
import client from './dbclient.js';
import profileRoute from "./profile.js";
import eventAdminRouter from './eventAdmin.js'; 
import bookingsRouter from './bookings.js'; 
import seatsRouter from './seats.js';

const app = express();
var port = 8080;

app.use(express.json());

app.use(
  session({
    secret: 'eie4432_project',
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

app.use('/', express.static('static'));



app.get('/', (req, res) => {
  res.redirect('/index.html');
});
//使用登录路由
app.use('/auth', route);
app.use('/api', eventAdminRouter);
app.use('/api/bookings', bookingsRouter); 
app.use('/api/seats', seatsRouter);


app.get('/', (req, res) => {
  if (req.session.logged) {
    res.redirect('/index.html');
  } else {
    res.redirect('/login.html');
  }
});


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
//启动服务器
app.listen(port, () => {
  console.log(Date().toLocaleString('en-HK'));
  console.log('Server started at http://127.0.0.1:8080');
});
