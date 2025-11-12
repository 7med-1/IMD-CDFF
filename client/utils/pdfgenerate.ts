/* eslint-disable @typescript-eslint/no-explicit-any */
import { jsPDF } from 'jspdf';
import logo from '@/public/2bfuturlogo.png';

export function numberToFrenchWords(n: number): string {
  const units = [
    '',
    'un',
    'deux',
    'trois',
    'quatre',
    'cinq',
    'six',
    'sept',
    'huit',
    'neuf',
    'dix',
    'onze',
    'douze',
    'treize',
    'quatorze',
    'quinze',
    'seize',
    'dix-sept',
    'dix-huit',
    'dix-neuf',
  ];

  const tens = [
    '',
    '',
    'vingt',
    'trente',
    'quarante',
    'cinquante',
    'soixante',
    'soixante',
    'quatre-vingt',
    'quatre-vingt',
  ];

  const hundredsText = 'cent';

  if (n === 0) return 'Zéro dirham';
  if (n < 0) return 'Moins ' + numberToFrenchWords(Math.abs(n));

  const [intPartStr, decPartStr] = n.toString().split(/[.,]/);
  const intPart = parseInt(intPartStr, 10);
  const decPart = decPartStr
    ? parseInt(decPartStr.padEnd(2, '0').slice(0, 2), 10)
    : 0;

  function helper(num: number): string {
    if (num === 0) return '';
    if (num < 20) return units[num];
    if (num < 100) {
      const ten = Math.floor(num / 10);
      const unit = num % 10;

      if (ten === 7 || ten === 9) {
        return tens[ten] + '-' + helper(10 + unit);
      }
      if (ten === 8 && unit === 0) return 'quatre-vingts';
      if (ten === 8) return 'quatre-vingt-' + units[unit];
      if (unit === 1 && ten !== 8) return tens[ten] + '-et-un';
      return tens[ten] + (unit ? '-' + units[unit] : '');
    }

    const hundred = Math.floor(num / 100);
    const remainder = num % 100;
    let prefix = '';
    if (hundred === 1) prefix = hundredsText;
    else if (hundred > 1) prefix = units[hundred] + ' ' + hundredsText;

    if (hundred > 1 && remainder === 0) prefix += 's';

    return prefix + (remainder ? ' ' + helper(remainder) : '');
  }

  const scales = ['', 'mille', 'million', 'milliard'];

  function largeNumberToWords(num: number): string {
    if (num === 0) return 'zéro';
    let words = '';
    let i = 0;
    while (num > 0) {
      const chunk = num % 1000;
      num = Math.floor(num / 1000);
      if (chunk > 0) {
        let chunkWords = helper(chunk);
        if (i === 1)
          chunkWords = (chunk === 1 ? '' : chunkWords) + ' ' + scales[i];
        else if (i > 1)
          chunkWords = chunkWords + ' ' + scales[i] + (chunk > 1 ? 's' : '');
        words = chunkWords + (words ? ' ' + words : '');
      }
      i++;
    }
    return words.trim();
  }

  const intWords = largeNumberToWords(intPart);
  const decWords = decPart > 0 ? helper(decPart) : '';

  let result = `${intWords} dirham${intPart > 1 ? 's' : ''}`;
  if (decPart > 0) result += ` et ${decWords} centime${decPart > 1 ? 's' : ''}`;

  // Capitalize first letter
  return result.charAt(0).toUpperCase() + result.slice(1);
}

// Generate Facture/Devis PDF

