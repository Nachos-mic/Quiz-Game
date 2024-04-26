/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React , {useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WelcomeScreen from './screens/WelcomeScreen';
import ScoreScreen from './screens/ScoreScreen'

import HomeScreen from './screens/HomeScreen';
import TestScreen from './screens/TestScreen';
import ResultScreen from './screens/ResultScreen';
import { RootStackParamList } from './data/types';

const Stack = createNativeStackNavigator<RootStackParamList>();


function App(): JSX.Element {

  

  useEffect(() => {
    SplashScreen.hide();
  },[]);


  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkWelcomeScreen = async () => {
      try {
        const value = await AsyncStorage.getItem('hasSeenWelcome');
        
        if (value === 'true') {
          setHasSeenWelcome(true);
        }
      } catch (error) {
        console.log(error);
      }
    };
  
    checkWelcomeScreen();
  }, []);

  useEffect(() => {
    const checkWelcomeScreen = async () => {
      try {
        let value = await AsyncStorage.getItem('hasSeenWelcome');
  
        if (value === null) {
          // If value is not found in AsyncStorage, set default to false
          value = 'false';
          await AsyncStorage.setItem('hasSeenWelcome', value);
        }
  
        setHasSeenWelcome(value === 'true'); // Set state based on the retrieved value
      } catch (error) {
        console.log(error);
      }
    };
  
    checkWelcomeScreen();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={hasSeenWelcome ? 'Home' : 'Welcome'} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen}></Stack.Screen>
        <Stack.Screen name = "Home" component = {HomeScreen}></Stack.Screen>
        <Stack.Screen name = "Test" component = {TestScreen}></Stack.Screen>
        <Stack.Screen name = "Results" component = {ResultScreen}></Stack.Screen>
        <Stack.Screen name = "Score" component = {ScoreScreen}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>    
  );
}


export default App;
