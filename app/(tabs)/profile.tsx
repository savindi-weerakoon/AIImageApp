import { SafeAreaProvider } from "react-native-safe-area-context";
import { SafeAreaView, Text } from "react-native";
import commonStyles from "@/styles/commonStyles";
import BasicButton from "@/components/atoms/BasicButton";
import { useAuth } from "@/hooks/useAuth";

export default function TabTwoScreen() {
  const styles = commonStyles()
  const { user, signOut } = useAuth()
  return (
    <SafeAreaProvider style={styles.page}>
      <SafeAreaView>
        <Text style={{ color: styles.white.color, fontSize: 20, paddingVertical: 32 }}>Hi { user?.email }</Text>
        <BasicButton title="Logout" onPress={signOut}/>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
