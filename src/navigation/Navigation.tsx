import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import { navigationRef } from '../utils/NavigationUtils';
import HomeScreen from '../screens/HomeScreen';
import BusListScreen from '../screens/BusListScreen';
import SeatSelectionScreen from '../screens/SeatSelectionScreen';

const RootStack = createNativeStackNavigator();

const Navigation: React.FC = () => {
  return (
    <NavigationContainer ref={navigationRef}>
        <RootStack.Navigator initialRouteName='SplashScreen' screenOptions={{headerShown:false }}>
            <RootStack.Screen name="SplashScreen" component={SplashScreen} />
            <RootStack.Screen name="LoginScreen" component={LoginScreen} />
            <RootStack.Screen name="HomeScreen" component={HomeScreen} />
            <RootStack.Screen name="BusListScreen" component={BusListScreen} />
            <RootStack.Screen name="SeatSelectionScreen" component={SeatSelectionScreen} />
        </RootStack.Navigator>
    </NavigationContainer>
  )
}

export default Navigation