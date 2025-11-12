// Define the shape of a Piece item
export interface Piece {
  pieceId: string;
  name: string;
  reference: string;
  price?: number | null; 
  // ... other fields from your Pieces model
}

// Define the shape of a Client
export interface Client {
  clientId: string;
  name: string;
  numero: string;
  address?: string | null;
  // Based on your BL PDF, we need the ICE number
  iceNumber?: string | null; 
  // ... other fields from your Clients model
}

// Define the junction table item (DevisPiece or FacturePiece)
export interface DocPiece {
  id: string;
  quantity: number;
  subtotal?: number | null;
  piece: Piece; // Includes the related Piece object
}

// Define the final Document structure (Facture or Devis)
export interface DocumentData {
  factureId?: string;
  devisId?: string;
  factureref?: string;
  devisref?: string;
  total: string; // From your Prisma model
  createdAt: Date; 
  client: Client;
  pieces: DocPiece[];
  bateau?: string | null; // Field to display the vessel name
}