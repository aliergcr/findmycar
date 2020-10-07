import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { requestMultiple, PERMISSIONS } from 'react-native-permissions';
import Geocoder from 'react-native-geocoding';
import { API_KEY } from "@env"

const { height, width } = Dimensions.get("window")

export default HomeScreen = ({ navigation }) => {

    const [adress, setAdress] = useState()

    useEffect(() => {
        Geocoder.init(API_KEY);
        const permissions =
            Platform.OS === 'ios'
                ? [
                    PERMISSIONS.IOS.LOCATION_ALWAYS,
                    PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
                ]
                : [
                    PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
                    PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
                ];
        requestMultiple(permissions)
            .then((statuses) => {

                //console.log('permissions=', statuses);
            })
            .catch((err) => console.log('Permissions Error', err));

        //getAdress()
    }, [])

    useFocusEffect(
        React.useCallback(() => {
            getAdress()

        }, [])
    );

    const getAdress = async () => {
        //console.log("get adress")
        try {
            const carAdress = await AsyncStorage.getItem("@carAdress")
            setAdress(carAdress)
            //console.log("adresss", carAdress)
        } catch (error) {
            console.log("Car adress Error=", error)
        }
    }

    return (
        <View style={{ flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Map', { type: "findCar" })}>
                <Text style={styles.cardHeader}>Find Your Car</Text>
                <Text>{adress === "" || adress === null ? "No adress, go to map and park your car" : adress}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Map', { type: "parkCar" })}>
                <Text style={styles.cardHeader}>Park Your Car</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        height: height / 5,
        width: width / 2 - 20,
        padding: 10,
        backgroundColor: "#ade4",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        margin: 10
    },
    cardHeader: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 5,
        textAlign: "center"
    }
})

