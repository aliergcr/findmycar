import React from 'react'
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'

const { width, height } = Dimensions.get("window")
export default function Parks({ selectPark }) {
    return (
        <ScrollView
            horizontal
            pagingEnabled
            scrollEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.parks}>
            <TouchableOpacity
                style={styles.park}
                onPress={() => selectPark({
                    latitude: 38.3372582,
                    longitude: 27.1299769,
                    title: "Optimum",
                    description: "Optimum Alışveriş Merkezi"
                })}>
                <Text>Optimum</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.park}
                onPress={() => selectPark({
                    latitude: 38.3671604,
                    longitude: 27.1398689,
                    title: "Optimum_2",
                    description: "Optimum Alışveriş Merkezi"
                })}>

                <Text>İnkılap</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.park}>
                <Text>Park3</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    parks: {
        flex: 1,
        backgroundColor: "transparent",
        position: "absolute",
        right: 0,
        left: 0,
        bottom: 0
    },
    park: {
        backgroundColor: "#fff",
        margin: 24,
        width: width - (24 * 2),
        height: 150,
        borderRadius: 16,
        padding: 10
    }
})
