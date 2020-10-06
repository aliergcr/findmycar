import React, { Component } from 'react';
import { Text, Platform, StyleSheet, View, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { requestMultiple, PERMISSIONS } from 'react-native-permissions';
//import Geolocation from '@react-native-community/geolocation';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-community/async-storage';
import Geocoder from 'react-native-geocoding';

import CarPositionModal from "./Modals/CarPositionModal"
import WarningModal from "./Modals/WarningModal"
import FooterButton from './Components/FooterButton';

export default class Map extends Component {
    constructor(props) {
        super(props);
        this._map = React.createRef()
        this.state = {
            carPositionModalVisible: false,
            carRegion: {},
            userPosition: {},
            isCarPosition: false,
            region: {
                latitude: 37.893071,
                longitude: 27.264429,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            },
            carMarker: {},
        };
    }

    componentDidMount() {
        if (this.props.route.params.type === "findCar") {
            this.getCarPosition()
        } else if (this.props.route.params.type === "parkCar") {
            this.getUserPosition();
        }
    }

    onRegionChangeComplete = (region) => {
        console.log('region change finish');
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
            title: 'Car Location',
            description: 'Car is here',
            carPositionModalVisible: true,
            isCarPosition: true,
            warningModalVisible: false
        });
        this.animateToRegion(this.state.carRegion)
    }

    async setStore() {
        try {
            const jsonValue = JSON.stringify(this.state.carRegion);
            await AsyncStorage.setItem('@carPosition', jsonValue);
        } catch (e) {
            Alert.alert("Car location error, please try to set car location again!!! ");
        }
        this.getAdress()
        this.setState({
            carPositionModalVisible: false,
        })
    }

    async setAdressToStore(adress) {
        try {
            await AsyncStorage.setItem('@carAdress', adress);
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

    async animateToRegion(coords) {
        console.log("aniamte to region")
        await this._map.current.animateToRegion(
            coords,
            1000
        );
    }

    getUserPosition() {
        console.log("get user position")
        Geolocation.getCurrentPosition(async (position) => {
            setTimeout(() => {
                this.setState({ userPosition: position.coords })
                this.animateToRegion({
                    ...this.state.region,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                })
            }, 1000);

            //console.log("position=", position)

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
                },
                isCarPosition: true
            }) : null;
        } catch (e) {
            //error reading value
        }
        //console.log("jason value", jsonValue)
        if (jsonValue != null) {
            setTimeout(() => {
                this.animateToRegion(JSON.parse(jsonValue))
            }, 1000);

        } else {
            this.setState({ warningModalVisible: true })
        }
        this.getAdress()
    }

    async getAdress() {
        Geocoder.from(this.state.carMarker)
            .then(json => {
                //console.log(json)
                var addressComponent = json.results[0].formatted_address;
                this.setAdressToStore(addressComponent)
            })
            .catch(error => console.warn(error))
    }

    async resetMarker() {
        try {
            await AsyncStorage.removeItem('@carPosition')
            await AsyncStorage.removeItem('@carAdress')
        } catch (e) {
            // remove error
        }
        this.setState({
            isCarPosition: false,
            carPositionModalVisible: false
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <MapView
                    ref={this._map}
                    provider={PROVIDER_GOOGLE}
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
                    {this.state.isCarPosition ? <Marker
                        coordinate={this.state.carMarker}
                        title={this.state.title}
                        description={this.state.description}
                        //icon={require('../assets/car_marker.png')}
                        draggable
                        onDragEnd={(e) => this.addMarker(e)}
                    >
                        {/* <Image
                            source={require('../assets/car_marker.png')}
                            style={{ width: 40, height: 40, marginBottom: 30 }}
                            resizeMode="contain"
                        /> */}
                    </Marker>
                        : null}
                </MapView>
                <View style={styles.footer}>
                    <FooterButton iconName="car" onPress={() => this.getCarPosition()} text="Aracım" />
                    <FooterButton iconName="navigate-circle-outline" onPress={() => this.getUserPosition()} text="Rota Çiz" />
                    <FooterButton iconName="locate-outline" onPress={() => this.getUserPosition()} text="Konumum" />

                </View>
                {/* <Parks selectPark={(newRegion) => this.selectPark(newRegion)} /> */}
                <CarPositionModal
                    isVisible={this.state.carPositionModalVisible}
                    closeModal={() => this.setState({ carPositionModalVisible: false })}
                    setPosition={() => this.setStore()}
                    resetMarker={() => this.resetMarker()}
                />
                <WarningModal
                    isVisible={this.state.warningModalVisible}
                    closeModal={() => this.setState({ warningModalVisible: false })}
                    warningText="Kaydedilmiş araç konumu yoktur. Lütfen önce aracınızın konumunu kaydetmek için istediğiniz konumda haritaya basılı tutun"

                />
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
    footer: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        height: 80,
        backgroundColor: "#fff",
    },
    map: {
        flex: 3,
    },
    currentPosition: {
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 5,
        // borderColor: "#000",
        // borderWidth: 1
    },
    carPosition: {
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 5
    },
});
