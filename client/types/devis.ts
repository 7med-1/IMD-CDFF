// devis.ts

// --- 1. Core Entities ---

export interface Piece {
  pieceId: string;
  name: string;
  reference: string;
  place: string;
  description: string;
  quantity: number;
  price: number | null; // From Prisma Float?
  image: string | null; // From Prisma String?
  createdAt: Date;
  updatedAt?: Date;
}

export interface Client {
  clientId: string;
  name: string;
  numero: string;
  address: string | null;
  ice: number | string;
  nbrFacturs: number;
  nbrDevis: number;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// --- 2. Document Line Item (Junction Table) ---

// Defines the relationship details for a line item in a Quote
export interface DevisLineItem {
  id: string;
  devisId: string;
  pieceId: string;
  quantity: number;
  subtotal: number; // From Prisma Float?
  total: number;
  piece: Piece; // The nested Piece details
}

// --- 3. Document Structure (The Quote Itself) ---

// Represents a fully fetched Quote (Devis) document
export interface Devis {
  devisId: string;
  devisref: string;
  clientId: string;
  nbrPieces: number;
  createdAt: Date;

  total: number | string;
  tax: number | string;

  // Relationships included via Prisma include/select:
  client: Client; // The nested Client details
  pieces: DevisLineItem[]; // Array of line items
}
