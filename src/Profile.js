import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Profile = () => {  
  const navigation = useNavigation();  // useNavigation is correctly placed here

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to your Profile!</Text>
      <Button
        title="Bookings"
        onPress={() => navigation.navigate('BookingNumbers')}  // Correct usage of navigation
      />
      <Button
        title="Orders"
        onPress={() => navigation.navigate('OrderNumbers')}  // Correct button title
      />
      <Button
        title="Profile"
        onPress={() => navigation.navigate('Profile')}
      />
      <Button
        title="Logout"
        onPress={() => navigation.navigate('Logout')}
      />
    </View>
  );
};

export default Profile;
