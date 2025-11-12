import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const login = (req: Request, res: Response) => {
  const { name, password } = req.body;

  if (!name || !password)
    return res.status(400).json({ message: 'Name and password are required' });

  if (name !== process.env.ADMIN_NAME || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: 'JWT secret not set' });
  }

  const token = jwt.sign({ name }, process.env.JWT_SECRET, { expiresIn: '24h' });

  res.json({ message: 'Login successful', token });
};
