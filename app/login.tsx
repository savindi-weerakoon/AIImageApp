import { SafeAreaView  } from "react-native";
import { router } from 'expo-router';
import { useAuth } from './../hooks/useAuth'
import { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./../scripts/firebase"
import commonStyles from "@/styles/commonStyles"
import BasicForm from "@/components/moleculars/BasicForm";

export default function LoginScreen() {
  const { signIn } = useAuth()
  const styles = commonStyles()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSignIn = () => {
    if (email.trim() == '' || password.trim() == '') {
      alert('Enter email and password first')
      return
    }
    setIsLoading(true)
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential: any) => {
        setIsLoading(false)
        signIn(userCredential.user)
        router.replace('/')
      })
      .catch((error) => {
        setIsLoading(false)
        console.error('Error signing in:', error)
      });
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.page}>
        <BasicForm
          fields={[
            { name: 'email', placeholder: 'ENTER EMAIL', value: email, setValue: setEmail },
            { name: 'password', placeholder: 'ENTER PASSWORD', value: password, setValue: setPassword, secureTextEntry: true },
          ]}
          onSubmit={handleSignIn}
          disabled={isLoading}
          loading={isLoading}
          submitButtonTitle="Login"
          secondaryButtonTitle="Register"
          onSecondaryButtonPress={() => router.push('/register')}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  )
}
