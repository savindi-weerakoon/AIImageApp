import { SafeAreaProvider } from "react-native-safe-area-context";
import { SafeAreaView } from "react-native";
import commonStyles from "@/styles/commonStyles";
import BasicButton from "@/components/atoms/BasicButton";
import { useAuth } from "@/hooks/useAuth";

export default function TabTwoScreen() {
  const styles = commonStyles()
  const { signOut } = useAuth()
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.page}>
        <BasicButton title="Logout" onPress={signOut}/>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
