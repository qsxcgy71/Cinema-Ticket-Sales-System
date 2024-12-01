import express from 'express';
const ticketRouter = express.Router();

// 假设有一些数据库操作，处理票务信息等
ticketRouter.post('/generate-ticket', (req, res) => {
  const { movie, seats, totalPrice } = req.body;

  if (!movie || !seats || !totalPrice) {
    return res.status(400).json({ status: 'failed', message: 'Invalid ticket data' });
  }

  // 生成二维码相关数据
  const qrCodeData = `movie:${movie.name}|seats:${seats.join(', ')}`;

  // 模拟生成票务成功，返回票务信息
  res.json({
    status: 'success',
    ticket: {
      movie,
      seats,
      totalPrice,
      qrCodeData,
    },
  });
});

export default ticketRouter;
