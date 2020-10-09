import React, { Component } from 'react'
import { LogBox } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import HomeScreen from "./src/HomeScreen"
import Map from './src/Map'

const Stack = createStackNavigator();

export default App = () => {
  LogBox.ignoreAllLogs(true)
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: "Find My Car",
            headerStyle: {
              backgroundColor: '#0f3057',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 24
            },

          }}
        />
        <Stack.Screen
          name="Map"
          component={Map}
          options={{
            title: 'Car Location',
            headerBackTitleVisible: false,
            headerStyle: {
              backgroundColor: '#0f3057',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },

          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
