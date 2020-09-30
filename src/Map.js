import React, { Component } from 'react';
import { Text, Platform, StyleSheet, View, TouchableOpacity, Alert, Image } from 'react-native';
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
        this._map = React.createRef()
        this.state = {
            carRegion: {},
            region: {
                latitude: 37.893071,
                longitude: 27.264429,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            },
            carMarker: {
                latitude: 37.865279,
                longitude: 27.263038,
            },
        };
    }
    async componentDidMount() {
        // request(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION).then((result) => { });
        console.log("Platform=", Platform.OS)
        this.getUserPosition();
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
                this.getUserPosition();
                console.log('permissions=', statuses);
            })
            .catch((err) => console.log('Permissions Error', err));
        //const data = await this.getCurrentPosition()
    }

    onRegionChangeComplete = (region) => {
        console.log('region', region);
        this.setState({ region });
    };

    async addMarker(e) {
        //console.log(e.nativeEvent.coordinate)
        await this.setState({
            carRegion: {
                ...this.state.region,
                latitude: e.nativeEvent.coordinate.latitude,
                longitude: e.nativeEvent.coordinate.longitude,
            },
            carMarker: e.nativeEvent.coordinate,
            title: 'Arabamın Konumu',
            description: 'Arabam Burada',
        });
        this._map.current.animateToRegion(
            this.state.carRegion,
            1000
        );
        this.setStore();
    }

    async setStore() {
        try {
            const jsonValue = JSON.stringify(this.state.carRegion);
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
            carMarker: newRegion,
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
        let jsonValue;
        try {
            jsonValue = await AsyncStorage.getItem('@carPosition');
            jsonValue != null ? this.setState({
                carMarker: {
                    latitude: JSON.parse(jsonValue).latitude,
                    longitude: JSON.parse(jsonValue).longitude,
                }
            }) : null;
        } catch (e) {
            //error reading value
        }
        this._map.current.animateToRegion(
            JSON.parse(jsonValue),
            1000
        );

    }


    render() {
        return (
            <View style={styles.container}>
                <Header />
                <MapView
                    ref={this._map}
                    region={this.state.region}
                    loadingEnabled={true}
                    showsUserLocation={true}
                    onRegionChangeComplete={this.onRegionChangeComplete}
                    style={styles.map}
                    onLongPress={(e) => this.addMarker(e)}
                //showsMyLocationButton={true}
                //showsCompass={true}
                //showsScale={true}
                //onUserLocationChange={(position) => console.log(position)}
                >
                    <Marker
                        coordinate={this.state.carMarker}
                        title={this.state.title}
                        description={this.state.description}
                    >
                        <Image
                            source={require('../assets/car_marker.png')}
                            style={{ width: 40, height: 40, marginBottom: 30 }}
                            resizeMode="contain"
                        />
                    </Marker>
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
        right: 10,
        //left: 0,
        bottom: 60,
    },
    carPosition: {
        zIndex: 1,
        //backgroundColor: "yellow",
        position: 'absolute',
        //right: 0,
        left: 10,
        bottom: 60,
    },
});
