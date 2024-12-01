// api/dbclient.js
import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件名和目录名
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 加载根目录的 .env 文件
dotenv.config({ path: path.resolve(__dirname, '../.env') });

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

const connect_uri = process.env.MONGODB_URI;
const client = new MongoClient(connect_uri, {
  connectTimeoutMS: 2000,
  serverSelectionTimeoutMS: 2000,
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// 使用顶层 await 连接数据库
try {
  await client.connect();
  console.log('Connected to MongoDB at:', connect_uri);
  const db = client.db(process.env.DB_NAME || 'projectdb');
  console.log('Successfully connected to the database!');
} catch (err) {
  console.error('Unable to establish connection to the database!', err);
  process.exit(1);
}

export default client;
