import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '@/scripts/firebase';
import { useAsyncStorage } from './useAsyncStorage'; // Import the AsyncStorage hook

type ImageData = {
  id: string;
  uid: string;
  email: string;
  imageUrl: string;
  uploadedAt: string;
  source: string;
};

export function useFetchImages(uid?: string) {
  const { storedValue, saveValue, loading: storageLoading } = useAsyncStorage<ImageData[]>('cachedImages');
  const [images, setImages] = useState<ImageData[]>(storedValue || []);
  const [isLoading, setIsLoading] = useState<boolean>(!storedValue); // Only load if no cached images
  const [error, setError] = useState<string | null>(null);

  const fetchImages = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const imagesRef = collection(firestore, 'uploads');
      let q = imagesRef;

      if (uid) {
        q = query(imagesRef, where('uid', '==', uid));
      }

      const querySnapshot = await getDocs(q);
      const fetchedImages: ImageData[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          uid: data.uid,
          email: data.email,
          imageUrl: data.imageUrl,
          uploadedAt: data.uploadedAt,
          source: data.imageUrl, // Set the source for rendering
        };
      });

      setImages(fetchedImages);
      await saveValue(fetchedImages); // Cache the fetched images
    } catch (err: any) {
      console.error('Error fetching images:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [uid, saveValue]);

  useEffect(() => {
    if (!storedValue) {
      fetchImages(); // Only fetch if no cached images available
    }
  }, [fetchImages, storedValue]);

  return { images, isLoading: isLoading || storageLoading, error, fetchImages };
}
