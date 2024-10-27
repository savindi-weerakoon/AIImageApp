import React from 'react';
import { FlatList, StyleSheet, Dimensions, ListRenderItem } from 'react-native';
import { Image } from 'expo-image';
import { BasicImageProps } from '@/types/component.type';

type ImageGalleryProps = {
  images: BasicImageProps[];
  onImagePress?: (image: BasicImageProps) => void;
};

const { width } = Dimensions.get('window');
const IMAGE_SIZE = width / 3 - 20;

export default function ImageGallery({ images }: ImageGalleryProps) {
  const renderItem: ListRenderItem<BasicImageProps> = ({ item }) => (
    <Image style={ styles.image } contentFit="cover" source={item.source} />
  );

  return (
    <FlatList
      data={images}
      renderItem={renderItem}
      keyExtractor={(item) => item.source}
      numColumns={3}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 4,
    paddingVertical: 8, 
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    margin: 4,
  },
});
