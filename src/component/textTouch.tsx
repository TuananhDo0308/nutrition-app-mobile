import React from "react"
import { TouchableOpacity, View, Text, StyleSheet, TextStyle } from "react-native";

interface TextTouchProps {
    onPress: () => void,
    title: string,
    TextStyle?: TextStyle,
}

const TextTouch: React.FC<TextTouchProps> = ({onPress, title, TextStyle}) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <Text style={TextStyle}>{title}</Text>
        </TouchableOpacity>
    );
}

export default TextTouch