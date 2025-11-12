import Image from "next/image";

interface ImagePreviewModalProps {
  isOpen: boolean;
  imageUrl: string | null | undefined;
  onClose: () => void;
}

export default function ImagePreviewModal({
  isOpen,
  imageUrl,
  onClose,
}: ImagePreviewModalProps) {
  if (!isOpen || !imageUrl) return null;


  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onClose}
    >
      <div
        className="relative max-w-3xl w-full p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="relative top-2 right-2 text-white text-2xl font-bold"
        >
          &times;
        </button>
        <div className="relative w-full aspect-[4/3]">
          <Image
          src={imageUrl}
          alt="Preview"
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 60vw"
          className="object-contain rounded-lg shadow-xl"
          priority
        />
        </div>
      </div>
    </div>
  );
}
