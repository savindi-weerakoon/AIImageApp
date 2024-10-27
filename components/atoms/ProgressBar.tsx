import commonStyles from "@/styles/commonStyles";
import { ProgressBarProps } from "@/types/component.type";
import { View, Text  } from "react-native";

export default (props: ProgressBarProps) => {
    const { value = 0 } = props
    const styles = commonStyles()
    return (
        <>
            {value ? <View style={{ ...styles.progressBar, width: `${value}%` }}>
                <Text style={ styles.progressBarText }>{ `${value}%` }</Text>
            </View> : null}
        </>
    )
}