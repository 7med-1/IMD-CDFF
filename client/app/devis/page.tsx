'use client';

import React, { useState } from 'react';
import DevisPreview from '../(components)/DevisPreview';
import { Eye } from 'lucide-react';
import { Button } from '../(components)/Button';
import DevisForm from '../(components)/DevisForm';

const Devis = () => {
  const [showPreview, setShowPreview] = useState(false);

  if (showPreview) {
    return <DevisPreview onBack={() => setShowPreview(false)} />;
  }
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-around items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Create un devis</h1>
          </div>
          <Button
            onClick={() => setShowPreview(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Eye className="w-4 h-4 mr-2"></Eye>
            Preview
          </Button>
        </div>
        <DevisForm />
      </div>
    </div>
  );
};

export default Devis;
