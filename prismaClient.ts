import { Prisma, PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export const getPiecess = async (req: Request, res: Response): Promise<void> => {
  try {
    const search = req.query.search?.toString().trim() || '';
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    console.log('🔍 Search:', search, '| Page:', page, '| Limit:', limit);

    const where: Prisma.PiecesWhereInput = search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: Prisma.QueryMode.insensitive, // ✅ use enum
              },
            },
            {
              reference: {
                contains: search,
                mode: Prisma.QueryMode.insensitive, // ✅ use enum
              },
            },
          ],
        }
      : {};

    const [pieces, total] = await Promise.all([
      prisma.pieces.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.pieces.count({ where }),
    ]);

    res.json({ pieces, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('❌ Error fetching pieces:', error);
    res.status(500).json({ message: 'Error fetching pieces' });
  }
};
