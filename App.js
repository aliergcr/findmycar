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
      <Stack.Navigator initialRouteName="Map">
        <Stack.Screen name="Map" component={Map} options={{ title: 'Araç Konumu' }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
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