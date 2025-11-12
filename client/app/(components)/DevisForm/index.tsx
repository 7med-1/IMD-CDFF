import React from 'react';
import BasicDetails from '../comp-groupe/BasicDetails';
import ContactDetails from '../comp-groupe/ContactDetails';
import TaxAndTotals from '../comp-groupe/TaxAndTotals';
import DevisList from '../comp-groupe/DevisList';


export default function DevisForm() {
  return (
    <div className="space-y-6">
      <BasicDetails />
      <ContactDetails />
      <DevisList />
      <TaxAndTotals />
    </div>
  );
}
