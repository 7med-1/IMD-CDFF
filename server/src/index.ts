import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import path from 'path';


dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// route imports
import pieceRoutes from './routes/pieceRoutes';
import documentRoutes from './routes/documentRoutes';
import loginRoutes from './routes/loginRoutes';
import { verifyToken } from './middleware/authMiddleware';
 

// configs

const app = express();
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



// test
// import prismaRoutes from './routes/prismaRoutes'; 
// app.use('/api/pieces', prismaRoutes);