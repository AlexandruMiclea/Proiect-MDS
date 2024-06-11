import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { CardField, useStripe, CardFieldInput } from '@stripe/stripe-react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

const Donation = () => {
    const { createPaymentMethod, confirmPayment } = useStripe();
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [donationAmount, setDonationAmount] = useState('5'); // Default donation amount
    const [editingAmount, setEditingAmount] = useState(false); // State to control editing of amount
    const colorScheme = useColorScheme();
    const mainColor = Colors[colorScheme ?? 'light'].tint;

    const handlePayment = async () => {
        if (!paymentMethod) {
            console.log('Incomplete card details');
            return;
        }

        // Your payment logic goes here
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.donationContainer}
                onPress={() => setEditingAmount(true)} // Enable editing of amount when pressed
            >
                <Text style={styles.donationText}>
                    {editingAmount ? '' : `${donationAmount} $`}
                </Text>
            </TouchableOpacity>
            {editingAmount && (
                <TextInput
                    style={{ ...styles.input, borderWidth: editingAmount ? 0 : 1 }} // Remove border when editing
                    keyboardType="numeric"
                    value={donationAmount}
                    onChangeText={setDonationAmount}
                    onBlur={() => setEditingAmount(false)} // Disable editing of amount when blurred
                    autoFocus // Automatically focus the input when editing starts
                />
            )}
            <CardField
                postalCodeEnabled={false}
                placeholders={{
                    number: '4242 4242 4242 4242',
                    expiration: 'MM/YY',
                    cvc: 'CVC',
                }}
                cardStyle={{
                    backgroundColor: '#FFFFFF',
                    textColor: '#000000',
                }}
                style={{
                    width: '100%',
                    height: 50,
                    marginVertical: 10,
                }}
                onCardChange={(cardDetails) => {
                    setPaymentMethod(cardDetails?.complete ? cardDetails : null);
                }}
            />
            <TouchableOpacity onPress={handlePayment} style={{ ...styles.button_container, backgroundColor: mainColor }}>
                <Text style={styles.text}>Enter</Text>
            </TouchableOpacity>
            {parseFloat(donationAmount) < 5 && (
                <Text style={styles.minDonationText}>Donația minimă este de 5$</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    donationContainer: {
        marginBottom: 20,
    },
    donationText: {
        fontSize: 36,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    input: {
        height: 50,
        fontSize: 36,
        fontWeight: 'bold',
        textAlign: 'center',
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
    },
    button_container: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    minDonationText: {
        color: 'red',
        fontSize: 14,
        marginTop: 5,
    },
});

export default Donation;
