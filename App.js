import React, { Component } from 'react'
import { Text, View, SafeAreaView, Platform } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import HomeScreen from "./src/HomeScreen"
import Map from './src/Map'

const Stack = createStackNavigator();

export default App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Find My Car" }} />
        <Stack.Screen name="Map" component={Map} options={{ title: 'Car Location' }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}


// import 'react-native-gesture-handler';
// import * as React from 'react';
// 

// import Map from './src/Map'


// export default function App() {
//   return (
//     <NavigationContainer>{/* Rest of your app code */}</NavigationContainer>
//   );
// }