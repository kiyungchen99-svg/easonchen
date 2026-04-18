import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) return res.status(400).json({ message: '帳號或Email已被使用' });

    const user = await User.create({ username, email, password });
    const token = signToken(user._id);
    res.cookie('token', token, cookieOptions);
    res.status(201).json({ _id: user._id, username: user.username, email: user.email, role: user.role });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Email或密碼錯誤' });
    }

    const token = signToken(user._id);
    res.cookie('token', token, cookieOptions);
    res.json({ _id: user._id, username: user.username, email: user.email, role: user.role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: '已登出' });
};

export const getMe = (req, res) => {
  res.json(req.user);
};
