// src/eventAdmin.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const moviesFilePath = path.join(__dirname, '../static/movies.json');
router.get('/test', (req, res) => {
  res.send('Test route is working');
});

async function readMovies() {
  try {
    const data = await fs.readFile(moviesFilePath, 'utf-8');
    console.log('Successfully read movies.json');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading movies.json:', error);
    throw error; // 抛出错误，以便上层捕获
  }
}


// 写入 movies.json
async function writeMovies(movies) {
  await fs.writeFile(moviesFilePath, JSON.stringify(movies, null, 2), 'utf-8');
}

// 配置 multer 用于处理文件上传（如果需要）
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //cb(null, 'static/assets/');
    cb(null, path.join(__dirname, '../static/assets/')); // 确保路径正确
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});
const upload = multer({ storage: storage });

// 权限限制中间件（如果需要）
function isAdmin(req, res, next) {
  if (req.session && req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ error: 'Forbidden: Admins only' });
}

// 获取所有电影，支持筛选
router.get('/movies', async (req, res) => {
  try {
    const filters = req.query;
    const movies = await readMovies();
    
    // 筛选逻辑
    const filteredMovies = movies.filter(movie => {
      return (
        (!filters.title || movie.name.toLowerCase().includes(filters.title.toLowerCase())) &&
        (!filters.date || movie.date === filters.date) &&
        (!filters.location || movie.location.toLowerCase().includes(filters.location.toLowerCase())) &&
        (!filters.tag || (movie.tags || []).some(tag => tag.toLowerCase().includes(filters.tag.toLowerCase())))
      );
    });

    res.json(filteredMovies);
  } catch (err) {
    console.error('Error handling /movies request:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 获取单个电影
router.get('/movies/:name', async (req, res) => {
  try {
    const movies = await readMovies();
    const movie = movies.find(m => m.name === req.params.name);

    if (!movie) {
      return res.status(404).json({ error: '电影未找到' });
    }

    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 添加新电影
router.post('/movies',  upload.single('movie-poster'),async (req, res) => {
  console.log(req.file); // 打印上传的文件信息
  try {
    const movies = await readMovies();

    // 获取上传文件的路径
    const posterPath = req.file ? `/assets/${req.file.filename}` : '/assets/default.png';

    const newMovie = {
      name: req.body.name,
      date: req.body.date,
      time: req.body.time,
      location: req.body.location,
      prices: {
        normal: parseFloat(req.body.prices.normal),
        premium: parseFloat(req.body.prices.premium),
        //normal: parseFloat(req.body.normalPrice),
        //premium: parseFloat(req.body.premiumPrices),
      },
      tags: req.body.tags || [],
      //poster: posterPath,// 使用上传后的海报路径
    };

    movies.push(newMovie);
    await writeMovies(movies);

    res.json(newMovie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 更新电影
router.put('/movies/:name', upload.single('movie-poster'), async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Uploaded file:', req.file);

    const movies = await readMovies();
    const index = movies.findIndex(m => m.name === req.params.name);

    if (index === -1) {
      return res.status(404).json({ error: 'can not find the movie' });
    }

    // 获取海报路径的逻辑：如果没有提供海报，检查是否存在同名的海报文件
    const posterPath = req.file ? `/assets/${req.file.filename}` : movies[index].poster;
    //const posterPath = req.body.poster || getMoviePosterPath(req.body.name || movies[index].name); // 根据电影名字构建海报路径

    const updatedMovie = {
      ...movies[index],
      name: req.body.name || movies[index].name,
      date: req.body.date || movies[index].date,
      time: req.body.time || movies[index].time,
      location: req.body.location || movies[index].location,
      prices: {
        normal: parseFloat(req.body.prices.normal) || movies[index].prices.normal,
        //normal: parseFloat(req.body.normalPrice) || movies[index].prices.normal,
        premium: parseFloat(req.body.premiumPrice) || movies[index].prices.premium,
      },
      tags: req.body.tags || movies[index].tags,
      //tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : movies[index].tags,
      //poster: posterPath,
    };

    movies[index] = updatedMovie;
    await writeMovies(movies);

    res.json(updatedMovie);
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// 用于根据电影名字生成海报路径的函数
function getMoviePosterPath(movieName) {
  // 规范化电影名字（去掉空格并替换为下划线，统一为小写）
  const normalizedMovieName = movieName.replace(/\s+/g, '_').toLowerCase();
  
  // 定义支持的图片格式
  const imageFormats = ['webp', 'jpg', 'png'];
  
  // 遍历支持的格式，检查每个格式的图片文件是否存在
  for (let format of imageFormats) {
    const posterFileName = `${normalizedMovieName}.${format}`;
    const posterPath = path.join(__dirname, 'static/assets', posterFileName);

    // 检查文件是否存在
    if (fs.existsSync(posterPath)) {
      return `/assets/${posterFileName}`; // 如果文件存在，返回路径
    }
  }

  // 如果没有找到任何格式的海报，返回默认海报路径
  return '/assets/default.png';
}

// 删除电影
router.delete('/movies/:name',  async (req, res) => {
  try {
    const movies = await readMovies();
    const index = movies.findIndex(m => m.name === req.params.name);

    if (index === -1) {
      return res.status(404).json({ error: '电影未找到' });
    }

    const [deletedMovie] = movies.splice(index, 1);
    await writeMovies(movies);

    // 删除电影海报文件（如果需要）
    if (deletedMovie.poster && deletedMovie.poster !== '/assets/default.png') {
      const posterPath = path.join(__dirname, '../static', deletedMovie.poster);
      try {
        await fs.access(posterPath);
        await fs.unlink(posterPath);
      } catch (err) {
        // 文件不存在，忽略
      }
    }

    res.json({ message: 'deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 搜索建议接口
router.get('/search-suggestions', async (req, res) => {
  try {
    const query = req.query.q || '';
    const movies = await readMovies();

    const suggestions = movies
      .filter(movie => movie.name.toLowerCase().includes(query.toLowerCase()))
      .map(movie => movie.name)
      .slice(0, 10);

    res.json({ suggestions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 导出路由
export default router;
