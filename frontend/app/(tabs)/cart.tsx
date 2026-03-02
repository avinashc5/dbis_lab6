import React, { useCallback } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ListRenderItemInfo, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
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
                    {/* Return ActivityIndicator component here */}
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color="#007AFF" />
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    }
    return (
        <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <View style={styles.header}>
                    <Text style={styles.headerText}>My Cart</Text>
                </View>
                {cartItems.length === 0 ? (
                    <View style={styles.emptyCart}>
                        <Text style={styles.emptyCartText}>Your cart is empty</Text>
                    </View>
                ) : (
                    <View style={{ flex: 1 }}>
                        <FlatList
                            data={cartItems}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.item_id.toString()}
                            scrollEnabled={true}
                            contentContainerStyle={styles.listContent}
                        />
                        <View style={styles.totalContainer}>
                            <View style={styles.totalInfo}>
                                <Text style={styles.totalLabel}>Total Price</Text>
                                <Text style={styles.totalText}>₹{totalPrice.toFixed(2)}</Text>
                            </View>
                            <TouchableOpacity style={styles.checkoutButton} onPress={() => router.push('/checkout')}>
                                <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        backgroundColor: '#fff',
        paddingVertical: 18,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e8e8e8',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    headerText: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1a1a1a',
    },
    emptyCart: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    emptyCartText: {
        fontSize: 16,
        color: '#999',
    },
    listContent: {
        paddingHorizontal: 12,
        paddingVertical: 12,
    },
    totalContainer: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#e8e8e8',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 3,
    },
    totalInfo: {
        flex: 1,
    },
    totalLabel: {
        fontSize: 12,
        color: '#888',
        marginBottom: 4,
    },
    totalText: {
        fontSize: 24,
        fontWeight: '700',
        color: '#2c3e50',
    },
    checkoutButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 10,
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    checkoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
});
