//数据库连接管理：该文件负责与 MongoDB 数据库建立连接，并导出 client 对象以供其他模块使用。
//连接字符串：它从 config.js 中获取连接字符串，并使用 MongoClient 连接到数据库。
//连接成功后，输出成功信息；如果连接失败，则退出进程。
import { MongoClient, ServerApiVersion } from 'mongodb';
import config from './config.js';

const connect_uri = config.CONNECTION_STR;
const client = new MongoClient(connect_uri, {
  connectTimeoutMS: 2000,
  serverSelectionTimeoutMS: 2000,
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
/*
async function connect() {
  try {
    await client.connect();
    await client.db('projectdb').command({ ping: 1 });
    console.log('Successfully connected to the database!');
  } catch (err) {
    console.error('Unable to establish connection to the database!');
    process.exit(1);
  }
}*/
async function connect() {
  try {
    await client.connect();
    console.log('Connected to MongoDB at:', connect_uri);
    const db = client.db('projectdb');
    console.log('Successfully connected to the database!');
  } catch (err) {
    console.error('Unable to establish connection to the database!');
    process.exit(1);
  }
}


connect().catch(console.dir);

export default client;