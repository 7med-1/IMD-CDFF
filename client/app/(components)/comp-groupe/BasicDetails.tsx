import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { useDevis } from '@/state/devisContext';

export default function BasicDetails() {
  const { devis, updateDevis } = useDevis();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Devis Details</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="invoiceNumber" className="pb-2 text-lg">
            Devis Number
          </Label>
          <Input
            value={devis.devisref}
            id="invoiceNumber"
            onChange={(e) => updateDevis({ devisref: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="date" className="pb-2 text-lg">
            Date
          </Label>
          <Input
            id="date"
            type="date"
            value={devis.createdAt.toISOString().split('T')[0]}
            onChange={(e) =>
              updateDevis({
                createdAt: new Date(e.target.value),
              })
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
