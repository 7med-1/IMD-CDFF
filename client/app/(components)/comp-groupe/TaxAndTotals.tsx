import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { useDevis } from '@/state/devisContext';
import { Devis } from '@/types/devis';
import { Button } from '../Button';

const TAX_DEFAULT = 20;

export function sumDevisTotals(devis: Devis) {
  const taxRate =
    typeof devis?.tax === 'number' && !isNaN(devis.tax)
      ? devis.tax / 100
      : TAX_DEFAULT / 100;

  if (!devis || !Array.isArray(devis.pieces)) {
    return { totalHT: 0, totalTTC: 0 };
  }

  const totalTTC = devis.pieces.reduce((sum, item) => {
    const quantity = Number(item.quantity) || 0;
    const subtotal = Number(item.subtotal) || 0;
    return sum + quantity * subtotal;
  }, 0);

  const totalHT = totalTTC * (1 - taxRate);

  return {
    totalHT: parseFloat(totalHT.toFixed(2)),
    totalTTC: parseFloat(totalTTC.toFixed(2)),
  };
}

export default function TaxAndTotals() {
  const { devis, updateDevis } = useDevis();
  const { totalHT, totalTTC } = sumDevisTotals(devis);

  const handleTaxRateChange = (value: string) => {
    if (value === '') {
      updateDevis({ tax: '' });
    } else {
      const numValue = Number.parseFloat(value);
      if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
        updateDevis({ tax: numValue });
      }
    }
  };

  const handleTaxRateBlur = () => {
    if (devis.tax === '' || isNaN(Number(devis.tax))) {
      updateDevis({ tax: TAX_DEFAULT });
    }
  };

  //this button is for number to text its used in the pdf generator but it can be also passed from here 
  // const handleSubmitTotals = () => {
  //   function numberToFrenchWords(n: number): string {
  //     const units = [
  //       '',
  //       'un',
  //       'deux',
  //       'trois',
  //       'quatre',
  //       'cinq',
  //       'six',
  //       'sept',
  //       'huit',
  //       'neuf',
  //       'dix',
  //       'onze',
  //       'douze',
  //       'treize',
  //       'quatorze',
  //       'quinze',
  //       'seize',
  //       'dix-sept',
  //       'dix-huit',
  //       'dix-neuf',
  //     ];
  //     const tens = [
  //       '',
  //       '',
  //       'vingt',
  //       'trente',
  //       'quarante',
  //       'cinquante',
  //       'soixante',
  //       'soixante',
  //       'quatre-vingt',
  //       'quatre-vingt',
  //     ];
  //     const hundredsText = 'cent';

  //     if (n === 0) return 'zéro';
  //     if (n < 0) return 'moins ' + numberToFrenchWords(Math.abs(n));

  //     // Handles numbers between 0 and 999
  //     function helper(num: number): string {
  //       if (num < 20) {
  //         return units[num];
  //       } else if (num < 100) {
  //         const unit = num % 10;
  //         const ten = Math.floor(num / 10);

  //         // Special cases for 70s, 80s, and 90s in French
  //         if (ten === 7 || ten === 9) {
  //           return tens[ten] + (unit === 0 ? 's' : '-') + helper(num % 20);
  //         } else if (ten === 8) {
  //           // 80 is "quatre-vingts" but "quatre-vingt-un", "quatre-vingt-deux" etc.
  //           return (
  //             tens[ten] +
  //             (unit === 0 ? 's' : '') +
  //             (unit === 0 ? '' : '-') +
  //             helper(unit)
  //           );
  //         } else {
  //           // For 20s to 60s
  //           if (unit === 1) {
  //             return tens[ten] + '-et-un';
  //           } else if (unit === 0) {
  //             return tens[ten];
  //           } else {
  //             return tens[ten] + '-' + units[unit];
  //           }
  //         }
  //       } else {
  //         const hundred = Math.floor(num / 100);
  //         const remainder = num % 100;
  //         let result = '';

  //         if (hundred === 1) {
  //           result = hundredsText;
  //         } else {
  //           result = units[hundred] + '-' + hundredsText;
  //         }

  //         if (remainder === 0) {
  //           // Adjust for "cents" becoming "cent" when not followed by other numbers
  //           return result + (hundred > 1 ? 's' : '');
  //         } else {
  //           return result + ' ' + helper(remainder);
  //         }
  //       }
  //     }

  //     // Handles numbers > 999 by splitting into chunks of thousands
  //     const scales = ['', 'mille', 'million', 'milliard'];
  //     let words = '';
  //     let i = 0;

  //     while (n > 0) {
  //       const chunk = n % 1000;
  //       n = Math.floor(n / 1000);

  //       if (chunk > 0) {
  //         let chunkWords = helper(chunk);
  //         if (i === 1) {
  //           // "Mille" doesn't take an "s" for plural, unlike "million" or "milliard"
  //           chunkWords = (chunk === 1 ? '' : chunkWords) + ' ' + scales[i];
  //         } else if (i > 1) {
  //           chunkWords = chunkWords + ' ' + scales[i] + (chunk > 1 ? 's' : '');
  //         }

  //         words = chunkWords + (words ? ' ' + words : '');
  //       }
  //       i++;
  //     }

  //     return words.trim();
  //   }

  //   // Examples:
  //   console.log(`totalTTC: ${numberToFrenchWords(totalTTC)}`);
  // };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">TVA & Totals</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="taxRate" className="pb-2">
            TVA (%)
          </Label>
          <Input
            id="taxRate"
            type="number"
            min="0"
            max="100"
            step="1"
            value={devis.tax ?? TAX_DEFAULT}
            onChange={(e) => handleTaxRateChange(e.target.value)}
            onBlur={handleTaxRateBlur}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Total TTC:</span>
            <span>{totalTTC} MAD</span>
          </div>
          <div className="flex justify-between">
            <span>Total HT:</span>
            <span>{totalHT} MAD</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total:</span>
            <span>{totalTTC} MAD</span>
          </div>

          {/*  Submit Button  */}
          {/* <div className="pt-4 flex justify-end">
            <Button
              onClick={handleSubmitTotals}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Submit Total
            </Button>
          </div> */}
        </div>
      </CardContent>
    </Card>
  );
}
