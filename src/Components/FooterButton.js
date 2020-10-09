import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';

export default function FooterButton({ onPress, text, iconName }) {
    return (
        <TouchableOpacity
            style={styles.buttonStyle}
            onPress={() => onPress()}>
            <Icon name={iconName} size={30} color="#fff" />
            <Text style={{ color: "#fff" }}>{text}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    buttonStyle: {
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 5,
    }
});
