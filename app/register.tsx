import { SafeAreaView  } from "react-native";
import { router } from 'expo-router';
import { useAuth } from './../hooks/useAuth'
import { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./../scripts/firebase"
import commonStyles from "@/styles/commonStyles"
import BasicForm from "@/components/moleculars/BasicForm";

export default function RegisterScreen() {
  const { signIn } = useAuth()
  const styles = commonStyles()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')

  const handleSignIn = () => {
    if (email.trim() == '' || password.trim() == '') {
      alert('Enter email and password first')
    } else if (password !== confirmPassword) {
      alert('Password and confirmation password does not match')
    } else {
      console.log(auth)
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential: any) => {
          console.log(userCredential)
          signIn(userCredential.user);
          router.replace('/'); // Navigate to home on success
        })
        .catch((error) => {
          console.error('Error signing in:', error);
        })
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.page}>
        <BasicForm
          fields={[
            { name: 'email', placeholder: 'ENTER EMAIL', value: email, setValue: setEmail },
            { name: 'password', placeholder: 'ENTER PASSWORD', value: password, setValue: setPassword, secureTextEntry: true },
            { name: 'confirmPassword', placeholder: 'CONFIRM PASSWORD', value: confirmPassword, setValue: setConfirmPassword, secureTextEntry: true },
          ]}
          onSubmit={handleSignIn}
          submitButtonTitle="Register"
          secondaryButtonTitle="Login"
          onSecondaryButtonPress={() => router.push('/login')}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  )
}