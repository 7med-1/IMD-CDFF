import { Router } from 'express';
import { getPiecess } from '../controllers/prismaClient';

const router = Router();


router.get('/', getPiecess);


export default router;