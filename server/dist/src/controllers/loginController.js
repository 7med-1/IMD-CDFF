"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const login = (req, res) => {
    const { name, password } = req.body;
    if (!name || !password)
        return res.status(400).json({ message: 'Name and password are required' });
    if (name !== process.env.ADMIN_NAME || password !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    if (!process.env.JWT_SECRET) {
        return res.status(500).json({ message: 'JWT secret not set' });
    }
    const token = jsonwebtoken_1.default.sign({ name }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ message: 'Login successful', token });
};
exports.login = login;
