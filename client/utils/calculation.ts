import { Devis } from '@/types/devis';

export const calculateTotals = (devis: Devis, tax: number | string) => {
  const total = devis.pieces.reduce((sum, item) => {
    const quantity = Number(item.quantity) || 0;
    const subtotal = Number(item.subtotal) || 0;
    return sum + quantity * subtotal;
  }, 0);

  const rate = Number(tax) || 0;
  //   const horstax = total * (1 - rate);

  return {
    tax: parseFloat(rate.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
  };
};
