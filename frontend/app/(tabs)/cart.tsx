import React, { useCallback } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ListRenderItemInfo, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import CartItem from '../../components/CartItem';
import { apiCall } from '../../utils/api';

interface CartItemData {
    item_id: number;
    product_id: number;
    name: string;
    price: number;
    quantity: number;
    total_price: number;
}

export default function Cart() {
    const [cartItems, setCartItems] = React.useState<CartItemData[]>([]);
    const [totalPrice, setTotalPrice] = React.useState<number>(0);
    const [loading, setLoading] = React.useState<boolean>(false);
    const router = useRouter();

    useFocusEffect(
        useCallback(() => {
            fetchCart();
        }, [])
    );

    /*
    fetchCart function: Call the /display-cart API to get current cart data. 
While the initial cart data is loading, the UI should show the AcitivityIndicator component.
handleUpdateQuantity function: Call /update-cart (when quantity is changed from the cart tab) or /remove-from-cart (when new quantity is 0)
Use a FlatList to render CartItem components in a list. Show the total price and a "Checkout" button in the footer. 
The Checkout button should navigate to checkout page, i.e. /checkout 

    */
    const fetchCart = async () => {
       setLoading(true);
       try {
           const response = await apiCall('/display-cart', { method: 'GET' });
           console.log('Cart response:', response);
           const cartData = response?.cart || [];
           setCartItems(cartData);
           setTotalPrice(parseFloat(response?.totalPrice) || 0);
       } catch (error) {
           console.error('Error fetching cart:', error);
           setCartItems([]);
           setTotalPrice(0);
       } finally {
           setLoading(false);
       }
    };

    // Function to handle quantity updates
    const handleUpdateQuantity = async (productId: string | number, newQuantity: number) => {
        try {
            if (newQuantity === 0) {
                await apiCall('/remove-from-cart', {
                    method: 'POST',
                    body: { product_id: productId },
                    silent: true
                });
            } else {
                await apiCall('/update-cart', {
                    method: 'POST',
                    body: { product_id: productId, quantity: newQuantity }
                });
            }
            // Refresh cart after update
            await fetchCart();
        } catch (error) {
            console.error('Error updating cart:', error);
        }
    };

    const renderItem = ({ item }: ListRenderItemInfo<any>) => (
        <CartItem item={item} onUpdateQuantity={handleUpdateQuantity} />
    );

    //
    if (loading) {
        return (
            <SafeAreaView edges={['top', 'left', 'right']}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    {/* Return ActivityIndicator component here */
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text>Loading...</Text>
                    </View>
                    }
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    }
    return (
        <SafeAreaView edges={['top', 'left', 'right']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <Text style={styles.header}>My Cart</Text>
                {cartItems.length === 0 ? (
                    <View style={styles.emptyCart}>
                        <Text>Your cart is empty</Text>
                    </View>
                ) : (
                    <FlatList
                        data={cartItems}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.item_id.toString()}
                        ListFooterComponent={
                            <View style={styles.totalContainer}>
                                <Text style={styles.totalText}>Total: ${totalPrice.toFixed(2)}</Text>
                                <TouchableOpacity style={styles.checkoutButton} onPress={() => router.push('/checkout')}>
                                    <Text style={styles.checkoutButtonText}>Checkout</Text>
                                </TouchableOpacity>
                            </View>
                        }
                    />
                )}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    emptyCart: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    totalContainer: {
        marginTop: 20,
        padding: 15,
        borderTopWidth: 1,
        borderColor: '#ccc',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    checkoutButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    checkoutButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});
