// api/eventAdmin.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import { MongoClient } from 'mongodb';
import client from './dbclient.js'; // 确保 dbclient.js 已连接到 MongoDB
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const db = client.db('projectdb');
const moviesCollection = db.collection('movies');

// 配置 multer 用于处理文件上传（使用内存存储）
const storage = multer.memoryStorage(); // 使用内存存储而不是磁盘存储
const upload = multer({ storage: storage });

// 权限限制中间件（如果需要）
function isAdmin(req, res, next) {
  if (req.session && req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ error: 'Forbidden: Admins only' });
}

// 测试路由
router.get('/test', (req, res) => {
  res.send('Test route is working');
});

// 获取所有电影，支持筛选
router.get('/movies', async (req, res) => {
  try {
    const filters = req.query;
    const query = {};

    if (filters.title) {
      query.name = { $regex: filters.title, $options: 'i' };
    }
    if (filters.date) {
      query.date = filters.date;
    }
    if (filters.location) {
      query.location = { $regex: filters.location, $options: 'i' };
    }
    if (filters.tag) {
      query.tags = { $regex: filters.tag, $options: 'i' };
    }

    const movies = await moviesCollection.find(query).toArray();
    res.json(movies);
  } catch (err) {
    console.error('Error handling /movies request:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 获取单个电影
router.get('/movies/:name', async (req, res) => {
  try {
    const movie = await moviesCollection.findOne({ name: req.params.name });

    if (!movie) {
      return res.status(404).json({ error: '电影未找到' });
    }

    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 添加新电影
router.post('/movies', isAdmin, upload.single('movie-poster'), async (req, res) => {
  try {
    const posterBuffer = req.file ? req.file.buffer : null;
    let posterPath = '/assets/default.png'; // 默认海报路径

    if (posterBuffer) {
      // 将海报上传到外部存储，如 AWS S3，并获取 URL
      // 这里假设使用一个函数 uploadToS3 返回海报的 URL
      // posterPath = await uploadToS3(req.file);
      
      // 由于具体实现依赖于外部服务，暂时保留默认路径
    }

    const newMovie = {
      name: req.body.name,
      date: req.body.date,
      time: req.body.time,
      location: req.body.location,
      prices: {
        normal: parseFloat(req.body.prices.normal),
        premium: parseFloat(req.body.prices.premium),
      },
      tags: req.body.tags || [],
      poster: posterPath,
    };

    await moviesCollection.insertOne(newMovie);
    res.json(newMovie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 更新电影
router.put('/movies/:name', isAdmin, upload.single('movie-poster'), async (req, res) => {
  try {
    const updateFields = {};

    if (req.body.name) updateFields.name = req.body.name;
    if (req.body.date) updateFields.date = req.body.date;
    if (req.body.time) updateFields.time = req.body.time;
    if (req.body.location) updateFields.location = req.body.location;
    if (req.body.prices) {
      updateFields['prices.normal'] = parseFloat(req.body.prices.normal) || undefined;
      updateFields['prices.premium'] = parseFloat(req.body.prices.premium) || undefined;
    }
    if (req.body.tags) updateFields.tags = req.body.tags;
    if (req.file) {
      // 上传新海报到外部存储，并更新 poster 字段
      // updateFields.poster = await uploadToS3(req.file);
      
      // 暂时保留默认路径
      updateFields.poster = `/assets/${req.file.originalname}`;
    }

    const result = await moviesCollection.updateOne(
      { name: req.params.name },
      { $set: updateFields }
    );

    if (result.modifiedCount > 0) {
      const updatedMovie = await moviesCollection.findOne({ name: req.params.name });
      res.json(updatedMovie);
    } else {
      res.status(404).json({ error: '电影未找到或未更新' });
    }
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// 删除电影
router.delete('/movies/:name', isAdmin, async (req, res) => {
  try {
    const result = await moviesCollection.deleteOne({ name: req.params.name });

    if (result.deletedCount === 1) {
      // 如果使用外部存储，删除海报文件
      // await deleteFromS3(posterPath);
      res.json({ message: 'deleted' });
    } else {
      res.status(404).json({ error: '电影未找到' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 搜索建议接口
router.get('/search-suggestions', async (req, res) => {
  try {
    const query = req.query.q || '';
    const suggestions = await moviesCollection.find(
      { name: { $regex: query, $options: 'i' } },
      { projection: { name: 1, _id: 0 } }
    )
    .limit(10)
    .toArray();

    res.json({ suggestions: suggestions.map(m => m.name) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
