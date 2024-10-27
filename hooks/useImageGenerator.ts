// hooks/useImageGenerator.ts
import { useState, useCallback } from 'react';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";

type ImageData = {
  uri: string;
  width?: number;
  height?: number;
};

type UseImageGeneratorHook = {
  imageUri: ImageData | null;
  generatedImage: string;
  generating: boolean;
  openImagePicker: () => Promise<void>;
  generateImage: (prompt: string, mask: any) => Promise<void>;
  cancelGenerate: () => void;
  cancelPublish: () => void;
};

export function useImageGenerator(): UseImageGeneratorHook {
  const [imageUri, setImageUri] = useState<ImageData | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string>('');
  const [generating, setGenerating] = useState<boolean>(false);

  const cancelGenerate = useCallback(() => {
    setImageUri(null);
  }, []);

  const cancelPublish = useCallback(() => {
    setGeneratedImage('');
    cancelGenerate();
  }, [cancelGenerate]);

  const generateImage = useCallback(
    async (prompt: string, mask: any) => {
      if (!mask) {
        alert('A mask should be selected');
        return;
      }

      setGenerating(true);

      try {
        const formData = new FormData();
        if (imageUri) {
          formData.append('image', {
            uri: imageUri.uri,
            name: `${Date.now()}.${SaveFormat.PNG}`,
            type: `image/${SaveFormat.PNG}`,
          } as any);
        }
        formData.append('mask', mask as any);
        formData.append('prompt', prompt);
        formData.append('n', '1');
        formData.append('size', '512x512');

        const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_KEY

        const res = await fetch('https://api.openai.com/v1/images/edits', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        });

        if (!res.ok) {
          const errorData = await res.json();
          console.error('Error:', errorData);
          return;
        }

        const data = await res.json();
        if (data?.data?.length > 0) {
          setGeneratedImage(data.data[0].url);
          console.log('Generated Image Data:', data);
        }
      } catch (error) {
        console.error('Error generating image:', error);
      } finally {
        setGenerating(false);
      }
    },  
    [imageUri]
  );

  const openImagePicker = useCallback(async () => {
    const imageData: ImageData = await captureAndPickImage(`${Date.now()}`) as any;
    const manipResult = await manipulateAsync(
      imageData.uri,
      [{ resize: { height: 445, width: 450 } }],
      { compress: 1, format: SaveFormat.PNG }
    );
    setImageUri(manipResult as ImageData);
  }, []);

  return {
    imageUri,
    generatedImage,
    generating,
    openImagePicker,
    generateImage,
    cancelGenerate,
    cancelPublish,
  };
}


const setImageData = async (image: ImagePicker.ImagePickerResult, id: string) => {
    const imageUri = image?.assets?.[0].uri || ''
    const imageType = image?.assets?.[0]?.fileName?.split('.').slice(-1)[0] || 'jpg'
  
    return {
      uri: imageUri,
      name: `${id}.${imageType}`,
      type: imageType,
    } as ImageData
}

const captureAndPickImage = async (id: string): Promise<ImageData | null> => {
    try {
      // Request media library permission and handle the status
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync()
      if (mediaLibraryPermission.status !== 'granted') {
        alert('Media library access is required.')
        return null
      }
  
      // Request camera permission and handle the status
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync()
      if (cameraPermission.status !== 'granted') {
        alert('Camera access is required.')
        return null
      }
  
      // Launch the camera and get the result
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0,
      })
  
      if (!result.canceled) {
        const data = await setImageData(result, id)
        if (data) return data
      }
      return null
    } catch (error) {
      alert('Something went wrong. Please try again.')
      return null
    }
}
