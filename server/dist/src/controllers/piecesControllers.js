"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPieceQuantity = exports.takePiece = exports.updatePiece = exports.deletePiece = exports.createPiece = exports.getPieceById = exports.getPieces = exports.uploadToCloudinary = exports.upload = void 0;
const client_1 = require("@prisma/client");
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const streamifier_1 = __importDefault(require("streamifier"));
const client_2 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const storage = multer_1.default.memoryStorage();
exports.upload = (0, multer_1.default)({ storage, dest: 'uploads/' });
// Helper to safely upload image to Cloudinary
const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.default.uploader.upload_stream({ folder: 'pieces' }, (error, result) => {
            if (error)
                return reject(error);
            if (result === null || result === void 0 ? void 0 : result.secure_url)
                return resolve(result.secure_url);
            reject(new Error('No secure URL returned from Cloudinary'));
        });
        streamifier_1.default.createReadStream(fileBuffer).pipe(uploadStream);
    });
};
exports.uploadToCloudinary = uploadToCloudinary;
// GET /pieces?search=
const getPieces = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const search = ((_a = req.query.search) === null || _a === void 0 ? void 0 : _a.toString().trim()) || '';
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const where = search
            ? {
                OR: [
                    {
                        name: {
                            contains: search,
                            mode: client_2.Prisma.QueryMode.insensitive,
                        },
                    },
                    {
                        reference: {
                            contains: search,
                            mode: client_2.Prisma.QueryMode.insensitive,
                        },
                    },
                ],
            }
            : {};
        const [pieces, total] = yield Promise.all([
            prisma.pieces.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.pieces.count({ where }),
        ]);
        res.json({
            data: pieces,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    }
    catch (error) {
        console.error('Error fetching pieces:', error);
        res.status(500).json({ message: 'Error fetching pieces' });
    }
});
exports.getPieces = getPieces;
// GET ONE PIECE
const getPieceById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pieceId } = req.params;
        const piece = yield prisma.pieces.findUnique({
            where: { pieceId },
        });
        if (!piece) {
            return res.status(404).json({ message: 'Piece not found' });
        }
        res.status(200).json(piece);
    }
    catch (error) {
        console.error('❌ Error fetching piece by ID:', error);
        res.status(500).json({ message: 'Error fetching piece', error });
    }
});
exports.getPieceById = getPieceById;
// POST /pieces
const createPiece = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, reference, place, description, quantity, price } = req.body;
        let imageUrl;
        if (req.file) {
            imageUrl = yield (0, exports.uploadToCloudinary)(req.file.buffer);
        }
        const newPiece = yield prisma.pieces.create({
            data: {
                name,
                reference,
                place,
                description: description || '',
                quantity: Number(quantity),
                price: Number(price),
                image: imageUrl || null,
            },
        });
        res.status(201).json(newPiece);
    }
    catch (error) {
        console.error('❌ Error creating piece:', error);
        res.status(500).json({ message: 'Error creating piece', error });
    }
});
exports.createPiece = createPiece;
// DELETE /pieces/:pieceId
const deletePiece = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pieceId } = req.params;
        const deletedPiece = yield prisma.pieces.delete({ where: { pieceId } });
        res
            .status(200)
            .json({ message: 'Piece deleted successfully', deletedPiece });
    }
    catch (error) {
        console.error('Error deleting piece:', error);
        res.status(500).json({ message: 'Error deleting the piece', error });
    }
});
exports.deletePiece = deletePiece;
// PUT /pieces/:pieceId
const updatePiece = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pieceId } = req.params;
        const { name, reference, place, description, quantity, price } = req.body;
        let imageUrl;
        if (req.file) {
            console.log('📸 Uploading image to Cloudinary...');
            imageUrl = yield (0, exports.uploadToCloudinary)(req.file.buffer);
            console.log('✅ Uploaded image URL:', imageUrl);
        }
        const updatedPiece = yield prisma.pieces.update({
            where: { pieceId },
            data: Object.assign({ name,
                reference,
                place, description: description || '', quantity: Number(quantity) || 0, price: Number(price) || 0 }, (imageUrl ? { image: imageUrl } : {})),
        });
        res.status(200).json(updatedPiece);
    }
    catch (err) {
        console.error('❌ Error updating piece:', err);
        // If it's an Error object, send its message
        if (err instanceof Error) {
            res
                .status(500)
                .json({ message: 'Error updating piece', error: err.message });
        }
        else {
            // Otherwise, send the raw object
            res.status(500).json({ message: 'Error updating piece', error: err });
        }
    }
});
exports.updatePiece = updatePiece;
// PATCH /pieces/:pieceId/take
const takePiece = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pieceId } = req.params;
    const amount = Number(req.body.amount) || 1;
    try {
        const updatedPiece = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const piece = yield tx.pieces.findUnique({ where: { pieceId } });
            if (!piece)
                throw new Error('Piece not found');
            const newQuantity = piece.quantity - amount;
            if (newQuantity < 0)
                throw new Error('Quantity cannot be negative');
            return yield tx.pieces.update({
                where: { pieceId },
                data: { quantity: newQuantity },
            });
        }));
        res.status(200).json({ message: 'Piece quantity updated', updatedPiece });
    }
    catch (error) {
        console.error('Error decreasing quantity:', error);
        res.status(400).json({
            message: 'Error decreasing quantity',
            error: error.message,
        });
    }
});
exports.takePiece = takePiece;
// PATCH /pieces/:pieceId/add
const addPieceQuantity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pieceId } = req.params;
    const amount = Number(req.body.amount) || 1;
    try {
        const updatedPiece = yield prisma.pieces.update({
            where: { pieceId },
            data: { quantity: { increment: amount } },
        });
        res.status(200).json({ message: 'Piece quantity increased', updatedPiece });
    }
    catch (error) {
        console.error('Error increasing quantity:', error);
        res.status(500).json({ message: 'Error increasing quantity', error });
    }
});
exports.addPieceQuantity = addPieceQuantity;
