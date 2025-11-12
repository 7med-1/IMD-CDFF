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
const client_1 = require("@prisma/client");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const prisma = new client_1.PrismaClient();
function deleteAllData() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('🧹 Clearing all tables...');
        yield prisma.facturePiece.deleteMany({});
        yield prisma.devisPiece.deleteMany({});
        yield prisma.facture.deleteMany({});
        yield prisma.devis.deleteMany({});
        yield prisma.piecesSummary.deleteMany({});
        yield prisma.pieces.deleteMany({});
        yield prisma.clients.deleteMany({});
        yield prisma.user.deleteMany({});
        console.log('✅ All tables cleared.');
    });
}
function seedJsonFile(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = JSON.parse(fs_1.default.readFileSync(filePath, 'utf-8'));
            return data;
        }
        catch (error) {
            console.error(`❌ Failed to parse JSON file: ${filePath}`, error);
            return [];
        }
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const dataDir = path_1.default.join(__dirname, 'seedData');
        yield deleteAllData();
        // Helper function to format references like "N°:00001"
        const formatRef = (num) => `N°:${num.toString().padStart(5, '0')}`;
        // Internal counters for auto-increment references
        let devisCounter = 78;
        let factureCounter = 1;
        // 1️⃣ Seed Users
        const users = yield seedJsonFile(path_1.default.join(dataDir, 'Users.json'));
        if (users.length > 0) {
            yield prisma.user.createMany({ data: users, skipDuplicates: true });
            console.log(`✅ Seeded Users: ${users.length}`);
        }
        // 2️⃣ Seed Clients
        const clients = yield seedJsonFile(path_1.default.join(dataDir, 'Clients.json'));
        if (clients.length > 0) {
            yield prisma.clients.createMany({ data: clients, skipDuplicates: true });
            console.log(`✅ Seeded Clients: ${clients.length}`);
        }
        // 3️⃣ Seed Pieces
        const pieces = yield seedJsonFile(path_1.default.join(dataDir, 'Pieces.json'));
        if (pieces.length > 0) {
            yield prisma.pieces.createMany({ data: pieces, skipDuplicates: true });
            console.log(`✅ Seeded Pieces: ${pieces.length}`);
        }
        // 4️⃣ Seed PiecesSummary
        const summaries = yield seedJsonFile(path_1.default.join(dataDir, 'PiecesSummary.json'));
        if (summaries.length > 0) {
            yield prisma.piecesSummary.createMany({
                data: summaries,
                skipDuplicates: true,
            });
            console.log(`✅ Seeded PiecesSummary: ${summaries.length}`);
        }
        // 5️⃣ Seed Devis
        const devisList = yield seedJsonFile(path_1.default.join(dataDir, 'Devis.json'));
        for (const d of devisList) {
            const client = yield prisma.clients.findFirst({
                where: { name: d.clientName },
            });
            if (!client) {
                console.warn(`⚠️ Client not found for Devis: ${d.devisref} (name: ${d.clientName})`);
                continue;
            }
            yield prisma.devis.create({
                data: {
                    devisref: formatRef(devisCounter++), // Auto-generate like N°:00001
                    clientId: client.clientId,
                    nbrPieces: d.nbrPieces,
                    total: d.total,
                },
            });
        }
        // 6️⃣ Seed DevisPieces
        const devisPieces = yield seedJsonFile(path_1.default.join(dataDir, 'DevisPieces.json'));
        for (const dp of devisPieces) {
            const devis = yield prisma.devis.findFirst({
                where: { devisref: dp.devisRef },
            });
            const piece = yield prisma.pieces.findFirst({
                where: { reference: dp.pieceRef },
            });
            if (!devis) {
                console.warn(`⚠️ Devis not found: ${dp.devisRef}`);
                continue;
            }
            if (!piece) {
                console.warn(`⚠️ Piece not found: ${dp.pieceRef}`);
                continue;
            }
            yield prisma.devisPiece.create({
                data: {
                    devisId: devis.devisId,
                    pieceId: piece.pieceId,
                    quantity: dp.quantity,
                    subtotal: dp.subtotal,
                },
            });
        }
        // 7️⃣ Seed Factures
        const factures = yield seedJsonFile(path_1.default.join(dataDir, 'Factures.json'));
        for (const f of factures) {
            const client = yield prisma.clients.findFirst({
                where: { name: f.clientName },
            });
            if (!client) {
                console.warn(`⚠️ Client not found for Facture: ${f.factureref}`);
                continue;
            }
            yield prisma.facture.create({
                data: {
                    factureref: formatRef(factureCounter++), // Auto-generate like N°:00001
                    clientId: client.clientId,
                    nbrPieces: f.nbrPieces,
                    total: f.total,
                },
            });
        }
        // 8️⃣ Seed FacturePieces
        const facturePieces = yield seedJsonFile(path_1.default.join(dataDir, 'FacturePieces.json'));
        for (const fp of facturePieces) {
            const facture = yield prisma.facture.findFirst({
                where: { factureref: fp.factureRef },
            });
            const piece = yield prisma.pieces.findFirst({
                where: { reference: fp.pieceRef },
            });
            if (!facture) {
                console.warn(`⚠️ Facture not found: ${fp.factureRef}`);
                continue;
            }
            if (!piece) {
                console.warn(`⚠️ Piece not found: ${fp.pieceRef}`);
                continue;
            }
            yield prisma.facturePiece.create({
                data: {
                    factureId: facture.factureId,
                    pieceId: piece.pieceId,
                    quantity: fp.quantity,
                    subtotal: fp.subtotal,
                },
            });
        }
        console.log('🎉 Seeding complete!');
    });
}
main()
    .catch((e) => console.error('❌ Error during seeding:', e))
    .finally(() => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.$disconnect(); }));
