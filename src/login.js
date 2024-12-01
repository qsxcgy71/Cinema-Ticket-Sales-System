/*用户身份验证和管理：该文件定义了一个 Express 路由器，处理与用户登录、注册、登出和个人资料相关的路由。
路由处理：
POST /login：处理用户登录请求，验证用户名和密码。
POST /logout：处理用户登出请求，销毁会话。
POST /register：处理用户注册请求，创建新用户。
GET /me：获取当前登录用户的信息。
GET /profile：根据用户名获取用户的详细信息。
POST /update-profile：更新用户的个人资料信息。*/
import express from 'express';
import multer from 'multer';
import fs from 'fs/promises';
import { validate_user, update_user, fetch_user, username_exist } from './userdb.js';

const users = new Map();
const route = express.Router();
const form = multer();

route.use(express.urlencoded({ extended: true }));

route.post('/login', form.none(), async (req, res) => {
  req.session.logged = false;

  const user = await validate_user(req.body.username, req.body.password);

  if (!user) {
    res.status(401).json({ status: 'failed', message: 'Incorrect username and password' });
    return;
  }
  if (!user.enabled) {
    res.status(401).json({ status: 'failed', message: `User '${user.username}' is currently disabled` });
    return;
  }

  req.session.user = {
    username: user.username,
    role: user.role,
  };

  req.session.logged = true;
  req.session.timestamp = Date.now();

  res.json({
    status: 'success',
    user: req.session.user,
  });
});

route.post('/logout', async (req, res) => {
  if (req.session.logged) {
    req.session.logged = false;
    req.session.username = null;
    req.session.role = null;
    req.session.destroy();
    res.end();
  } else {
    res.status(401).json({ status: 'failed', message: 'Unauthorized' });
  }
});



route.post('/register', form.none(), async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const nickname = req.body.nickname;
  const email = req.body.email;
  const gender = req.body.gender;
  const birthdate = req.body.birthdate;
  const role = req.body.role;
  const enabled = true;

  if (!username || !password) {
    res.status(400).json({ status: 'failed', message: 'Missing fields' });
    return;
  }

  if (username.length < 3) {
    res.status(400).json({ status: 'failed', message: 'Username must be at least 3 characters' });
    return;
  }

  if (await username_exist(username)) {
    res.status(400).json({ status: 'failed', message: `Username ${username} already exists` });
    return;
  }

  if (password.length < 8) {
    res.status(400).json({ status: 'failed', message: 'Password must be at least 8 characters' });
    return;
  }

  if (role != 'user') {
    res.status(400).json({ status: 'failed', message: 'Role can only be user' });
    return;
  }

  const success = await update_user(username, nickname, password, email, gender, birthdate, role, enabled);

  if (success) {
    res.json({
      status: 'success',
      user: {
        username: username,
        nickname: nickname,
        email: email,
        gender: gender,
        birthdate: birthdate,
        role: role,
        enabled: enabled,
      },
    });
  } else {
    res.status(500).json({ status: 'failed', message: 'Account created but unable to save into the database' });
    return;
  }
});

route.get('/me', (req, res) => {
  if (req.session.logged) {
    res.json({
      status: 'success',
      user: req.session.user,
    });
  } else {
    res.status(401).json({
      status: 'error',
      message: 'User not authenticated',
    });
  }
});

/*
route.get('/me', async (req, res) => {
  if (!req.session.logged) {
    return res.status(401).json({
      status: 'error',
      message: 'User not authenticated',
    });
  }

  // 获取完整的用户信息
  const user = await fetch_user(req.session.user.username);

  if (user) {
    res.json({
      status: 'success',
      user: {
        username: user.username,
        nickname: user.nickname,
        email: user.email,
        gender: user.gender,
        birthdate: user.birthdate,
        role: user.role,
        enabled: user.enabled,
      },
    });
  } else {
    res.status(404).json({ status: 'error', message: 'User not found' });
  }
});*/

//用于根据uername获取详细信息
route.get('/profile', async (req, res) => {
  if (!req.session.logged) {
    return res.status(401).json({ status: 'error', message: 'User not authenticated' });
  }

  const username = req.session.user.username;

  try {
    const user = await fetch_user(username);
    if (user) {
      res.json({
        status: 'success',
        user: {
          username: user.username,
          nickname: user.nickname,
          email: user.email,
          gender: user.gender,
          birthdate: user.birthdate,
        },
      });
    } else {
      res.status(404).json({ status: 'error', message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

//用于更新信息

route.post('/update-profile', form.none(), async (req, res) => {
  if (!req.session.logged) {
    return res.status(401).json({ status: 'error', message: 'User not authenticated' });
  }

  const username = req.session.user.username; // 获取当前登录用户的用户名
  const { nickname, email, gender, birthdate } = req.body; // 获取更新的数据
  console.log("Update Profile Request Body:", req.body);


  // 调用 `update_user` 方法来更新用户信息
  try {
    const success = await update_user(username, nickname, null, email, gender, birthdate, null, null);

    if (success) {
      //req.session.user.nickname = nickname; // 更新 session 中的用户信息
      res.json({ status: 'success', message: 'Profile updated successfully' });
    } else {
      res.status(500).json({ status: 'error', message: 'Failed to update profile' });
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});



export default route;
