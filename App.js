import React, { Component } from 'react'
import { Text, View, SafeAreaView, Platform } from 'react-native'
import Map from './src/Map'

export default class App extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Map />
      </View>
    )
  }
}
