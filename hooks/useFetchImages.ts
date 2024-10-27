import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { firestore } from '@/scripts/firebase';
import { UseFetchImagesHook } from '@/types/composables.type';

export function useFetchImages(uid?: string): UseFetchImagesHook {
  const [images, setImages] = useState<ImageData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
        let data = doc.data()
        data = {
          ...data,
          source: data.imageUrl
        }
        return {
          id: doc.id,
          ...(data as Omit<ImageData, 'id'>),
        }
      });

      setImages(fetchedImages);
    } catch (err: any) {
      console.error('Error fetching images:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return { images, isLoading, error, fetchImages } as any;
}
