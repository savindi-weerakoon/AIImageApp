// hooks/useImageDownloader.ts
import { useState, useCallback } from 'react';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Alert } from 'react-native';

export function useImageDownloader() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadImage = useCallback(async (imageUrl: string) => {
    setIsDownloading(true);
    setError(null);

    try {
      // Request media library permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permission to access media library was denied.');
      }

      // Set a file path to save the downloaded image
      const fileUri = `${FileSystem.documentDirectory}downloaded-image.png`;

      // Download the image to the file system
      const { uri } = await FileSystem.downloadAsync(imageUrl, fileUri);
      console.log('Image downloaded to:', uri);

      // Save the image to the media library (Gallery)
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('Downloads', asset, false);

      Alert.alert('Success', 'Image has been saved to your gallery.');
    } catch (err: any) {
      console.error('Error downloading image:', err);
      setError(err.message);
      Alert.alert('Error', 'Failed to download the image. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  }, []);

  return { downloadImage, isDownloading, error };
}
