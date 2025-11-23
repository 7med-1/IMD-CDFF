/**
 * Compresses an image file to a target size (default 500KB) using canvas.
 * * @param {File} file - The original image file.
 * @param {number} targetSizeKB - The target size in Kilobytes (default 500).
 * @returns {Promise<File>} - The compressed image file.
 */
export async function compressImage(file: File, targetSizeKB: number = 300): Promise<File> {
  const MAX_WIDTH = 1920; // Limit width to ensure significant size reduction
  const MAX_HEIGHT = 1080;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // 1. Resize logic: Maintain aspect ratio but cap dimensions
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            reject(new Error("Canvas context not available"));
            return;
        }
        ctx.drawImage(img, 0, 0, width, height);

        // 2. Compression Loop: Reduce quality until size is under target
        let quality = 0.9;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);
        
        // Estimate size: Base64 length * 0.75 is approx bytes
        while (dataUrl.length * 0.75 > targetSizeKB * 1024 && quality > 0.1) {
          quality -= 0.05;
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        // 3. Convert DataURL back to File
        fetch(dataUrl)
          .then((res) => res.blob())
          .then((blob) => {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          })
          .catch((e) => reject(e));
      };

      img.onerror = (e) => reject(e);
    };

    reader.onerror = (e) => reject(e);
  });
}