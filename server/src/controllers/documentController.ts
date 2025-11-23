import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { DocumentData } from '../types/document'; // Adjust path to your types

const prisma = new PrismaClient();

// The core function to query Prisma
async function fetchDocumentData(ref: string, type: 'facture' | 'devis'): Promise<DocumentData | null> {
    const model = type === 'facture' ? prisma.facture : prisma.devis;
    const refField = type === 'facture' ? 'factureref' : 'devisref';
    
    try {
        const documentRecord = await (model as any).findUnique({ 
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
        return documentRecord as unknown as DocumentData; 

    } catch (error) {
        console.error(`Prisma error fetching ${type} ${ref}:`, error);
        return null;
    }
}

// The Controller method that handles the HTTP request/response
export const getDocument = async (req: Request, res: Response) => {
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
    const documentData = await fetchDocumentData(ref, docType);

    // 3. Send response
    if (!documentData) {
        return res.status(404).json({ message: `${docType} with reference ${ref} not found.` });
    }

    return res.status(200).json(documentData);
};