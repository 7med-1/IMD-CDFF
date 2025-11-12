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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPiecess = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});
const getPiecess = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const search = ((_a = req.query.search) === null || _a === void 0 ? void 0 : _a.toString().trim()) || '';
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        console.log('🔍 Search:', search, '| Page:', page, '| Limit:', limit);
        const where = search
            ? {
                OR: [
                    {
                        name: {
                            contains: search,
                            mode: client_1.Prisma.QueryMode.insensitive, // ✅ use enum
                        },
                    },
                    {
                        reference: {
                            contains: search,
                            mode: client_1.Prisma.QueryMode.insensitive, // ✅ use enum
                        },
                    },
                ],
            }
            : {};
        const [pieces, total] = yield Promise.all([
            prisma.pieces.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.pieces.count({ where }),
        ]);
        res.json({ pieces, total, page, totalPages: Math.ceil(total / limit) });
    }
    catch (error) {
        console.error('❌ Error fetching pieces:', error);
        res.status(500).json({ message: 'Error fetching pieces' });
    }
});
exports.getPiecess = getPiecess;
