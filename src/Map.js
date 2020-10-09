import React, { Component } from 'react';
import { StyleSheet, View, Alert, Dimensions, Image, ScrollView, Text, Platform, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-community/async-storage';
import Geocoder from 'react-native-geocoding';

import CarPositionModal from "./Modals/CarPositionModal"
import WarningModal from "./Modals/WarningModal"
import FooterButton from './Components/FooterButton';

import MapViewDirections from 'react-native-maps-directions';
import { API_KEY } from "@env"
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

export default class Map extends Component {
    constructor(props) {
        super(props);
        this._map = React.createRef()
        this.state = {
            carPositionModalVisible: false,
            showDirection: false,
            carRegion: {},
            userPosition: {},
            isCarPosition: false,
            directionMode: "WALKING",
            region: {
                latitude: 37.893071,
                longitude: 27.264429,
                latitudeDelta: 0.0052,
                longitudeDelta: 0.0052,
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
        this.setState({ region });
    };

    async addMarker(e) {
        await this.setState({
            carRegion: {
                ...this.state.region,
                latitude: e.nativeEvent.coordinate.latitude,
                longitude: e.nativeEvent.coordinate.longitude,
            },
            carMarker: e.nativeEvent.coordinate,
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
            Alert.alert('Please set your car position again.');
        }
    }

    async animateToRegion(coords) {
        await this._map.current.animateToRegion(
            coords,
            1000
        );
    }

    getUserPosition() {
        Geolocation.getCurrentPosition(async (position) => {
            setTimeout(() => {
                this.setState({ userPosition: position.coords })
                this.animateToRegion({
                    ...this.state.region,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                })
            }, 1000);
        },
            (error) => console.log('error', error),
            {
                enableHighAccuracy: false,
                timeout: 2000,
                maximumAge: 1000,
            });
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
            console.log(e)
        }
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
        }
        this.setState({
            isCarPosition: false,
            carPositionModalVisible: false
        })
    }

    async getDirections() {

        Geolocation.getCurrentPosition(async (position) => {
            const jsonData = await AsyncStorage.getItem("@carPosition")
            await this.setState({
                userPosition: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                },
                carMarker: {
                    latitude: JSON.parse(jsonData).latitude,
                    longitude: JSON.parse(jsonData).longitude,
                },
                isCarPosition: true
            })
            if (this.state.userPosition !== {} && this.state.isCarPosition == true) {
                this.setState({ showDirection: true })
            } else if (!this.state.isCarPosition) {
                this.setState({ warningModalVisible: true })
            }

        },
            (error) => console.log('error', error),
            {
                enableHighAccuracy: false,
                timeout: 2000,
                maximumAge: 1000,
            });
    }

    render() {
        return (
            <View style={styles.container}>
                {
                    this.state.showDirection ?
                        <View style={styles.barContainer}>
                            <TouchableOpacity
                                style={[styles.barButton, this.state.directionMode === "DRIVING" ? { backgroundColor: "#00BFFF" } : null]}
                                onPress={() => {
                                    this.setState({ directionMode: "DRIVING" })
                                }}>
                                <Icon name="car-sport-outline" style={styles.iconStyle} />
                                <Text>Driving</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.barButton, this.state.directionMode === "WALKING" ? { backgroundColor: "#00BFFF" } : null]}
                                onPress={() => this.setState({ directionMode: "WALKING" })}>
                                <Icon name="walk-outline" style={styles.iconStyle} />
                                <Text>Walking</Text>
                            </TouchableOpacity>
                        </View>
                        : null}

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
                        title='Car Location'
                        description='Car is here'
                        draggable
                        onDragEnd={(e) => this.addMarker(e)}
                    >
                        <Image
                            source={require('../assets/car_marker.png')}
                            style={{ width: 40, height: 40 }}
                            resizeMode="contain"
                        />
                    </Marker>
                        : null}
                    {
                        this.state.showDirection ? <MapViewDirections
                            origin={this.state.userPosition}
                            destination={this.state.carMarker}
                            apikey={API_KEY}
                            mode={this.state.directionMode}
                            strokeWidth={3}
                            strokeColor="hotpink"
                            onReady={result => {
                                console.log(`Distance: ${result.distance} km`)
                                console.log(`Duration: ${result.duration} min.`)
                                this._map.current.fitToCoordinates(result.coordinates, {
                                    edgePadding: {
                                        right: (width / 10),
                                        bottom: (height / 10),
                                        left: (width / 10),
                                        top: Platform.OS === "ios" ? (height / 10) : (height / 10 + 40),
                                    }
                                });
                            }}
                        />
                            : null
                    }
                </MapView>
                <View style={styles.footer}>
                    <FooterButton
                        iconName="car"
                        onPress={() => this.getCarPosition()}
                        text="My Car"
                    />
                    <FooterButton
                        iconName="navigate-circle-outline"
                        onPress={() => this.getDirections()}
                        text="Route"
                    />
                    <FooterButton
                        iconName="locate-outline"
                        onPress={() => { this.getUserPosition() }}
                        text="My Position"
                    />
                </View>
                <CarPositionModal
                    isVisible={this.state.carPositionModalVisible}
                    closeModal={() => this.setState({ carPositionModalVisible: false })}
                    setPosition={() => this.setStore()}
                    resetMarker={() => this.resetMarker()}
                />
                <WarningModal
                    isVisible={this.state.warningModalVisible}
                    closeModal={() => this.setState({ warningModalVisible: false })}
                    warningText="No car position, please first save your car position by long press on map.."
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        height: 80,
        backgroundColor: "#0f3057",
    },
    map: {
        flex: 3,
    },
    currentPosition: {
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 5,
    },
    carPosition: {
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 5
    },
    barContainer: {
        flexDirection: "row",
        position: 'absolute',
        top: Platform.OS === 'ios' ? 10 : 10,
        paddingHorizontal: 5,
        zIndex: 3
    },
    barButton: {
        flexDirection: "row",
        backgroundColor: '#fff',
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: 20,
        padding: 8,
        paddingHorizontal: 20,
        marginHorizontal: 10,
        height: 35,
        shadowColor: '#ccc',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 10,
    },
    iconStyle: {
        fontSize: 20,
        marginRight: 4
    }
});
