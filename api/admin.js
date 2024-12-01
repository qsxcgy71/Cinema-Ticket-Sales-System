/*import express from 'express';
import multer from 'multer';
import { Router } from 'express';
import fs from 'fs/promises';
import path from 'path';
import session from 'express-session';
import bodyParser from 'body-parser';
import { ObjectId } from 'mongodb'; // 导入 ObjectId

import client from './dbclient.js'; // 确保路径正确

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = `${file.fieldname}-${Date.now()}${ext}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

const router = Router();

router.use(bodyParser.json());
const app = express();
app.use(bodyParser.json());
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

router.post('/movies', upload.array('movieImage'), async (req, res) => {
  try {
    const usersArray = JSON.parse(req.body.users);
    const filePath = './public/movies.json';

    // Read the existing movies.json file
    let existingMovies = [];
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      existingMovies = JSON.parse(data);
    } catch (err) {
      console.error('Error reading existing movies file', err);
    }
    
    let imagePath;
    const movies = usersArray.map((user, index) => {
      if (req.files[index].originalname == 'empty') {
        // Search for the image in the existing movies
        const existingMovie = existingMovies.find((movie) => movie.movieName === user.movieName);
        if (existingMovie) {
          imagePath = existingMovie.image;
        }
      } else {
        imagePath = req.files[index].path;
      }
      imagePath = imagePath.replace(/^public[\\/]/, '');
      return {
        movieName: user.movieName,
        category: user.category,
        description: user.description,
        image: imagePath,
        showtimes: user.showtimes || [],
      };
    });

    // Write the updated movies list back to movies.json
    await fs.writeFile(filePath, JSON.stringify(movies, null, 2), 'utf-8');

    res.status(200).json({ status: 'success' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'An error occurred while processing the data' });
  }
});

// 新增：获取所有用户信息（不包括密码）
router.get('/users', isAdmin, async (req, res) => {
  try {
    const usersCollection = client.db('projectdb').collection('users');
    const users = await usersCollection.find({}, { projection: { password: 0 } }).toArray();
    res.json({ status: 'success', users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ status: 'failed', message: 'An error occurred while fetching users' });
  }
});
// 新增：更新用户信息
router.put('/users/:id', isAdmin, async (req, res) => {
  const userId = req.params.id;
  const updateData = req.body;

  // 防止更新敏感信息
  delete updateData.password;
  delete updateData.role; // 如果不希望管理员修改用户角色，可以保留这行

  try {
    const usersCollection = client.db('projectdb').collection('users');
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateData }
    );

    if (result.modifiedCount === 1) {
      res.json({ status: 'success', message: 'User updated successfully' });
    } else {
      res.status(404).json({ status: 'failed', message: 'User not found or no changes made' });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ status: 'failed', message: 'An error occurred while updating the user' });
  }
});

// 新增：删除用户
router.delete('/users/:id', isAdmin, async (req, res) => {
  const userId = req.params.id;

  try {
    const usersCollection = client.db('projectdb').collection('users');
    const result = await usersCollection.deleteOne({ _id: new ObjectId(userId) });

    if (result.deletedCount === 1) {
      res.json({ status: 'success', message: 'User deleted successfully' });
    } else {
      res.status(404).json({ status: 'failed', message: 'User not found' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ status: 'failed', message: 'An error occurred while deleting the user' });
  }
});

export default router;*/
// admin.js
import express from 'express';
import multer from 'multer';
import { Router } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { ObjectId } from 'mongodb'; // 导入 ObjectId
import client from './dbclient.js'; // 确保路径正确

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = `${file.fieldname}-${Date.now()}${ext}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

// 创建路由器
const router = Router();

// 中间件：检查用户是否为管理员
function isAdmin(req, res, next) {
  if (req.session && req.session.logged && req.session.user && req.session.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ status: 'failed', message: 'Unauthorized access' });
  }
}

// 现有的 POST /movies 路由
router.post('/movies', upload.array('movieImage'), async (req, res) => {
  // 您现有的 /movies 路由代码
});

// 新增：获取所有用户信息（不包括密码）
router.get('/users', isAdmin, async (req, res) => {
  try {
    const usersCollection = client.db('projectdb').collection('users');
    const users = await usersCollection.find({}, { projection: { password: 0 } }).toArray();
    res.json({ status: 'success', users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ status: 'failed', message: 'An error occurred while fetching users' });
  }
});

// 新增：更新用户信息
router.put('/users/:id', isAdmin, async (req, res) => {
  const userId = req.params.id;
  const updateData = req.body;

  // 防止更新敏感信息
  delete updateData.password;
  delete updateData.role; // 如果不希望管理员修改用户角色，可以保留这行

  try {
    const usersCollection = client.db('projectdb').collection('users');
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateData }
    );

    if (result.modifiedCount === 1) {
      res.json({ status: 'success', message: 'User updated successfully' });
    } else {
      res.status(404).json({ status: 'failed', message: 'User not found or no changes made' });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ status: 'failed', message: 'An error occurred while updating the user' });
  }
});

// 新增：删除用户
router.delete('/users/:id', isAdmin, async (req, res) => {
  const userId = req.params.id;

  try {
    const usersCollection = client.db('projectdb').collection('users');
    const result = await usersCollection.deleteOne({ _id: new ObjectId(userId) });

    if (result.deletedCount === 1) {
      res.json({ status: 'success', message: 'User deleted successfully' });
    } else {
      res.status(404).json({ status: 'failed', message: 'User not found' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ status: 'failed', message: 'An error occurred while deleting the user' });
  }
});

export default router;
