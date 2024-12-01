import express from "express";
import cors from "cors"; // 解决跨域问题
const app = express();
const router = express.Router(); // 确保 router 被正确定义

// 启用跨域（如果需要在特定路由中启用，可以在主应用中统一配置）
router.use(cors());
app.use(cors()); // 启用跨域
//可以提供静态文件
//app.use('/', express.static('public'));

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

/*app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});*/
export default router;
