/*用户身份验证和管理：该文件定义了一个 Express 路由器，处理与用户登录、注册、登出和个人资料相关的路由。
路由处理：
POST /login：处理用户登录请求，验证用户名和密码。
POST /logout：处理用户登出请求，销毁会话。
POST /register：处理用户注册请求，创建新用户。
GET /me：获取当前登录用户的信息。
GET /profile：根据用户名获取用户的详细信息。
POST /update-profile：更新用户的个人资料信息。
*/
// login.js
import express from 'express';
import multer from 'multer';
import bcrypt from 'bcrypt';
import client from './dbclient.js';

const route = express.Router();
const form = multer();

const usersCollection = client.db('projectdb').collection('users');

// 用户登录
route.post('/login', form.none(), async (req, res) => {
  const { username, password } = req.body;

  try {
    // 查找用户
    const user = await usersCollection.findOne({ username });

    if (!user || !user.enabled) {
      return res.status(401).json({ status: 'failed', message: 'Invalid username or account disabled' });
    }

    // 验证密码
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      req.session.logged = true;
      req.session.user = {
        username: user.username,
        role: user.role,
      };
      res.json({ status: 'success', message: 'Login successful',user: {
        username: user.username,
        role: user.role,
      }, });
    } else {
      res.status(401).json({ status: 'failed', message: 'Invalid password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// 用户注册
route.post('/register', form.none(), async (req, res) => {
  const { username, password, nickname, email, gender, birthdate } = req.body;

  if (!username || !password || !nickname || !email || !gender || !birthdate) {
    return res.status(400).json({ status: 'failed', message: 'All fields are required' });
  }

  try {
    // 检查用户名是否已存在
    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ status: 'failed', message: 'Username already exists' });
    }

    // 哈希密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建新用户
    await usersCollection.insertOne({
      username,
      password: hashedPassword,
      nickname,
      email,
      gender,
      birthdate,
      role: 'user',
      enabled: true,
    });

    res.json({ status: 'success', message: 'Registration successful' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// 获取当前用户信息
route.get('/me', async (req, res) => {
  if (req.session.logged && req.session.user) {
    const username = req.session.user.username;
    try {
      const user = await usersCollection.findOne({ username: username });
      if (user) {
        // 不返回密码等敏感信息
        const { password, ...userWithoutPassword } = user;
        res.json({
          status: 'success',
          user: userWithoutPassword,
        });
      } else {
        res.status(404).json({ status: 'error', message: 'User not found' });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
  } else {
    res.status(401).json({ status: 'error', message: 'User not logged in' });
  }
});

// 更新用户个人资料
route.post('/update-profile', async (req, res) => {
  if (!req.session || !req.session.user || !req.session.user.username) {
    return res.status(401).json({ status: 'failed', message: 'Unauthorized access' });
  }

  const username = req.session.user.username;
  const { nickname, email, gender, birthdate } = req.body;

  if (!nickname || !email || !gender || !birthdate) {
    return res.status(400).json({ status: 'failed', message: 'All fields are required' });
  }

  try {
    // 更新用户信息
    const result = await usersCollection.updateOne(
      { username },
      {
        $set: {
          nickname,
          email,
          gender,
          birthdate,
        },
      }
    );

    if (result.modifiedCount > 0) {
      res.json({ status: 'success', message: 'Profile updated successfully' });
    } else {
      res.status(500).json({ status: 'failed', message: 'Failed to update profile' });
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ status: 'failed', message: 'An error occurred while updating the profile' });
  }
});

// 用户注销
route.post('/logout', (req, res) => {
  if (req.session.logged) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        res.status(500).json({ status: 'error', message: 'Failed to logout' });
      } else {
        res.status(200).json({ status: 'success', message: 'Logged out successfully' });
      }
    });
  } else {
    res.status(401).json({ status: 'error', message: 'User not logged in' });
  }
});

export default route;

