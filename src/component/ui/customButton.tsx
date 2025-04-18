import React from "react"
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from "react-native"

interface CustomButtonProps {
    onPress: () => void;
    title: string;
    buttonStyle?: ViewStyle;
    textStyle?: TextStyle;
}

const CustomButton: React.FC<CustomButtonProps> = ({ onPress, title, buttonStyle, textStyle }) => (
    <TouchableOpacity onPress={onPress} 
    style={StyleSheet.flatten([styles.CustomButtonContainer, buttonStyle])}>
        <Text style={StyleSheet.flatten([styles.CustomButtonText, textStyle])}>
            {title}
        </Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create ({
    CustomButtonContainer: {
        borderRadius: 50,
        width: 300,
        height: 45,
        backgroundColor: '#62C998',
        alignItems: 'center',
        marginTop: 8,
    },
    CustomButtonText: {
        flex: 1,
        paddingTop: 8,
        alignSelf: 'center',
        fontWeight: 'bold',
        fontSize: 20,
    }
})

export default CustomButton