import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default () => {
    const colorScheme = useColorScheme()
    const styles = StyleSheet.create({
        page: {
            flex: 1,
            paddingHorizontal: 16,
            backgroundColor: Colors[colorScheme ?? 'light'].background
        },
        justifyCenter: {
            justifyContent: 'center'
        },
        form: {
            flex: 1,
            justifyContent: 'center'
        },
        textInputStyles: {
            height: 60,
            paddingHorizontal: 16,
            borderWidth: 2,
            borderColor: Colors[colorScheme ?? 'light'].primary,
            color: Colors[colorScheme ?? 'light'].text,
            marginBottom: 16,
            borderRadius: 8
        },
        white: {
            color: Colors[colorScheme ?? 'light'].text
        },
        buttonFilled: {
            paddingHorizontal: 16,
            height: 60,
            backgroundColor: Colors[colorScheme ?? 'light'].primary,
            marginBottom: 16,
            borderRadius: 8,
            alignContent: 'center',
            justifyContent: 'center',
            alignItems: 'center'
        },
        buttonOutlined: {
            paddingHorizontal: 16,
            height: 60,
            borderColor: Colors[colorScheme ?? 'light'].primary,
            borderWidth: 2,
            marginBottom: 16,
            borderRadius: 8,
            alignContent: 'center',
            justifyContent: 'center',
            alignItems: 'center'
        },
        buttonText: {
            color: Colors[colorScheme ?? 'light'].text,
            textTransform: 'uppercase'
        },
        icon: {
            color: Colors[colorScheme ?? 'light'].text,
        },
        imageContain: {
            flex: 1,
            borderRadius: 8
        },
        progressBar: {
            position: 'absolute',
            top: 0,
            width: '100%',
            height: 16,
            zIndex: 1,
            backgroundColor: Colors[colorScheme ?? 'light'].success,
            alignItems: 'center',
            justifyContent: 'center'
        },
        progressBarText: {
            color: Colors[colorScheme ?? 'light'].text,
            fontSize: 10
        },
        imageContainer: {
            marginBottom: 16,
            alignItems: 'center',
            width: '100%',
            height: '100%'
        },
        statusBarContainer: {
            width: '100%',
            paddingVertical: 8,
            alignItems: 'center',
            justifyContent: 'center'
        },
        statusText: {
            color: '#fff',
            fontSize: 10,
            fontWeight: 'bold',
        }
    })
    return styles
}