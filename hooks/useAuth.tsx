import { useEffect, useState, useCallback, createContext, useContext, type PropsWithChildren } from 'react';
import { useAsyncStorage } from './useAsyncStorage';
import { router } from 'expo-router';
import { AuthContextType, User } from '@/types/composables.type';

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the AuthContext
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: PropsWithChildren) {
  const { storedValue: user, saveValue, deleteValue, loading } = useAsyncStorage<User>('auth_user');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Monitor user state and update authentication status
  useEffect(() => {
    const checkAuth = Boolean(user)
    setIsAuthenticated(checkAuth)
    if (checkAuth) {
      router.navigate('/')
    } else {
      router.navigate('/login')
    }
  }, [user]);

  // Sign in function to store user data in AsyncStorage
  const signIn = useCallback(
    async (userData: User) => {
      try {
        await saveValue(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error during sign-in:', error);
      }
    },
    [saveValue]
  );

  // Sign out function to clear user session
  const signOut = useCallback(async () => {
    try {
      await deleteValue();
      setIsAuthenticated(false)
      router.navigate('/login')
    } catch (error) {
      console.error('Error during sign-out:', error);
    }
  }, [deleteValue]);

  const value: AuthContextType = {
    user,
    signIn,
    signOut,
    isLoading: loading,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
