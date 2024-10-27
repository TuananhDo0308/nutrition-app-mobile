import React from "react"
import { TouchableOpacity, Text, StyleSheet } from "react-native"

interface CustomButtonProps {
    onPress: () => void;
    title: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({ onPress, title }) => (
    <TouchableOpacity onPress={onPress} style={styles.CustomButtonContainer}>
        <Text style={styles.CustomButtonText}>
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
        alignSelf: 'center',
        marginTop: 8,
    },
    CustomButtonText: {
        flex: 1,
        paddingTop: 4,
        alignSelf: 'center',
        fontWeight: 'bold',
        fontSize: 25,
    }
})

export default CustomButton