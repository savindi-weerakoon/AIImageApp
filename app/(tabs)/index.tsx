import { ScrollView, View, StyleSheet, Text, TextInput, KeyboardAvoidingView, Platform, FlatList, Pressable, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import React, { useCallback, useEffect, useState } from 'react';
import { Image } from 'expo-image';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SaveFormat } from 'expo-image-manipulator';
import { useAssets } from 'expo-asset';

import Ionicons from '@expo/vector-icons/Ionicons'
import commonStyles from '@/styles/commonStyles';
import BasicButton from '@/components/atoms/BasicButton';
import OnlineIndicator from '@/components/moleculars/OnlineIndicator'

import { useImageGenerator } from '@/hooks/useImageGenerator'
import { useImageUpload } from '@/hooks/useImageUpload'
import { useImageDownloader } from '@/hooks/useDownload'
import { useSaveImageDetails } from '@/hooks/useSaveImageDetails'
import { useFetchImages } from '@/hooks/useFetchImages'

import ProgressBar from '@/components/atoms/ProgressBar'
import { masks } from '@/constants/Masks';
import { Mask } from '@/types/composables.type';

import ImageGallery from '@/components/moleculars/ImageGallery'
import { BasicImageProps } from '@/types/component.type';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export default function HomeScreen() {
  const colorScheme = useColorScheme()
  const cStyles = commonStyles()
  const [prompt, onChangeText] = useState('')
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

  const {
    imageUri,
    generatedImage,
    generating,
    openImagePicker,
    generateImage,
    cancelGenerate,
    cancelPublish,
  } = useImageGenerator()

  const { isUploading, progress, uploadImage } = useImageUpload()
  const { downloadImage, isDownloading } = useImageDownloader()
  const { saveImageDetails, isSaving } = useSaveImageDetails()
  const { images, isLoading, fetchImages } = useFetchImages()

  const [refreshing, setRefreshing] = useState(false)
  const isOnline = useOnlineStatus()

  const onRefresh = useCallback(() => {
    fetchImages()
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 2000)
  }, [])

  const uploadImageToFirebase = async () => {
    uploadImage(generatedImage, saveImageDetails)
    setTimeout(() => {
      cancelPublish()
      fetchImages()
    }, 5000)
  }

  useEffect(() => {
    if (isOnline) {
      fetchImages()
    }
  }, [isOnline])

  return (
    <SafeAreaProvider>
      <SafeAreaView style={cStyles.page}>
        <OnlineIndicator />
        <ScrollView
          contentContainerStyle={{ flex: 1, justifyContent: 'center' }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            {!generatedImage && !imageUri && <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              { isLoading ?
                <View style={{ flex: 1/8, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator /></View> :
                  images.length > 0 ?
                    <View style={{ flex: 7/8 }}>
                      <ImageGallery images={images as unknown as BasicImageProps[]} />
                    </View> :
                  <Text style={{ color: cStyles.white.color, fontSize: 14, paddingVertical: 20 }}>Generate your first image</Text>
              }
              <TouchableOpacity style={{ flex: 1/8 }} onPress={openImagePicker}>
                <Ionicons name="camera" size={48} color={Colors[colorScheme ?? 'light'].tint} />
              </TouchableOpacity>
            </View>}
            {!generatedImage && imageUri && <View style={styles.cameraContainer}>
              <Image
                style={{...cStyles.imageContain, height: 300}}
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
                value={prompt}
                style={{ flex: 1/3, color: Colors[colorScheme ?? 'light'].tint, fontSize: 20, padding: 8 }}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{ paddingEnd: 8 }}>
                  <BasicButton title={"Cancel"} outlined onPress={cancelGenerate} disabled={generating} />
                </View>
                <View style={{ paddingStart: 8 }}>
                  <BasicButton title={generating ? "Generating..." : "Generate"} onPress={() => generateImage(prompt, mask)} disabled={generating} loading={generating} />
                </View>
              </View>
            </View>
            }
            {generatedImage && <View style={{ ...styles.generatedImageContainer,  flex: 1, alignContent: 'center'}}>
              <View style={{ flex: 1 }}>
                <Image
                  style={{ ...cStyles.imageContain, height: 300 }}
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
              <BasicButton title={generating ? "Regenerating..." : "Regenerate"} onPress={() => generateImage(prompt, mask)} disabled={generating || isDownloading} loading={generating} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
                <BasicButton title={"Cancel"} outlined onPress={cancelPublish} />
                <BasicButton title={isUploading || isSaving ? "Publishing..." : "Publish"} onPress={uploadImageToFirebase} disabled={isDownloading || isUploading || isSaving} loading={isUploading || isSaving} />
              </View>
            </View>}
            <ProgressBar value={progress} />
          </KeyboardAvoidingView>
        </ScrollView>
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
