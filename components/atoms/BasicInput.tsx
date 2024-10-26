import commonStyles from "@/styles/commonStyles";
import { BasicInputProps } from "@/types/component.type";
import { TextInput  } from "react-native";

export default (props: BasicInputProps) => {
    const { value, placeholder, onChangeText, secureTextEntry = false, disabled = false } = props
    const styles = commonStyles()
    return (
        <TextInput style={styles.textInputStyles} placeholder={placeholder} value={value} readOnly={disabled} onChangeText={onChangeText} secureTextEntry={secureTextEntry} />
    )
}