export const generatePDF = (devis: any) => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  const pageWidth = 210;
  const marginLeft = 15;
  const lineHeight = 6;

  // --- Company Info ---
  const binfos = {
    address: 'Douar Oukhrib Allal Commune Ait Amira Biougra',
    tel: '06-61-82-46-05',
    email: 'futur2b@gmail.com',
    capital: '100 000.00 DH',
    ice: '002814810000018',
    if: '50388031',
    rc: '23893',
    tp: '49810876',
  };

  // --- Tax + Calculations ---
  const taxRate =
    typeof devis.tax === 'number' && !isNaN(devis.tax)
      ? Number(devis.tax) / 100
      : 0.2;

  const piecesWithHT = devis.pieces.map((item: any) => {
    const subtotalTTC = Number(item.subtotal) || 0;
    const quantity = Number(item.quantity) || 0;
    const PHTU = subtotalTTC * (1 - taxRate);
    const PHTT = PHTU * quantity;
    return { ...item, PHTU, PHTT };
  });

  const totalTTC = devis.pieces.reduce(
    (sum: number, item: any) =>
      sum + (Number(item.subtotal) || 0) * (Number(item.quantity) || 0),
    0
  );
  const totalHT = totalTTC * (1 - taxRate);
  const tva = totalTTC - totalHT;

  //   // --- Outer Frame (rounded border) ---
  //   doc.setDrawColor(0);
  //   doc.roundedRect(10, 5, 190, 287, 3, 3);

  // --- Logo ---
  doc.addImage(logo.src, 'PNG', 15, 10, 63, 16); // 240px × 60px

  // --- Header Info ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Devis', pageWidth / 2, 35, { align: 'center' });

  doc.setFontSize(9);
  doc.text(`Devis N° : ${devis.devisref}`, 15, 45);
  doc.text(`Bon de livraison : ${devis.devisref}`, 15, 50);
  doc.text(`Bon de commande N° : ${devis.devisref}`, 15, 55);

  // Client info
  const clientX = pageWidth - 85;
  doc.setFont('helvetica', 'bold');
  doc.text(`${devis.client.name}`, clientX, 40);
  doc.setFont('helvetica', 'normal');
  doc.text(`${devis.client.address || ''}`, clientX, 45);
  doc.text(`ICE N° : ${devis.client.ice || ''}`, clientX, 50);
  doc.text(`Bateau :`, clientX, 55);

  // Date and Page
  const dateStr = new Date(devis.createdAt).toISOString().split('T')[0];
  doc.text(`Agadir le ${dateStr}`, pageWidth - 60, 70);
  doc.text(`Page N° : 1`, pageWidth - 60, 75);

  // --- Table Header ---
  const startX = 15;
  let y = 85;
  const colWidths = [70, 20, 25, 25, 25];
  const headers = ['DESIGNATION', 'QTE', 'P.T', 'HTP.U', 'HT'];
  const tableWidth = colWidths.reduce((a, b) => a + b);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  let x = startX;
  headers.forEach((header, i) => {
    doc.text(header, x + 2, y);
    x += colWidths[i];
  });

  // Draw main table outline (rounded border only, no internal lines)
  const tableHeight = 80; // same as before
  doc.roundedRect(startX, y - 5, tableWidth, tableHeight, 2, 2);

  // --- Table Rows (NO TOP OR BOTTOM LINES) ---
  doc.setFont('helvetica', 'normal');
  y += 7;

  piecesWithHT.forEach((p: any) => {
    let x = startX;
    const row = [
      p.piece.name || '',
      p.quantity.toString(),
      (Number(p.subtotal) || 0).toFixed(2),
      p.PHTU.toFixed(2),
      p.PHTT.toFixed(2),
    ];

    // print text normally — no line drawing
    row.forEach((text, i) => {
      doc.text(text, x + 2, y);
      x += colWidths[i];
    });

    y += 7; // move to next row
  });

  // Fill remaining empty rows for visual spacing
  const maxRows = 10;
  for (let i = piecesWithHT.length; i < maxRows; i++) {
    y += 7;
  }

  // --- Totals ---
  y += 5;
  const totalX = pageWidth - 70;
  doc.setFont('helvetica', 'normal');
  doc.text('Total HT', totalX, y);
  doc.text(`${totalHT.toFixed(2)} MAD`, totalX + 40, y, { align: 'right' });

  y += lineHeight;
  doc.text(`TVA ${(taxRate * 100).toFixed(0)}%`, totalX, y);
  doc.text(`${tva.toFixed(2)} MAD`, totalX + 40, y, { align: 'right' });

  y += lineHeight;
  doc.setFont('helvetica', 'bold');
  doc.text('Total TTC', totalX, y);
  doc.text(`${totalTTC.toFixed(2)} MAD`, totalX + 40, y, { align: 'right' });

  // --- Total in words ---
  y += 12;
  doc.setFont('helvetica', 'bold');
  doc.text(
    'ARRETEE LA PRESENTE DEVIS EN TOUTES TAXES COMPRISES A LA SOMME DE :',
    15,
    y
  );
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.text(numberToFrenchWords(totalTTC), 15, y);

  // --- Footer ---
  y = 270;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `Adresse: ${binfos.address}   Tel: ${binfos.tel}   Email: ${binfos.email}`,
    15,
    y
  );
  y += 4;
  doc.text(
    `Capital: ${binfos.capital}   ICE: ${binfos.ice}   IF: ${binfos.if}   RC: ${binfos.rc}   TP: ${binfos.tp}`,
    15,
    y
  );

  // --- Save ---
  doc.save(`${devis.devisref}.pdf`);
};
