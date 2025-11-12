import { Router } from 'express';
import {
  getPieces,
  createPiece,
  updatePiece,
  deletePiece,
  takePiece,
  addPieceQuantity,
  upload,
  getPieceById,
} from '../controllers/piecesControllers';

const router = Router();

router.get('/', getPieces);
router.get("/:pieceId", getPieceById);
router.post('/', upload.single('image'), createPiece);
router.put("/:pieceId", upload.single('image'), updatePiece);   // ✅ add upload middleware
router.delete('/:pieceId', deletePiece);
router.patch('/:pieceId/take', takePiece);
router.patch('/:pieceId/add', addPieceQuantity);

export default router;
