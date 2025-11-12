import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import cloudinary from '../config/cloudinary';
import streamifier from 'streamifier';
import { UploadApiResponse } from 'cloudinary';
import { Prisma } from '@prisma/client';

const prisma = new PrismaClient();
const storage = multer.memoryStorage();
export const upload = multer({ storage, dest: 'uploads/' });

// Helper to safely upload image to Cloudinary
export const uploadToCloudinary = (fileBuffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'pieces' },
      (error: Error | undefined, result: UploadApiResponse | undefined) => {
        if (error) return reject(error);
        if (result?.secure_url) return resolve(result.secure_url);
        reject(new Error('No secure URL returned from Cloudinary'));
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

// GET /pieces?search=
export const getPieces = async (req: Request, res: Response): Promise<void> => {
  try {
    const search = req.query.search?.toString().trim() || '';
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const where: Prisma.PiecesWhereInput = search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              reference: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          ],
        }
      : {};

    const [pieces, total] = await Promise.all([
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
  } catch (error) {
    console.error('Error fetching pieces:', error);
    res.status(500).json({ message: 'Error fetching pieces' });
  }
};

// GET ONE PIECE
export const getPieceById = async (req: Request, res: Response) => {
  try {
    const { pieceId } = req.params;

    const piece = await prisma.pieces.findUnique({
      where: { pieceId },
    });

    if (!piece) {
      return res.status(404).json({ message: 'Piece not found' });
    }

    res.status(200).json(piece);
  } catch (error) {
    console.error('❌ Error fetching piece by ID:', error);
    res.status(500).json({ message: 'Error fetching piece', error });
  }
};

// POST /pieces

export const createPiece = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, reference, place, description, quantity, price } = req.body;
    let imageUrl: string | undefined;

    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    const newPiece = await prisma.pieces.create({
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
  } catch (error) {
    console.error('❌ Error creating piece:', error);
    res.status(500).json({ message: 'Error creating piece', error });
  }
};


// DELETE /pieces/:pieceId
export const deletePiece = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { pieceId } = req.params;
    const deletedPiece = await prisma.pieces.delete({ where: { pieceId } });
    res
      .status(200)
      .json({ message: 'Piece deleted successfully', deletedPiece });
  } catch (error) {
    console.error('Error deleting piece:', error);
    res.status(500).json({ message: 'Error deleting the piece', error });
  }
};

// PUT /pieces/:pieceId
export const updatePiece = async (req: Request, res: Response) => {
  try {
    const { pieceId } = req.params;
    const { name, reference, place, description, quantity, price } = req.body;

    let imageUrl: string | undefined;
    if (req.file) {
      console.log('📸 Uploading image to Cloudinary...');
      imageUrl = await uploadToCloudinary(req.file.buffer);
      console.log('✅ Uploaded image URL:', imageUrl);
    }

    const updatedPiece = await prisma.pieces.update({
      where: { pieceId },
      data: {
        name,
        reference,
        place,
        description: description || '',
        quantity: Number(quantity) || 0,
        price: Number(price) || 0,
        ...(imageUrl ? { image: imageUrl } : {}), // only update if new image
      },
    });

    res.status(200).json(updatedPiece);
  } catch (err) {
    console.error('❌ Error updating piece:', err);

    // If it's an Error object, send its message
    if (err instanceof Error) {
      res
        .status(500)
        .json({ message: 'Error updating piece', error: err.message });
    } else {
      // Otherwise, send the raw object
      res.status(500).json({ message: 'Error updating piece', error: err });
    }
  }
};

// PATCH /pieces/:pieceId/take
export const takePiece = async (req: Request, res: Response): Promise<void> => {
  const { pieceId } = req.params;
  const amount = Number(req.body.amount) || 1;

  try {
    const updatedPiece = await prisma.$transaction(async (tx) => {
      const piece = await tx.pieces.findUnique({ where: { pieceId } });
      if (!piece) throw new Error('Piece not found');

      const newQuantity = piece.quantity - amount;
      if (newQuantity < 0) throw new Error('Quantity cannot be negative');

      return await tx.pieces.update({
        where: { pieceId },
        data: { quantity: newQuantity },
      });
    });

    res.status(200).json({ message: 'Piece quantity updated', updatedPiece });
  } catch (error) {
    console.error('Error decreasing quantity:', error);
    res.status(400).json({
      message: 'Error decreasing quantity',
      error: (error as Error).message,
    });
  }
};

// PATCH /pieces/:pieceId/add
export const addPieceQuantity = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { pieceId } = req.params;
  const amount = Number(req.body.amount) || 1;

  try {
    const updatedPiece = await prisma.pieces.update({
      where: { pieceId },
      data: { quantity: { increment: amount } },
    });

    res.status(200).json({ message: 'Piece quantity increased', updatedPiece });
  } catch (error) {
    console.error('Error increasing quantity:', error);
    res.status(500).json({ message: 'Error increasing quantity', error });
  }
};
