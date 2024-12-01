// bookings.js
import express from 'express';
import client from './dbclient.js';

const router = express.Router();

// 获取 bookings 集合
const db = client.db('projectdb');
const bookingsCollection = db.collection('bookings');

// 添加新的购票信息
router.post('/', async (req, res) => {
  try {
    const bookingInfo = req.body;

    // 添加时间戳
    bookingInfo.createdAt = new Date();

    // 插入到数据库
    const result = await bookingsCollection.insertOne(bookingInfo);

    res.status(201).json({ message: 'Booking information saved successfully', bookingId: result.insertedId });
  } catch (err) {
    console.error('Error saving booking information:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 导出路由
export default router;
