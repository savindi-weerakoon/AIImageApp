// app/tabs/index.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList, Image, StyleSheet } from 'react-native';
import { getDocs, collection, db } from './../../scripts/firebase';

export default function HomeScreen() {
  const [images, setImages] = useState<string[]>([]);

  const fetchImages = async () => {
    const querySnapshot = await getDocs(collection(db, 'photos'));
    const imageList = querySnapshot.docs.map((doc) => doc.data().url);
    setImages(imageList);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <View style={styles.container}> 
      <FlatList
        data={images}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Image source={{ uri: item }} style={styles.image} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: 300, height: 300, marginBottom: 20 },
});
