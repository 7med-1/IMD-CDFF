'use client';

import React, { useState, useEffect } from 'react';
import Header from '../(components)/Header';

export type PieceFormData = {
  name: string;
  reference: string;
  quantity: number;
  description?: string;
  place: string;
  price?: number;
  image?: string;
  imageFile?: File; 
};

type UpdatePieceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  pieceId: string;
  pieceData: PieceFormData;
  onUpdate: (data: FormData) => void; 
};

const UpdatePieceModal = ({
  isOpen,
  onClose,
  pieceData,
  pieceId,
  onUpdate,
}: UpdatePieceModalProps) => {
  const [formData, setFormData] = useState<PieceFormData>(pieceData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setFormData(pieceData); 
  }, [pieceData]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'quantity' || name === 'price' ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const fd = new FormData();
      fd.append('name', formData.name);
      fd.append('reference', formData.reference);
      fd.append('place', formData.place);
      fd.append('description', formData.description || '');
      fd.append('quantity', formData.quantity?.toString() || '0');
      fd.append('price', formData.price?.toString() || '0');

      if (formData.imageFile) {
        fd.append('image', formData.imageFile); 
      }

      await onUpdate(fd); 
      onClose();
    } catch (err) {
      console.error(err);
      setError('Failed to update piece.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-start z-50 overflow-auto">
      <div className="mt-20 w-96 bg-white rounded shadow-lg p-5">
        <Header name="Update Piece" />
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            className="block w-full mb-2 p-2 border rounded"
            required
          />

          <label className="block text-sm font-medium text-gray-700">
            Reference
          </label>
          <input
            type="text"
            name="reference"
            value={formData.reference || ''}
            onChange={handleChange}
            className="block w-full mb-2 p-2 border rounded"
            required
          />

          <label className="block text-sm font-medium text-gray-700">
            Place
          </label>
          <input
            type="text"
            name="place"
            value={formData.place || ''}
            onChange={handleChange}
            className="block w-full mb-2 p-2 border rounded"
            required
          />

          <label className="block text-sm font-medium text-gray-700">
            Quantity
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity || 0}
            onChange={handleChange}
            className="block w-full mb-2 p-2 border rounded"
            required
          />

          <label className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            name="price"
            value={formData.price || 0}
            onChange={handleChange}
            className="block w-full mb-2 p-2 border rounded"
          />

          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            className="block w-full mb-2 p-2 border rounded"
          />

          <label className="block text-sm font-medium text-gray-700">
            Image URL
          </label>
          <input
            type="file"
            capture="environment"
            accept="image/*"
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                imageFile: e.target.files?.[0] || undefined,
              }))
            }
          />

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePieceModal;
