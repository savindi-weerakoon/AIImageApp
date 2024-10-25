// app/login.tsx
import React from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import { GoogleAuthProvider, signInWithPopup, auth } from './../scripts/firebase';
import { useRouter } from 'expo-router';

export default function Login() {
  const router = useRouter();

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.replace('/'); // Redirect to home screen on successful login
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login with Google</Text>
      <Button title="Sign In" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 },
});
