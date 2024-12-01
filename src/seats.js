// seats.js
import express from 'express';
import client from './dbclient.js'; // 导入 client 对象

const router = express.Router();

// 因为在 dbclient.js 中没有导出 db，所以我们需要在这里获取 db 对象
const db = client.db('projectdb');
const seatsCollection = db.collection('seats');

// 获取指定影院的座位状态
router.get('/:cinemaId', async (req, res) => {
  const cinemaId = req.params.cinemaId;
  try {
    const seatData = await seatsCollection.findOne({ cinemaId: cinemaId });
    if (seatData) {
      res.json({ seats: seatData.seats });
    } else {
      res.json({ seats: {} });
    }
  } catch (err) {
    console.error('Error fetching seat data:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 更新指定影院的座位状态
router.post('/:cinemaId', async (req, res) => {
  const cinemaId = req.params.cinemaId;
  const seats = req.body.seats;

  try {
    await seatsCollection.updateOne(
      { cinemaId: cinemaId },
      { $set: { seats: seats } },
      { upsert: true }
    );
    res.json({ message: 'Seat availability updated successfully.' });
    
  } catch (err) {
    console.error('Error saving seat data:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
