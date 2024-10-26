import { Text, ActivityIndicator } from "react-native";
import commonStyles from "@/styles/commonStyles";
import { TouchableOpacity } from "react-native";
import { BasicButtonProps } from "@/types/component.type";

export default (props: BasicButtonProps) => {
    const { title, onPress, disabled = false, outlined = false, loading = false } = props
    const styles = commonStyles()
    return (
        <TouchableOpacity style={{...(outlined ? styles.buttonOutlined : styles.buttonFilled ), opacity: disabled ? 0.5 : 1}} disabled={disabled} onPress={onPress}>
            {
                loading ? <ActivityIndicator /> : <Text style={styles.buttonText}>{ title }</Text>
            }
        </TouchableOpacity>
    )
}