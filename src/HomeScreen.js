import React, { useState, useEffect } from 'react'
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';


export default HomeScreen = ({ navigation }) => {

    const [adress, setAdress] = useState()

    useEffect(() => {
        getAdress()
    }, [])

    async function getAdress() {
        //console.log("get adress")
        try {
            const carAdress = await AsyncStorage.getItem("@carAdress")
            setAdress(carAdress)
            console.log("adresss", carAdress)
        } catch (error) {
            console.log("Car adress Error=", error)
        }

    }



    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <TouchableOpacity onPress={() => navigation.navigate('Map')}>
                <Text>{adress === "" || adress === null ? "Haritaya Git" : adress}</Text>
            </TouchableOpacity>
        </View>
    )
}
