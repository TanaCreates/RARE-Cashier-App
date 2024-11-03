import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { ref, get } from 'firebase/database';
import { db } from './firebase'; // Ensure correct Firebase configuration is imported
import { useNavigation } from '@react-navigation/native';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email and password are required');
      return;
    }

    try {
      const employeesRef = ref(db, 'Employees');
      const snapshot = await get(employeesRef);

      if (snapshot.exists()) {
        const employees = snapshot.val();
        const employeeKey = Object.keys(employees).find(
          (key) => employees[key].personalEmail === email
        );

        if (employeeKey) {
          const employeeData = employees[employeeKey];

          if (employeeData.password === password) {
            Alert.alert('Success', 'Login successful!');
            navigation.navigate('Profile'); // Use the screen name
          } else {
            Alert.alert('Error', 'Invalid password');
          }
        } else {
          Alert.alert('Error', 'Email not found');
        }
      } else {
        Alert.alert('Error', 'No employees found in the database');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      Alert.alert('Error', 'Failed to log in. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
});

export default Login;
