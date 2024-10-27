import { SafeAreaProvider } from "react-native-safe-area-context";
import { ActivityIndicator, SafeAreaView, Text, View } from "react-native";
import commonStyles from "@/styles/commonStyles";
import BasicButton from "@/components/atoms/BasicButton";
import { useAuth } from "@/hooks/useAuth";
import { useFetchImages } from "@/hooks/useFetchImages";
import ImageGallery from "@/components/moleculars/ImageGallery";
import { BasicImageProps } from "@/types/component.type";
import { useEffect } from "react";

export default function TabTwoScreen() {
  const styles = commonStyles()
  const { user, signOut } = useAuth()
  
  const { images, isLoading, fetchImages } = useFetchImages(user?.uid)

  useEffect(() => {
    fetchImages()
  }, [])
  return (
    <SafeAreaProvider style={styles.page}>
      <SafeAreaView style={{ flex: 1 }}>
        <Text style={{ color: styles.white.color, fontSize: 20, paddingVertical: 32 }}>Hi { user?.email }</Text>
          { isLoading ?
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator /></View> :
              images.length > 0 ?
                <View style={{ flex: 1 }}>
                  <ImageGallery images={images as unknown as BasicImageProps[]} />
                </View> :
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <Text style={{ color: styles.white.color, fontSize: 14, width: '100%', textAlign: 'center', paddingVertical: 20 }}>Generate your first image</Text>
                </View>
          }
        <BasicButton title="Logout" outlined onPress={signOut}/>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
