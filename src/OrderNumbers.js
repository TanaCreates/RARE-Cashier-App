import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, ScrollView, StyleSheet } from 'react-native';
import { getDatabase, ref, onValue, update } from 'firebase/database';
import { db } from './firebase'; // Ensure this is correctly set up
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const BookingSystem = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState([]);
  const navigation = useNavigation(); // Use the useNavigation hook

  useEffect(() => {
    const dbInstance = getDatabase();
    const ordersRef = ref(dbInstance, 'Orders');

    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      const fetchedOrders = data
        ? Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }))
        : [];
      setOrders(fetchedOrders);
    });

    return () => unsubscribe(); // Unsubscribe on unmount
  }, []);

  const handleCollectedClick = (orderId) => {
    const dbInstance = getDatabase();
    const orderRef = ref(dbInstance, `Orders/${orderId}`);

    update(orderRef, { Collected: true })
      .then(() => {
        console.log(`Order ${orderId} marked as collected.`);
      })
      .catch((error) => {
        console.error('Error updating collected status:', error);
      });
  };

  return (
    <View style={styles.mainPanel}>
      <View style={styles.searchBar}>
        <TextInput
          placeholder="Search here"
          style={styles.input}
          value={searchQuery}
          onChangeText={setSearchQuery} // Use onChangeText for TextInput
        />
      </View>

      <ScrollView style={styles.orderList}>
        {orders.map((order) => (
          <View key={order.id} style={styles.orderItem}>
            <Text>Order ID: {order.id}</Text>
            <Text>{order['Customer Name']}</Text>
            <Text>{order['Product Name']}</Text>
            <Text>{order.Description}</Text>
            <Text>{`R${order.Price}`}</Text>
            <Text>
              <Text style={styles.collectedLabel}>Collected:</Text> {order.Collected ? 'Yes' : 'No'}
            </Text>
            <Button
              title={order.Collected ? 'Already Collected' : 'Mark as Collected'}
              onPress={() => handleCollectedClick(order.id)}
              disabled={order.Collected}
            />
          </View>
        ))}
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navigationButtons}>
        <Button
          title="Bookings"
          onPress={() => navigation.navigate('BookingNumbers')} // Use navigation hook here
        />
        <Button
          title="Orders"  // This button title was corrected
          onPress={() => navigation.navigate('OrderNumbers')} // Use navigation hook here
        />
        <Button
          title="Profile"  // This button title was corrected
          onPress={() => navigation.navigate('Profile')} // Use navigation hook here
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f4f4f4',
  },
  mainPanel: {
    flex: 1,
    padding: 20,
  },
  searchBar: {
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    fontSize: 16,
  },
  orderList: {
    marginTop: 20,
  },
  orderItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 4,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  collectedLabel: {
    fontWeight: 'bold', // Simulate the <strong> tag
  },
  navigationButtons: {
    marginTop: 20, // Add some space above the buttons
  },
});

export default BookingSystem;
