import React, { Component } from 'react';
import { Text, Platform, StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Header from './Header';
import Parks from './Parks';
import { requestMultiple, PERMISSIONS } from 'react-native-permissions';
//import Geolocation from '@react-native-community/geolocation';
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';

export default class Map extends Component {
    constructor(props) {
        super(props);

        this.state = {
            region: {
                latitude: 37.893071,
                longitude: 27.264429,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            },
            marker: {
                latitude: 37.865279,
                longitude: 27.263038,
            },
        };
    }
    async componentDidMount() {
        // request(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION).then((result) => { });
        this.getUserPosition();
        const permissions =
            Platform.OS == 'ios'
                ? [
                    PERMISSIONS.IOS.LOCATION_ALWAYS,
                    PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
                ]
                : [
                    PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
                    PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
                ];
        requestMultiple([
            PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
            PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ])
            .then((statuses) => {
                this.getUserPosition();
                console.log('permissions=', statuses);
            })
            .catch((err) => console.log('Permissions Error', err));
        //const data = await this.getCurrentPosition()
    }

    onRegionChange = (region) => {
        console.log('region', region);
        this.setState({ region });
    };

    async addMarker(e) {
        //console.log(e.nativeEvent.coordinate)
        this.setState({
            region: {
                ...this.state.region,
                latitude: e.nativeEvent.coordinate.latitude,
                longitude: e.nativeEvent.coordinate.longitude,
            },
            marker: e.nativeEvent.coordinate,
            title: 'Arabamın Konumu',
            description: 'Arabam Burada',
        });
        this.setStore();
    }

    async setStore() {
        try {
            const jsonValue = JSON.stringify(this.state.region);
            await AsyncStorage.setItem('@carPosition', jsonValue);
        } catch (e) {
            Alert.alert('Yazılamadı');
        }
    }

    selectPark(newRegion) {
        //console.log(newRegion)
        this.setState({
            region: {
                ...this.state.region,
                latitude: newRegion.latitude,
                longitude: newRegion.longitude,
            },
            marker: newRegion,
            title: newRegion.title,
            description: newRegion.description,
        });
    }

    getUserPosition() {
        Geolocation.getCurrentPosition(async (position) => {
            //console.log("position=", position)
            await this.setState({
                region: {
                    ...this.state.region,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                },
            });
        }),
            (error) => console.log('error', error),
        {
            enableHighAccuracy: false,
            timeout: 2000,
            maximumAge: 1000,
        };
    }
    async getCarPosition() {
        try {
            const jsonValue = await AsyncStorage.getItem('@carPosition');
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            // error reading value
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Header />
                <MapView
                    region={this.state.region}
                    loadingEnabled={true}
                    showsUserLocation={true}
                    onRegionChange={this.onRegionChange}
                    style={styles.map}
                    onPress={(e) => this.addMarker(e)}
                //showsMyLocationButton={true}
                //showsCompass={true}
                //showsScale={true}
                //onUserLocationChange={(position) => console.log(position)}
                >
                    <Marker
                        coordinate={this.state.marker}
                        title={this.state.title}
                        description={this.state.description}
                    />
                </MapView>
                <TouchableOpacity
                    style={styles.currentPosition}
                    onPress={() => this.getUserPosition()}>
                    <Icon name="crosshairs" size={30} color="#0c5496" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.carPosition}
                    onPress={() => this.getCarPosition()}>
                    <Icon name="car" size={30} color="#0c5496" />
                </TouchableOpacity>
                {/* <Parks selectPark={(newRegion) => this.selectPark(newRegion)} /> */}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: "center",
        // justifyContent: "center"
    },
    map: {
        flex: 3,
    },
    currentPosition: {
        zIndex: 1,
        //backgroundColor: "red",
        position: 'absolute',
        right: 5,
        //left: 0,
        bottom: 180,
    },
    carPosition: {
        zIndex: 1,
        //backgroundColor: "yellow",
        position: 'absolute',
        //right: 0,
        left: 10,
        bottom: 180,
    },
});
