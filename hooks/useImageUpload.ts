import { useState, useCallback } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/scripts/firebase';
import { UseImageUploadHook } from '@/types/composables.type';

const fetchImageAsBlob = async (url: string): Promise<Blob> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch image');
  }
  return response.blob();
};

export function useImageUpload(): UseImageUploadHook {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const uploadImage = useCallback(
    async (imageUrl: string, saveImageDetails: (url: string) => Promise<void>) => {
      try {
        setIsUploading(true);
        setProgress(0);

        const blob = await fetchImageAsBlob(imageUrl);
        const storageRef = ref(storage, `images/${Date.now()}.png`);
        const uploadTask = uploadBytesResumable(storageRef, blob);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progressValue = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(2);
            setProgress(parseFloat(progressValue));
            console.log(`Upload is ${progressValue}% done`);
          },
          (error) => {
            console.error('Upload error:', error);
            alert('Failed to upload image.');
          },
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            await saveImageDetails(url);
            setTimeout(() => {
              setProgress(0)
            }, 1000)
          }
        );
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Error uploading image.');
      } finally {
        setIsUploading(false);
      }
    },
    []
  );

  return { isUploading, progress, uploadImage };
}
