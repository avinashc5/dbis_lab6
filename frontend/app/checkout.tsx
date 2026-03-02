import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { apiCall } from '../utils/api';

export default function Checkout() {
    const [address, setAddress] = useState({
        street: '',
        city: '',
        state: '',
        pincode: '',
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const placeOrder = async () => {
        // 1. Validate that all address fields are filled
        if (!address.street || !address.city || !address.state || !address.pincode) {
            Alert.alert('Error', 'Please fill in all address fields');
            return;
        }
        // 2. Call API '/place-order' with address data
        setLoading(true);
        try {
            const response = await apiCall('/place-order', {
                method: 'POST',
                body: { address }
            });
            Alert.alert('Success', 'Order placed successfully!');
            router.push('/(tabs)');
        } catch (error) {
            Alert.alert('Error', 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };
    return (
        <SafeAreaView edges={['bottom', 'left', 'right']}>
            <Stack.Screen options={{ title: 'Checkout', headerShown: true, headerBackTitle: 'Back' }} />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView>
                    <Text style={styles.title}>Shipping Address</Text>

                    {/* 
                        1. Create TextInput for Street
                        2. Create TextInput for City
                        3. Create a Row with TextInputs for State and Pincode
                        4. Bind all inputs to the address state
                    */}
                    <View style={{ paddingHorizontal: 20 }}>
                        <TextInput
                            placeholder="Street"
                            value={address.street}
                            onChangeText={(text) => setAddress({...address, street: text})}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="City"
                            value={address.city}
                            onChangeText={(text) => setAddress({...address, city: text})}
                            style={styles.input}
                        />
                        <View style={styles.row}>
                            <TextInput
                                placeholder="State"
                                value={address.state}
                                onChangeText={(text) => setAddress({...address, state: text})}
                                style={[styles.input, styles.halfInput]}
                            />
                            <TextInput
                                placeholder="Pincode"
                                value={address.pincode}
                                onChangeText={(text) => setAddress({...address, pincode: text})}
                                style={[styles.input, styles.halfInput]}
                            />
                        </View>
                    </View>

                    {/* 
                        1. Create a TouchableOpacity
                        2. Call placeOrder on press
                        3. Disable button while loading
                        4. Show 'Placing Order...' text when loading
                    */}
                    <View>
                        <TouchableOpacity style={styles.placeOrderButton} onPress={placeOrder} disabled={loading}>
                            <Text style={styles.placeOrderButtonText}>{loading ? 'Placing Order...' : 'Place Order'}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginVertical: 5,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfInput: {
        width: '48%',
    },
    placeOrderButton: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
        marginHorizontal: 20,
    },
    placeOrderButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
