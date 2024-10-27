import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback } from 'react';

/**
 * Custom React Hook to interact with AsyncStorage.
 * Provides methods to get, set, and delete data in AsyncStorage.
 */
export function useAsyncStorage<T>(key: string) {
  const [storedValue, setStoredValue] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch the value from AsyncStorage when the component mounts
  useEffect(() => {
    const fetchStoredValue = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(key);
        if (jsonValue !== null) {
          setStoredValue(JSON.parse(jsonValue) as T);
        }
      } catch (error) {
        console.error(`Error fetching item with key "${key}":`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoredValue();
  }, [key]);

  // Save a value to AsyncStorage
  const saveValue = useCallback(
    async (value: T) => {
      try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
        setStoredValue(value); // Update the state
      } catch (error) {
        console.error(`Error saving item with key "${key}":`, error);
      }
    },
    [key]
  );

  // Remove a value from AsyncStorage
  const deleteValue = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(key);
      setStoredValue(null);
    } catch (error) {
      console.error(`Error deleting item with key "${key}":`, error);
    }
  }, [key]);

  return { storedValue, saveValue, deleteValue, loading };
}
