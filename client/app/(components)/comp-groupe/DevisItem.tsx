import { Trash2 } from 'lucide-react';

import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../Button';

import type { DevisLineItem as DevisLineItemType } from '@/types/devis';
import { useDevis } from '@/state/devisContext';

interface DevistemProps {
  item: DevisLineItemType;
  index: number;
  canRemove: boolean;
}

export default function DevisItem({ item, index, canRemove }: DevistemProps) {
  const { removeItem, updateItem } = useDevis();

  return (
    <div className="felx items-center gap-4 p-4 border rounded-lg sm:grid sm:grid-cols-12 sm:gap-6">
      {/* Name */}
      <div className="sm:col-span-5">
        <Label className="py-3">Name</Label>
        <Input
          placeholder="piece name"
          value={item.piece.name}
          onChange={(e) => {
            const updatedPiece = {
              ...(item.piece ?? {
                pieceId: '',
                name: '',
                reference: '',
                place: '',
                description: '',
                quantity: 0,
                price: 0,
                createdAt: new Date(),
              }),
              name: e.target.value,
            };
            updateItem(index, 'piece', updatedPiece);
          }}
        />
      </div>

      {/* Quantity + Price */}
      <div className="flex  gap-4 sm:col-span-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Label className="py-3">Quantity</Label>
          <Input
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) => {
              updateItem(index, 'quantity', e.target.value);
            }}
          />
        </div>

        <div className="flex-1">
          <Label className="py-3">Prix (MAD)</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={item.subtotal}
            onChange={(e) => {
              updateItem(index, 'subtotal', e.target.value);
            }}
          />
        </div>
      </div>

      {/* Total + Trash */}
      <div className="sm:col-span-3">
        <Label className="py-3">Total</Label>
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-4">
            <div className="h-10 px-3 py-2 bg-gray-50 border rounded-md flex items-center">
              {item.total} MAD
            </div>
          </div>

          <div className="col-span-1 flex items-center justify-center">
            <Button
              variant="outline"
              size="icon"
              onClick={() => removeItem(index)}
              disabled={!canRemove}
              className="transition-colors duration-200 bg-red-400 hover:bg-red-500 hover:text-white"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
