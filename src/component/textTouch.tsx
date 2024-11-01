import React from "react"
import { TouchableOpacity, View, Text, StyleSheet, TextStyle, ViewStyle } from "react-native";

interface TextTouchProps {
    onPress: () => void,
    title: string,
    TextStyle?: TextStyle,
    styleContainer?: ViewStyle,
}

const TextTouch: React.FC<TextTouchProps> = ({onPress, title, TextStyle, styleContainer}) => {
    return (
        <TouchableOpacity onPress={onPress} style={styleContainer}>
            <Text style={TextStyle}>{title}</Text>
        </TouchableOpacity>
    );
}

export default TextTouch