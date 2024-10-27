import { useState, useCallback } from 'react';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

export function useImageDownloader() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadImage = useCallback(async (imageUrl: string) => {
    setIsDownloading(true);
    setError(null);

    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permission to access media library was denied.');
      }

      const fileUri = `${FileSystem.documentDirectory}downloaded-image.png`;

      const { uri } = await FileSystem.downloadAsync(imageUrl, fileUri);
      console.log('Image downloaded to:', uri);

      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('Downloads', asset, false);

      alert('Image has been saved to your gallery.');
    } catch (err: any) {
      console.error('Error downloading image:', err);
      setError(err.message);
      alert('Failed to download the image. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  }, []);

  return { downloadImage, isDownloading, error };
}
