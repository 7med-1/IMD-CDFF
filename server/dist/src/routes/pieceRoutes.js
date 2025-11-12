"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const piecesControllers_1 = require("../controllers/piecesControllers");
const router = (0, express_1.Router)();
router.get('/', piecesControllers_1.getPieces);
router.get("/:pieceId", piecesControllers_1.getPieceById);
router.post('/', piecesControllers_1.upload.single('image'), piecesControllers_1.createPiece);
router.put("/:pieceId", piecesControllers_1.upload.single('image'), piecesControllers_1.updatePiece); // ✅ add upload middleware
router.delete('/:pieceId', piecesControllers_1.deletePiece);
router.patch('/:pieceId/take', piecesControllers_1.takePiece);
router.patch('/:pieceId/add', piecesControllers_1.addPieceQuantity);
exports.default = router;
