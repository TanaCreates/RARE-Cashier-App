import { createStackNavigator } from '@react-navigation/stack';
import Login from './Login'; // Adjust path as needed
import Profile from './Profile'; // Adjust path as needed

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
