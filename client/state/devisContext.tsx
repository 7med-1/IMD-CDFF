/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { initialDevisData } from '@/lib/constants';
import { Devis, DevisLineItem, Piece } from '@/types/devis';
import { calculateTotals } from '@/utils/calculation';
import { createContext, ReactNode, useContext, useState } from 'react';

interface DevisContextType {
  devis: Devis;
  updateDevis: (updates: Partial<Devis>) => void;
  addItem: () => void;
  removeItem: (index: number) => void;
  updateItem: (
    index: number,
    field: keyof DevisLineItem,
    value: string | number | Piece
  ) => void;
}

const DevisContext = createContext<DevisContextType | undefined>(undefined);

export function DevisProvider({ children }: { children: ReactNode }) {
  const [devis, setDevis] = useState<Devis>(initialDevisData);
  const updateDevis = (updates: Partial<Devis>) => {
    // Merge updates
    const newDevis: Devis = { ...devis, ...updates };

    // Recalculate totals if tax or pieces changed
    if (updates.pieces || updates.tax !== undefined) {
      const { tax, total } = calculateTotals(
        newDevis,
        updates.tax !== undefined ? updates.tax : devis.tax
      );
      newDevis.tax = tax 
      newDevis.total = total; 
    }

    setDevis(newDevis);
  };

  const updateItem = (
    index: number,
    field: keyof DevisLineItem,
    value: string | number | Piece
  ) => {
    const newItems = [...devis.pieces];
    newItems[index] = { ...newItems[index], [field]: value };
    console.log(newItems);

    // If quantity or subtotal changed, recalc total
    if (field === 'quantity' || field === 'subtotal') {
      const quantity = Number(newItems[index].quantity) || 0;
      const subtotal = Number(newItems[index].subtotal) || 0;
      newItems[index].total = quantity * subtotal;
    }

    updateDevis({ pieces: newItems });
  };

  const addItem = () => {
    const blankPiece: Piece = {
      pieceId: window.crypto.randomUUID(),
      name: '',
      reference: '',
      place: '',
      description: '',
      quantity: 0,
      price: null,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const newItem: DevisLineItem = {
      id: window.crypto.randomUUID(),

      devisId: devis.devisId,
      pieceId: blankPiece.pieceId,

      quantity: 1,
      subtotal: 0,
      total: 0,

      piece: blankPiece,
    };

    updateDevis({ pieces: [...devis.pieces, newItem] });
  };

  const removeItem = (index: number) => {
    if (devis.pieces.length > 1) {
      const newItems = devis.pieces.filter((_, i) => i !== index);
      updateDevis({ pieces: newItems });
    }
  };

  return (
    <DevisContext.Provider
      value={{ devis, updateDevis, addItem, removeItem, updateItem }}
    >
      {children}
    </DevisContext.Provider>
  );
}

export function useDevis() {
  const context = useContext(DevisContext);
  if (context === undefined) {
    throw new Error('problem with usedevis');
  }
  return context;
}
