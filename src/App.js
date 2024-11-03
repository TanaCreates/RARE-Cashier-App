import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './Login';
import Profile from './Profile';
import BookingNumbers from './BookingNumbers';
import OrderNumbers from './OrderNumbers';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={Login} 
          options={{ title: 'Login' }} 
        />
        <Stack.Screen 
          name="Profile" 
          component={Profile} 
          options={{ title: 'Profile' }} 
        />
        <Stack.Screen 
          name="BookingNumbers" 
          component={BookingNumbers} 
          options={{ title: 'Booking Numbers' }} 
        />
        <Stack.Screen 
          name="OrderNumbers" 
          component={OrderNumbers} 
          options={{ title: 'Order Numbers' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
