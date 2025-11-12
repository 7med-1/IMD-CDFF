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
exports.getDocumentData = getDocumentData;
// backend/api/documentHandler.ts or within index.ts
const client_1 = require("@prisma/client");
// Import your types from the frontend or centralize them
const prisma = new client_1.PrismaClient();
// This function performs the necessary database join to assemble the document data
function getDocumentData(ref, type) {
    return __awaiter(this, void 0, void 0, function* () {
        // --- Determine Model and Reference Field ---
        const model = type === 'facture' ? prisma.facture : prisma.devis;
        const refField = type === 'facture' ? 'factureref' : 'devisref';
        // --- Define the Required Inclusion Structure ---
        const includeStructure = {
            client: true, // Includes the full Clients object
            pieces: {
                include: {
                    piece: true // Includes the related Pieces object within each DocPiece
                }
            }
        };
        try {
            // --- Execute the Query ---
            const documentRecord = yield model.findUnique({
                where: {
                    [refField]: ref,
                },
                include: includeStructure,
            });
            if (!documentRecord) {
                return null;
            }
            // --- Data Transformation (Ensure total/createdAt types match) ---
            // Prisma returns a complex object, we cast and potentially map/clean it up.
            // NOTE: The 'total' field in your Prisma schema is a String, which is ideal here.
            const finalData = Object.assign(Object.assign({}, documentRecord), { 
                // Assuming you handle `bateau` and `client.iceNumber` either in your Prisma schema 
                // or by fetching them from another source and merging here. 
                // For now, we cast and trust the inclusion structure matches the DocumentData interface:
                client: Object.assign(Object.assign({}, documentRecord.client), { 
                    // Placeholder for iceNumber, if not in your current Clients model
                    iceNumber: documentRecord.client.iceNumber || null }), bateau: documentRecord.bateau || null, createdAt: documentRecord.createdAt });
            return finalData;
        }
        catch (error) {
            console.error(`Error fetching ${type} ${ref}:`, error);
            return null;
        }
    });
}
