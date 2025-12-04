import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import multer from 'multer';
import path from 'path';


// route imports
import pieceRoutes from './routes/pieceRoutes';
import documentRoutes from './routes/documentRoutes';
import loginRoutes from './routes/loginRoutes';
import { verifyToken } from './middleware/authMiddleware';


// configs
dotenv.config({ path: path.resolve(__dirname, '../.env') });
const app = express();
const upload = multer({ dest: 'uploads/' });
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// routes
app.use('/api/auth', loginRoutes);
app.use(verifyToken);
app.use('/api/pieces', pieceRoutes);
app.use('/api', documentRoutes);


// server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`server on port ${port}`);
});

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  // In production, you might store on S3 / Cloudinary and return URL
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ url: imageUrl });
});



// test
// import prismaRoutes from './routes/prismaRoutes'; 
// app.use('/api/pieces', prismaRoutes);