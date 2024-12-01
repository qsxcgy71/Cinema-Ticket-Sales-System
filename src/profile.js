/*import express from 'express';
import session from 'express-session';
import route from './login.js';
import mongostore from 'connect-mongo';


import express from "express";
import client from "./dbclient.js";

const route = express.Router();

// MongoDB 用户集合
const usersCollection = client.db("projectdb").collection("users");

// 获取用户信息
route.get("/get-profile", async (req, res) => {
  if (!req.session || !req.session.user || !req.session.user.username) {
    return res.status(401).json({ status: "failed", message: "Unauthorized access" });
  }

  const username = req.session.user.username;

  try {
    // 从 MongoDB 中查找用户
    const user = await usersCollection.findOne({ username });

    if (!user) {
      return res.status(404).json({ status: "failed", message: "User not found" });
    }

    res.json({
      status: "success",
      user: {
        username: user.username,
        nickname: user.nickname,
        email: user.email,
        gender: user.gender,
        birthdate: user.birthdate,
        role: user.role,
        enabled: user.enabled,
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ status: "failed", message: "An error occurred while fetching the profile" });
  }
});

// 更新用户信息
route.post("/update-profile", async (req, res) => {
  if (!req.session || !req.session.user || !req.session.user.username) {
    return res.status(401).json({ status: "failed", message: "Unauthorized access" });
  }

  const username = req.session.user.username;
  const { nickname, email, gender, birthdate } = req.body;

  if (!nickname || !email || !gender || !birthdate) {
    return res.status(400).json({ status: "failed", message: "All fields are required" });
  }

  try {
    // 更新用户数据
    const result = await usersCollection.updateOne(
      { username },
      {
        $set: {
          nickname,
          email,
          gender,
          birthdate,
        },
      }
    );

    if (result.modifiedCount > 0) {
      res.json({ status: "success", message: "Profile updated successfully" });
    } else {
      res.status(500).json({ status: "failed", message: "Failed to update profile" });
    }
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ status: "failed", message: "An error occurred while updating the profile" });
  }
});

export default route;*/
import express from 'express';
import client from './dbclient.js';

const route = express.Router();

// 获取 MongoDB 用户集合
const usersCollection = client.db('projectdb').collection('users');

// 获取用户信息
route.get('/get-profile', async (req, res) => {
  if (!req.session || !req.session.user || !req.session.user.username) {
    return res.status(401).json({ status: 'failed', message: 'Unauthorized access' });
  }

  const username = req.session.user.username;

  try {
    // 查找用户信息
    const user = await usersCollection.findOne({ username });

    if (!user) {
      return res.status(404).json({ status: 'failed', message: 'User not found' });
    }

    res.json({
      status: 'success',
      user: {
        username: user.username,
        nickname: user.nickname,
        email: user.email,
        gender: user.gender,
        birthdate: user.birthdate,
        role: user.role,
        enabled: user.enabled,
      },
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ status: 'failed', message: 'An error occurred while fetching the profile' });
  }
});

// 更新用户信息
route.post('/update-profile', async (req, res) => {
  if (!req.session || !req.session.user || !req.session.user.username) {
    return res.status(401).json({ status: 'failed', message: 'Unauthorized access' });
  }

  const username = req.session.user.username;
  const { nickname, email, gender, birthdate } = req.body;

  if (!nickname || !email || !gender || !birthdate) {
    return res.status(400).json({ status: 'failed', message: 'All fields are required' });
  }

  try {
    // 更新用户信息
    const result = await usersCollection.updateOne(
      { username },
      {
        $set: {
          nickname,
          email,
          gender,
          birthdate,
        },
      }
    );

    if (result.modifiedCount > 0) {
      res.json({ status: 'success', message: 'Profile updated successfully' });
    } else {
      res.status(500).json({ status: 'failed', message: 'Failed to update profile' });
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ status: 'failed', message: 'An error occurred while updating the profile' });
  }
});

export default route;

