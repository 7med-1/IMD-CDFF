/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState, useCallback, memo } from 'react';
import {
  useGetPiecesQuery,
  useCreatePieceMutation,
  useUpdatePieceMutation,
  useDeletePieceMutation,
  useAddPieceQuantityMutation,
  useTakePieceMutation,
} from '@/state/api';
import { Plus, Minus, Trash2, Search, Loader2 } from 'lucide-react';
import Image from 'next/image';
import CreatePieceModal from './CreatePieceModal';
import UpdatePieceModal, { PieceFormData } from './UpdatePieceModal';
import BackToTopButton from '../(components)/BackToTopButton';
import ImagePreviewModal from './ImagePreviewModal';

export const PieceCard = memo(
  ({
    piece,
    onIncrement,
    onClickImage,
    onDecrement,
    onEdit,
    onDelete,
    priority,
  }: any) => {
    return (
      <div className="border rounded-lg shadow p-4 flex flex-col justify-between">
        <div className="flex flex-col items-start">
          <div className="relative w-full h-40 mb-3 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
            {piece.image ? (
              <Image
                src={piece.image}
                alt={piece.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain rounded-lg"
                onClick={onClickImage}
                {...(priority && { priority: true })}
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <span className="text-gray-400 text-sm">No image</span>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <h2 className="font-semibold text-lg break-words h-10 overflow-hidden">
              {piece.name}
            </h2>
            <p className="text-sm text-gray-600">Ref: {piece.reference}</p>
            <p className="text-sm text-gray-600">Place: {piece.place}</p>
            <p className="text-sm text-gray-600">Qty: {piece.quantity}</p>
            <p className="text-sm text-gray-600">Price: {piece.price} MAD</p>
          </div>
        </div>

        <div className="flex justify-between mt-4">
          <div className="flex gap-2">
            <button
              onClick={onDecrement}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              onClick={onIncrement}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={onEdit}
            className="px-3 bg-gray-100 hover:bg-gray-200 rounded"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }
);

PieceCard.displayName = 'PieceCard';

const Pieces = () => {
  //search,data,page
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch } = useGetPiecesQuery({
    page,
    limit: 12,
    search: debouncedSearch,
  });

  //piece states
  const [createPiece] = useCreatePieceMutation();
  const [updatePiece] = useUpdatePieceMutation();
  const [deletePiece] = useDeletePieceMutation();
  const [addQty] = useAddPieceQuantityMutation();
  const [takeQty] = useTakePieceMutation();

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  //edit piece modal
  const [selectedPiece, setSelectedPiece] = useState<PieceFormData | null>(
    null
  );
  const [selectedPieceId, setSelectedPieceId] = useState('');

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(handler);
  }, [search]);

  // Handlers
  const handleCreate = async (formData: FormData) => {
    await createPiece(formData);
    refetch();
    setIsCreateModalOpen(false);
  };

  //image
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null | undefined>(
    null
  );
  const handleOpenPreview = (url: string | undefined) => {
    setSelectedImage(url);
    setIsPreviewOpen(true);
  };

  //increment,decrement,delete
  const handleIncrement = useCallback(
    async (id: string) => {
      await addQty({ pieceId: id, amount: 1 });
      refetch();
    },
    [addQty, refetch]
  );

  const handleDecrement = useCallback(
    async (id: string) => {
      await takeQty({ pieceId: id, amount: 1 });
      refetch();
    },
    [takeQty, refetch]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (confirm('Delete this piece?')) {
        await deletePiece(id);
        refetch();
      }
    },
    [deletePiece, refetch]
  );

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-600">
        <Loader2 className="animate-spin w-6 h-6 mr-2" /> Loading...
      </div>
    );

  return (
    <div className="p-6 mx-auto max-w-6xl min-h-screen w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Pieces</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          <Plus className="w-5 h-5 mr-2" /> Add Piece
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center border rounded-md mb-6 p-2">
        <Search className="w-5 h-5 text-gray-500 mr-2" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search pieces..."
          className="flex-1 outline-none bg-transparent"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {data?.data?.map((piece) => (
          <PieceCard
            key={piece.pieceId}
            piece={piece}
            {...(page === 1 && { priority: true })}
            onIncrement={() => handleIncrement(piece.pieceId)}
            onDecrement={() => handleDecrement(piece.pieceId)}
            onDelete={() => handleDelete(piece.pieceId)}
            onClickImage={() => handleOpenPreview(piece.image)}
            onEdit={() => {
              setSelectedPiece(piece);
              setSelectedPieceId(piece.pieceId);
              setIsUpdateModalOpen(true);
            }}
          />
        ))}
      </div>

      {/* Pagination */}
      {data?.pagination && (
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-2 text-gray-700">
            Page {page} / {data.pagination.totalPages || 1}
          </span>
          <button
            onClick={() =>
              setPage((p) =>
                data.pagination.totalPages
                  ? Math.min(p + 1, data.pagination.totalPages)
                  : p
              )
            }
            disabled={page === data.pagination.totalPages}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Modals */}
      <CreatePieceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreate}
      />

      {selectedPiece && (
        <UpdatePieceModal
          isOpen={isUpdateModalOpen}
          pieceData={selectedPiece}
          pieceId={selectedPieceId}
          onClose={() => setIsUpdateModalOpen(false)}
          onUpdate={async (formData) => {
            await updatePiece({ pieceId: selectedPieceId!, formData });
            refetch();
          }}
        />
      )}
      <ImagePreviewModal
        isOpen={isPreviewOpen} 
        imageUrl={selectedImage}
        onClose={() => setIsPreviewOpen(false)} 
      />

      <BackToTopButton />
    </div>
  );
};

export default Pieces;
