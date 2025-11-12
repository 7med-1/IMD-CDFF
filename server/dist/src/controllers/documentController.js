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
exports.getDocument = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// The core function to query Prisma
function fetchDocumentData(ref, type) {
    return __awaiter(this, void 0, void 0, function* () {
        const model = type === 'facture' ? prisma.facture : prisma.devis;
        const refField = type === 'facture' ? 'factureref' : 'devisref';
        try {
            const documentRecord = yield model.findUnique({
                where: {
                    [refField]: ref,
                },
                include: {
                    client: true,
                    pieces: {
                        include: {
                            piece: true
                        }
                    }
                },
            });
            if (!documentRecord) {
                return null;
            }
            // Return the fully structured and typed data
            return documentRecord;
        }
        catch (error) {
            console.error(`Prisma error fetching ${type} ${ref}:`, error);
            return null;
        }
    });
}
// The Controller method that handles the HTTP request/response
const getDocument = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Get parameters from the request query
    const { ref, type } = req.query;
    if (!ref || typeof ref !== 'string') {
        return res.status(400).json({ message: 'Missing document reference (ref).' });
    }
    const docType = (type === 'facture' || type === 'devis') ? type : null;
    if (!docType) {
        return res.status(400).json({ message: 'Invalid or missing document type (must be facture or devis).' });
    }
    // 2. Call the business logic function
    const documentData = yield fetchDocumentData(ref, docType);
    // 3. Send response
    if (!documentData) {
        return res.status(404).json({ message: `${docType} with reference ${ref} not found.` });
    }
    return res.status(200).json(documentData);
});
exports.getDocument = getDocument;
