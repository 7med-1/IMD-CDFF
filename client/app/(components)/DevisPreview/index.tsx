import React from 'react';
import { Button } from '../Button';
import { Download } from 'lucide-react';
import Image from 'next/image';
import { useDevis } from '@/state/devisContext';
import { generatePDF, numberToFrenchWords } from '@/utils/pdfgenerate';

interface DevisPreviewProps {
  onBack: () => void;
}

const DevisPreview = ({ onBack }: DevisPreviewProps) => {
  const binfos = {
    footer: {
      address: 'Douar Oukhrib Allal Commune Ait Amira Biougra',
      tel: '06-61-82-46-05',
      email: 'futur2b@gmail.com',
      capital: '100 000.00 DH',
      ice: '002814810000018',
      if: '50388031',
      rc: '23893',
      tp: '49810876',
    },
  };
  const { devis } = useDevis();
  const taxRate =
    typeof devis?.tax === 'number' && !isNaN(devis.tax)
      ? Number(devis.tax) / 100
      : 0.2; // default 20%

  if (!devis || !Array.isArray(devis.pieces)) {
    return null; // or a loading/error div
  }

  // --- Per-line calculations ---
  const piecesWithHT = devis.pieces.map((item) => {
    const subtotalTTC = Number(item.subtotal) || 0;
    const quantity = Number(item.quantity) || 0;

    // Calculate before-tax values
    const PHTU = subtotalTTC * (1 - taxRate); // prix hors taxe unitaire
    const PHTT = PHTU * quantity;

    return { PHTU, PHTT }; // each object contains just those two
  });

  // --- Totals ---
  const totalTTC = devis.pieces.reduce((sum, item) => {
    const q = Number(item.quantity) || 0;
    const subtotal = Number(item.subtotal) || 0;
    return sum + q * subtotal;
  }, 0);

  const totalHT = totalTTC * (1 - taxRate);
  const tva = totalTTC - totalHT;

  const handelDownloadPDF = () => {
    generatePDF(devis);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-around items-center my-4 sm:my-6 space-y-4 sm:space-y-0">
        <h1 className="text-xl sm:text-2xl font-bold">Devis preview</h1>
        <div className="space-x-2">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handelDownloadPDF}
          >
            <Download className="w-4 h-4 mr-2 " />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="bg-white text-black mx-auto w-full min-h-screen p-4 sm:p-[20mm] print:p-0 sm:w-[210mm] sm:min-h-[297mm]">
        {/* Header */}
        <div className="relative w-[240px] h-[60px] ">
          <Image
            src="/2bfuturlogo.png"
            alt="Logo"
            sizes="240px"
            fill
            priority
            className="object-contain"
          />
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start mb-6 space-y-4 sm:space-y-0">
          {/* Facture */}
          <div className="text-sm pt-4">
            <p>
              <strong>Devis N° :</strong> {devis.devisref}
            </p>
            <p>
              <strong>Bon de livraison :</strong> {devis.devisref}
            </p>
            <p>
              <strong>Bon de commande N° :</strong> {devis.devisref}
            </p>
          </div>

          {/* Client  */}
          <div className="sm:text-right">
            {' '}
            <div className="text-left sm:text-center">
              {' '}
              <h1 className="text-lg sm:text-xl font-bold">
                {devis.client.name}
              </h1>
              <p className="text-sm">{devis.client.address}</p>
            </div>
            <div className="text-left">
              <p className="text-sm">
                <span className="font-semibold"> ICE N°:</span>{' '}
                {devis.client.ice}
              </p>
            </div>
            <p className="text-left">
              <strong>Bateau :</strong>
            </p>
          </div>
        </div>

        {/* Page and date */}
        <div className="text-right">
          <p>Agadir le {devis.createdAt.toISOString().split('T')[0]}</p>
          <p>Page N°: 1</p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-black border-collapse mb-6 min-w-[600px] sm:min-w-0">
            <thead>
              <tr className="border-b border-black">
                <th className="px-2 py-1 text-left w-[60%]">DESIGNATION</th>
                <th className="px-2 py-1 w-[10%] text-center">QTE</th>
                <th className="px-2 py-1 w-[10%] text-center">P.T</th>
                <th className="px-2 py-1 w-[10%] text-center">HTP.U</th>
                <th className="px-2 py-1 w-[10%] text-center">HT</th>
              </tr>
            </thead>
            <tbody>
              {devis.pieces.map((item, i) => (
                <tr key={i} className="border-b border-gray-400">
                  <td className="px-2 py-[2mm]">{item.piece.name}</td>
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-center">
                    {Number(item.subtotal).toFixed(2)}
                  </td>
                  <td className="text-center">
                    {piecesWithHT[i].PHTU.toFixed(2)}
                  </td>
                  <td className="text-center">
                    {piecesWithHT[i].PHTT.toFixed(2)}
                  </td>
                </tr>
              ))}

              {/* Empty */}
              {Array.from({ length: 8 }).map((_, i) => (
                <tr key={`empty-${i}`}>
                  <td className="px-2 py-[5mm]">&nbsp;</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="text-sm mb-4">
          <div className="flex justify-end mb-2">
            <div className="w-full sm:w-[250px]">
              <div className="flex justify-between border-b border-black">
                <span>Total HT</span>
                <span>{totalHT.toFixed(2)} DH</span>
              </div>
              <div className="flex justify-between border-b border-black">
                <span>TVA {(taxRate * 100).toFixed(0)}%</span>
                <span>{tva.toFixed(2)} DH</span>
              </div>
              <div className="flex justify-between border-b border-black font-semibold">
                <span>Total TTC</span>
                <span>{totalTTC.toFixed(2)} DH</span>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-4">
          <strong>
            ARRETEE LA PRESENTE FACTURE EN TOUTES TAXES COMPRISES A LA SOMME DE
            :{numberToFrenchWords(totalTTC)}
          </strong>
        </p>
        <p className="italic">{}</p>

        {/* Footer */}
        <div className="text-[10px] leading-snug border-t border-black pt-2 mt-4">
          <p>
            Adresse: {binfos.footer.address} &nbsp;&nbsp; Tel:{' '}
            {binfos.footer.tel} &nbsp;&nbsp; Email: {binfos.footer.email}
          </p>
          <p>
            Capital: {binfos.footer.capital} &nbsp;&nbsp; ICE:{' '}
            {binfos.footer.ice} &nbsp;&nbsp; IF: {binfos.footer.if} &nbsp;&nbsp;
            RC: {binfos.footer.rc} &nbsp;&nbsp; TP: {binfos.footer.tp}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DevisPreview;
