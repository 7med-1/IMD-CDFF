import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { useDevis } from '@/state/devisContext';

export default function ContactDetails() {
  const { devis, updateDevis } = useDevis();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Client details</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="toName" className="pb-2 text-lg">
              Client Name
            </Label>
            <Input
              id="toName"
              placeholder="Client name or company"
              value={devis.client.name}
              onChange={(e) =>
                updateDevis({
                  client: {
                    ...devis.client, 
                    name: e.target.value, 
                  },
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="toAddress" className="pb-2 text-lg">
              Address
            </Label>
            <Input
              id="toAddress"
              placeholder="Avenue Hassan II, Agadir 80000..."
              value={devis.client.address ?? ''}
              onChange={(e) =>
                updateDevis({
                  client: {
                    ...devis.client, 
                    address: e.target.value, 
                  },
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="toICE" className="pb-2 text-lg">
              ICE N°:
            </Label>
            <Input
              id="toICE"
              placeholder="0000000XXXX"
              value={devis.client.ice }
              onChange={(e) =>
                updateDevis({
                  client: {
                    ...devis.client, 
                    ice: Number(e.target.value), 
                  },
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="toTel" className="pb-2 text-lg">
              Tel
            </Label>
            <Input
              id="toTel"
              placeholder="06-61-82-46-05"
              value={devis.client.numero ?? ''}
              onChange={(e) =>
                updateDevis({
                  client: {
                    ...devis.client, 
                    numero: e.target.value,
                  },
                })
              }
            />
          </div>
      </CardContent>
    </Card>
  );
}

