import { View, StyleSheet, Text, TextInput, KeyboardAvoidingView, Platform, FlatList, Pressable, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import React, { useState } from 'react';
import { Image } from 'expo-image';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { useAssets } from 'expo-asset';

import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";

import Ionicons from '@expo/vector-icons/Ionicons'
import commonStyles from '@/styles/commonStyles';
import BasicButton from '@/components/atoms/BasicButton';

import { useImageDownloader } from '@/hooks/useDownload'

type ImageData = {
  uri: string;
  name: string;
  type: string;
} | null

const setImageData = async (image: ImagePicker.ImagePickerResult, id: string) => {
  const imageUri = image?.assets?.[0].uri || ''
  const imageType = image?.assets?.[0]?.fileName?.split('.').slice(-1)[0] || 'jpg'

  return {
    uri: imageUri,
    name: `${id}.${imageType}`,
    type: imageType,
  } as ImageData
}

const captureAndPickImage = async (id: string) => {
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

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const cStyles = commonStyles()
  const [imageUri, setImageUri] = useState<ImageData | null>(null)
  const [value, onChangeText] = useState('')
  const [generatedImage, setGeneratedImage] = useState(null)
  const [generating, setGenerating] = useState(false)
  const [mask, setMask] = useState<Mask | null>(null)
  const [assets] = useAssets([
    require('@/assets/images/masks/mask-glass-1.png'),
    require('@/assets/images/masks/mask-glass-2.png'),
    require('@/assets/images/masks/mask-glass-3.png'),
    require('@/assets/images/masks/mask-cartoon-1.png'),
    require('@/assets/images/masks/mask-masquerade-1.png'),
    require('@/assets/images/masks/mask-batman-1.png'),
    require('@/assets/images/masks/mask-spacehelmet-1.png'),
  ])
  const { downloadImage, isDownloading } = useImageDownloader();

  const cancelGenerate = () => {
    setImageUri(null)
    onChangeText('')
  }
  
  const cancelPublish = () => {
    setGeneratedImage(null)
    cancelGenerate()
  }

  const generateImage = async () => {
    try {
      if (!mask) {
        alert('A mask should selected')
        return
      }
      setGenerating(true)
      // Create a new FormData object
      const formData = new FormData()
      const dalleImg = {
        uri: imageUri?.uri,
        name: `${new Date().getTime()}.${SaveFormat.PNG}`,
        type: `image/${SaveFormat.PNG}`
      }      
      
      formData.append("image", dalleImg as any);
      formData.append("mask", mask as any);
      // Add other required parameters to the FormData
      formData.append("prompt", value);
      formData.append("n", "1");
      formData.append("size", "512x512");
  
      // Send the request to the OpenAI API
      const res = await fetch("https://api.openai.com/v1/images/edits", {
        method: "POST",
        headers: {
          Authorization: `Bearer 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`,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error:", errorData);
        setGenerating(false);
        return;
      }
  
      const data = await res.json();
      if (data) {
        if (Array.isArray(data.data) && data.data.length > 0) {
          setGeneratedImage(data.data[0].url)
          console.log("Generated Image Data:", data)
        }
      }
      setGenerating(false);
    } catch (error) {
      console.error("Error generating image:", error);
      setGenerating(false);
    }
  };

  const openImagePicker = async () => {
    const imageData: ImageData = await captureAndPickImage(new Date().toString())
    const manipResult = await manipulateAsync(
      imageData?.uri || '',
      [
        {
          resize: {
            height: 445,
            width: 450
          }
        }
      ],
      { compress: 1, format: SaveFormat.PNG }
    );
    setImageUri(manipResult as unknown as ImageData)
  }

  type Mask = {
    id: string
    name: string
    uri?: string
    type?: string
  }

  const masks: Mask[] = [
    {
      id: 'mask-1',
      name: 'mask-glass-1'
    },
    {
      id: 'mask-2',
      name: 'mask-glass-2'
    },
    {
      id: 'mask-3',
      name: 'mask-glass-3'
    },
    {
      id: 'mask-4',
      name: 'mask-cartoon-1'
    },
    {
      id: 'mask-5',
      name: 'mask-masquerade-1'
    },
    {
      id: 'mask-6',
      name: 'mask-batman-1'
    },
    {
      id: 'mask-7',
      name: 'mask-spacehelmet-1'
    }
  ]

  return (
    <SafeAreaProvider>
      <SafeAreaView style={cStyles.page}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
          {!generatedImage && !imageUri && <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <TouchableOpacity onPress={openImagePicker}>
              <Ionicons name="camera" size={64} color={Colors[colorScheme ?? 'light'].tint} />
            </TouchableOpacity>
          </View>}
          {!generatedImage && imageUri && <View style={styles.cameraContainer}>
            <Image
              style={cStyles.imageContain}
              source={imageUri}
              placeholder={imageUri}
              contentFit="contain"
              transition={500}
            />
            <FlatList
              horizontal={true}
              data={masks}
              style={{ flexGrow: 0 }}
              renderItem={({item, index}) => {
                const maskObj = {
                  uri: assets?.[index].localUri || '',
                  name: assets?.[index].name || '',
                  type: `image/${SaveFormat.PNG}`
                }
                return <View style={{ width: 100, height: 100, backgroundColor: mask?.name === assets?.[index].name ? 'red' : 'transparent' }}>
                  <Pressable onPress={() => setMask(maskObj as Mask)}>
                    <Image style={{ width: '100%', height: '100%' }} contentFit="cover" source={assets?.[index] as unknown as string} />
                  </Pressable>
                </View>
              }}
              keyExtractor={item => item.id}
            />
            <TextInput
              aria-disabled={generating}
              autoFocus
              editable
              multiline
              placeholder="Enter your prompt here..."
              numberOfLines={2}
              maxLength={500}
              onChangeText={text => onChangeText(text)}
              value={value}
              style={{ flex: 1/3, color: Colors[colorScheme ?? 'light'].tint, fontSize: 20, padding: 8 }}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{ paddingEnd: 8 }}>
                <BasicButton title={"Cancel"} outlined onPress={cancelGenerate} disabled={generating} />
              </View>
              <View style={{ paddingStart: 8 }}>
                <BasicButton title={generating ? "Generating..." : "Generate"} onPress={generateImage} disabled={generating} loading={generating} />
              </View>
            </View>
          </View>
          }
          {generatedImage && <View style={styles.generatedImageContainer}>
            <View style={{ flex: 1 }}>
              <Image
                style={cStyles.imageContain}
                source={generatedImage}
                placeholder={generatedImage}
                contentFit="contain"
                transition={500}
              />
              <TouchableOpacity onPress={() => downloadImage(generatedImage)} style={{ position: 'absolute', bottom: 24, right: 0 }}>
                { isDownloading ? <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
                  <Text style={{color: Colors[colorScheme ?? 'light'].tint}}>Image is being saved...</Text>
                  <ActivityIndicator />
                </View> : <Ionicons name="download" size={32} color={Colors[colorScheme ?? 'light'].tint} />}
              </TouchableOpacity>
            </View>
            <BasicButton title={generating ? "Regenerating..." : "Regenerate"} onPress={generateImage} disabled={generating || isDownloading} loading={generating} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
              <BasicButton title={"Cancel"} outlined onPress={cancelPublish} />
              <BasicButton title={"Publish"} onPress={generateImage} disabled={isDownloading} />
            </View>
          </View>}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  cameraButtoncontainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cameraContainer: {
    flex: 1,
    paddingTop: 24
  },
  generatedImageContainer: {
    flex: 1
  }
});
