import { Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

import { Button } from '../Button';

import { useDevis } from '@/state/devisContext';
import DevisItem from './DevisItem';

export default function DevisList() {
  const { devis, addItem } = useDevis();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between text-xl">
        <CardTitle>Devis Pieces</CardTitle>
        <Button
          size="sm"
          onClick={addItem}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {devis.pieces.map((piece, index) =>
          piece?.piece ? (
            <DevisItem
              key={piece.id}
              item={piece}
              index={index}
              canRemove={devis.pieces.length > 1}
            />
          ) : null
        )}
      </CardContent>
    </Card>
  );
}
