import express from "express";
import cors from "cors"; // 解决跨域问题
const app = express();

app.use(cors()); // 启用跨域

// 示例事件数据库
const events = [
  "A Clockwork Orange",
  "Batman",
  "The GodFather",
  "After Hours",
  "Alien",
  "Lord of War",
];

app.get("/search-suggestions", (req, res) => {
  const query = req.query.q.toLowerCase();
  const suggestions = events.filter((event) =>
    event.toLowerCase().includes(query)
  );
  res.json({ suggestions });
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
