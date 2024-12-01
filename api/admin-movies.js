import express from 'express';
import multer from 'multer';
import { Router } from 'express';
import fs from 'fs/promises';
import path from 'path';
import session from 'express-session';
import bodyParser from 'body-parser';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'static/uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = `${file.fieldname}-${Date.now()}${ext}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

// Your route handler here

// const upload = multer({ storage: storage });

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
  // console.log('Number of files:', req.files.length);
  // console.log('files', req.files);
  try {
    const usersArray = JSON.parse(req.body.users);
    const filePath = './static/movies.json';

    // Read the existing movies.json file
    let existingMovies = [];
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      existingMovies = JSON.parse(data);
    } catch (err) {
      console.error('Error reading existing movies file', err);
    }
    // console.log(existingMovies);
    let imagePath;
    const movies = usersArray.map((user, index) => {
      // let imagePath = req.files[index].originalname == 'empty' ? req.files[index].path : '';

      if (req.files[index].originalname == 'empty') {
        // Search for the image in the existing movies
        const existingMovie = existingMovies.find((movie) => movie.movieName === user.movieName);
        if (existingMovie) {
          imagePath = existingMovie.image;
        }
      } else {
        imagePath = req.files[index].path;
      }
      // console.log('image path', imagePath);
      imagePath = imagePath.replace(/^static[\\/]/, '');
      // console.log(imagePath);
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

export default router;
