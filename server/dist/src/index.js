"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = __importDefault(require("body-parser"));
const multer_1 = __importDefault(require("multer"));
// route imports
const pieceRoutes_1 = __importDefault(require("./routes/pieceRoutes"));
const documentRoutes_1 = __importDefault(require("./routes/documentRoutes"));
const loginRoutes_1 = __importDefault(require("./routes/loginRoutes"));
const authMiddleware_1 = require("./middleware/authMiddleware");
// configs
dotenv_1.default.config();
const app = (0, express_1.default)();
const upload = (0, multer_1.default)({ dest: 'uploads/' });
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use(helmet_1.default.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use((0, morgan_1.default)('common'));
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)());
// routes
app.use('/api/auth', loginRoutes_1.default);
app.use(authMiddleware_1.verifyToken);
app.use('/api/pieces', pieceRoutes_1.default);
app.use('/api', documentRoutes_1.default);
// server
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`server on port ${port}`);
});
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file)
        return res.status(400).json({ message: 'No file uploaded' });
    // In production, you might store on S3 / Cloudinary and return URL
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ url: imageUrl });
});
// test
// import prismaRoutes from './routes/prismaRoutes'; 
// app.use('/api/pieces', prismaRoutes);
