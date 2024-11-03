import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { ref, onValue, update } from 'firebase/database';
import { db } from './firebase';
import { useNavigation } from '@react-navigation/native';


const CashierBooking = () => {
    const navigation = useNavigation();
    const [bookings, setBookings] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    useEffect(() => {
        // Fetch bookings from Firebase
        const bookingsRef = ref(db, 'bookings/');
        onValue(bookingsRef, (snapshot) => {
            const bookingData = [];
            snapshot.forEach((childSnapshot) => {
                const booking = childSnapshot.val();
                booking.id = childSnapshot.key; // Add Firebase key to booking data
                bookingData.push(booking);
            });
            setBookings(bookingData);
        });
    }, []);

    const confirmArrival = (bookingId) => {
        // Update the booking to confirm arrival
        update(ref(db, `bookings/${bookingId}`), {
            arrived: true // Assuming you add an 'arrived' field to track this
        })
            .then(() => {
                Alert.alert("Success", "Customer arrival confirmed!");
            })
            .catch((error) => {
                Alert.alert("Error", "Failed to confirm arrival: " + error.message);
            });
    };

    const renderBookingItem = ({ item }) => {
        const bedNumbers = item.bedNumbers && item.bedNumbers.length > 0
            ? item.bedNumbers.join(', ')
            : "No beds assigned"; // Default message if no bed numbers exist

        const prices = item.prices && item.prices.length > 0
            ? item.prices.join(', ')
            : "No prices available";
        return (
            <View style={styles.bookingItem}>
                <Text style={styles.bookingText}>Booking Number: {item.bookingNumber}</Text>
                <Text style={styles.bookingText}>Booking Number: {item.bookingNumber}</Text>
                <Text style={styles.bookingText}>Customer Email: {item.email}</Text>
                <Text style={styles.bookingText}>Check-In Date: {item.selectedDate}</Text>
                <Text style={styles.bookingText}>Bed Numbers: {bedNumbers}</Text> 
                <Text style={styles.bookingText}>Prices: {prices}</Text> 
                <Text style={styles.bookingText}>Status: {item.arrived ? "Checked In" : "Not Checked In"}</Text>
                {!item.arrived && (
                    <TouchableOpacity style={styles.confirmButton} onPress={() => confirmArrival(item.id)}>
                        <Text style={styles.confirmButtonText}>Confirm Arrival</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };
    const filteredBookings = bookings.filter((booking) => {
        const bookingNumberString = booking.bookingNumber ? String(booking.bookingNumber) : ''; // Ensure it's a string or fallback to an empty string
        const matchesSearch = bookingNumberString.includes(searchQuery);
        const matchesCategory = selectedCategory === 'All' || (selectedCategory === 'Checked In' ? booking.arrived : !booking.arrived);
        return matchesSearch && matchesCategory; // Filter by both search query and category
    });

    return (
        
        <View style={styles.container}>
            <TextInput
                style={styles.searchBar}
                placeholder="Search Booking Number"
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            <Text style={styles.header}>Booking Numbers</Text>
            <View style={styles.buttonContainer}>
                <RoundedButton
                    title="All"
                    onPress={() => setSelectedCategory('All')}
                    isSelected={selectedCategory === 'All'}
                />
                <RoundedButton
                    title="Checked In"
                    onPress={() => setSelectedCategory('Checked In')}
                    isSelected={selectedCategory === 'Checked In'}
                />
                <RoundedButton
                    title="Awaiting Check-In"
                    onPress={() => setSelectedCategory('Awaiting Check-In')}
                    isSelected={selectedCategory === 'Awaiting Check-In'}
                />
            </View>

            <FlatList
                data={filteredBookings}
                renderItem={renderBookingItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 20 }} // Optional for padding at the bottom
            />
             <Button
        title="Bookings"
        onPress={() => navigation.navigate('BookingNumbers')}  // Use navigation hook here
      />
  <Button
        title="Orders"  // This button title was corrected
        onPress={() => navigation.navigate('OrderNumbers')}  // Use navigation hook here
      />
<Button
        title="Profile"  // This button title was corrected
        onPress={() => navigation.navigate('Profile')}  // Use navigation hook here
      />

        </View>
        
    );
};
const RoundedButton = ({ title, onPress, isSelected }) => (
    <TouchableOpacity
        style={[styles.roundedButton, isSelected ? styles.selectedButton : styles.unselectedButton]}
        onPress={onPress}
    >
        <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        paddingBottom: 20 ,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#223D3C',
    },
    buttonContainer: {
      
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    bookingItem: {
        backgroundColor: '#223D3C',
        width: '60%', // Each item takes up approximately 30% of the width
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 15,
        marginBottom: 10,
        marginHorizontal: 5, // Margin between items horizontally
        alignItems: 'center', // Center text in the item
    },
    bookingText: {
        color: '#fff',
        fontSize: 16,
    },
    roundedButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20, // Rounded corners
        elevation: 3, 
        
        },
    selectedButton: {
        backgroundColor: 'red', // Red background for the selected button
    },
    unselectedButton: {
        backgroundColor: 'grey', // Grey background for unselected buttons
    },
    searchBar: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 15,
        marginBottom: 15,
    },
    confirmButton: {
        backgroundColor: '#fff',  // White background for Confirm Arrival buttons
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: '#ccc',      // Optional: Add a border to make the button more visible
    },
    confirmButtonText: {
        color: '#000',  // Set the text color to black for contrast
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default CashierBooking;
