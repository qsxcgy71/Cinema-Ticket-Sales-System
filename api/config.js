//环境变量配置：该文件使用 dotenv 包读取 .env 文件中的环境变量。
//导出配置对象：将连接字符串 CONNECTION_STR 导出，以便其他模块使用。
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.CONNECTION_STR) {
  console.error('CONNECTION_STR is not defined');
  process.exit(1);
}

export default {
  CONNECTION_STR: process.env.CONNECTION_STR,
};
