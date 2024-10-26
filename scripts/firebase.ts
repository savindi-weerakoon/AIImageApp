import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyB0dYReHcFZ3KOYxU9IbHmtbjobkFQOW4A",
  projectId: "ai-image-app-2bb6c",
  appId: "1:138977027108:ios:4fe44031ce04cfe3e9a4b1",
  storageBucket: "ai-image-app-2bb6c.appspot.com",
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const storage = getStorage(app);

export { app, auth, storage };