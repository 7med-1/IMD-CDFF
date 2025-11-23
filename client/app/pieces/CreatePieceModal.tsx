'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { compressImage } from '@/utils/imagecompresor';


interface CreatePieceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (formData: FormData) => Promise<void>;
}

const CreatePieceModal = ({
  isOpen,
  onClose,
  onCreate,
}: CreatePieceModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    reference: '',
    place: '',
    quantity: '',
    price: '',
    image: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.reference || !formData.place) {
      setError('Please fill all required fields.');
      return;
    }

    try {
      setLoading(true); 

      const fd = new FormData();
      fd.append('name', formData.name);
      fd.append('reference', formData.reference);
      fd.append('place', formData.place);
      fd.append('quantity', formData.quantity?.toString() || '0');
      fd.append('price', formData.price?.toString() || '0');

      
      if (formData.image instanceof File) {
  try {
    // 1. Compress the image to 500KB
    const compressedFile = await compressImage(formData.image, 300);
    
    // 2. Append the NEW compressed file, not the original
    fd.append('image', compressedFile);
    
  } catch (error) {
    console.error("Compression failed:", error);
    // Optional: Fallback to original if compression fails
    fd.append('image', formData.image);
  }
}

      
      await onCreate(fd); 

      // reset form
      setFormData({
        name: '',
        reference: '',
        place: '',
        quantity: '',
        price: '',
        image: null,
      });

      onClose();
    } catch (err) {
      console.error(err);
      setError('Failed to create piece. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      {' '}
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        {/* Close Button */}{' '}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
        >
          {' '}
          <X className="w-5 h-5" />{' '}
        </button>
        ```
        <h2 className="text-xl font-semibold mb-4">Create New Piece</h2>
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-3">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name *</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded p-2 mt-1"
              placeholder="e.g. Metal Gear"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Reference *</label>
            <input
              name="reference"
              value={formData.reference}
              onChange={handleChange}
              className="w-full border rounded p-2 mt-1"
              placeholder="e.g. REF-12345"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Place *</label>
            <input
              name="place"
              value={formData.place}
              onChange={handleChange}
              className="w-full border rounded p-2 mt-1"
              placeholder="e.g. Warehouse A"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full border rounded p-2 mt-1"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Price (MAD)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full border rounded p-2 mt-1"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Image</label>
            <input
              type="file"
              capture="environment"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setFormData((prev) => ({ ...prev, image: file }));
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded mt-2"
          >
            {loading ? 'Creating...' : 'Create Piece'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePieceModal;
