// app/firebase.ts
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

import firebaseConfig from '../firebaseConfig.json';

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const storage = getStorage(app);
const db = getFirestore(app);

export { app, auth, storage, ref, uploadBytes, getDownloadURL, db, collection, addDoc, getDocs };
