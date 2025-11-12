import { Devis, Client, DevisLineItem } from "../types/devis";

// Initial state for the nested Client object
export const initialClientData: Client = {
  clientId: '',
  name: '',
  numero: '',
  ice: '',
  address: null,
  nbrFacturs: 0,
  nbrDevis: 0,
  description: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Initial state for a single line item
export const initialLineItem: DevisLineItem = {
  id: crypto.randomUUID(), // Use a unique ID generator for the key
  devisId: '',
  pieceId: '',
  quantity: 1,
  subtotal: 0,
  total:0,
  piece: { // Placeholder Piece object for type completeness
    pieceId: '',
    name: 'New Item',
    reference: '',
    place: '',
    description: '',
    quantity: 0,
    price: 0,
    image: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
};


export const initialDevisData: Devis = {
  devisId: '', 
  devisref: `DVS-${Date.now()}`, // Use your specific ref field
  clientId: '',
  nbrPieces: 1,
  total: '0.00',
  createdAt: new Date(),
  tax: 20 ,

  // Initialize relationships:
  client: initialClientData, 
  pieces: [initialLineItem], // Start with one empty line item
};