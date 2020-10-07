import React from 'react'
import { View, Text, StyleSheet, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native'
import Modal from 'react-native-modal';

const { width, height } = Dimensions.get("window")

export default function WarningModal({ isVisible, closeModal, warningText }) {
    return (
        <View style={styles.container}>
            <Modal
                isVisible={isVisible}
                style={styles.modalStyle}
                onBackdropPress={() => closeModal()}
            >
                <View style={styles.content}>
                    <Text style={{ fontSize: 20 }}>{warningText}</Text>
                </View>


            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "absolute"
    },
    modalStyle: {
        flex: 1,
        marginHorizontal: 20,
        marginTop: height / 3,
        //justifyContent: 'flex-end',
        margin: 0,
    },
    content: {
        backgroundColor: 'white',
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    buttonContainer: {
        flexDirection: "row",
    },
    buttonStyle: {
        margin: 20,
        backgroundColor: "#22a591",
        height: 50,
        width: 150,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center"
    },
    buttonText: {
        fontWeight: "bold",
        fontSize: 18,
        color: "#fff"
    }
});

