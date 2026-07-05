import React from 'react';
import { StatusBar, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Splash from '../screens/Splash';
import BottomNavigator from './BottomNavigator';
import ProductDetails from '../screens/ProductDetails';
const Stack = createNativeStackNavigator();
const AppNavigator = () => {
  const insets = useSafeAreaInsets();
  return (
    <NavigationContainer>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <View style={{ height: insets.top, backgroundColor: '#000000' }} />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Main" component={BottomNavigator} />
        <Stack.Screen name="ProductDetails" component={ProductDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default AppNavigator;
