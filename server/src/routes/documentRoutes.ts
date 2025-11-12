import express from 'express';
import { getDocument } from '../controllers/documentController'; // Adjust path to controller

const router = express.Router();

router.get('/documents', getDocument);

export default router;