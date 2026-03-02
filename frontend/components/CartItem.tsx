import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface CartItemData {
    item_id: number;
    product_id: number;
    name: string;
    price: number;
    quantity: number;
    total_price: number;
}

interface CartItemProps {
    item: CartItemData;
    onUpdateQuantity: (product_id: number, quantity: number) => void;
}

const CartItem = ({ item, onUpdateQuantity }: CartItemProps) => {
    return (
        <View style={styles.card}>
            {/* 
                Hints:
                1. Define and use styles (card, itemInfo, productName, etc.)
                2. Display product name and price
                3. Create a quantity control section with '-' and '+' buttons
                4. Use the onUpdateQuantity prop to handle quantity changes
                   - Decrease: Math.max(0, item.quantity - 1)
                   - Increase: item.quantity + 1
                5. Display the total for this item (price * quantity)
                   - Use toFixed(2) for formatting
            */}
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.price}>${parseFloat(item.price).toFixed(2)}</Text>
                <View style={styles.quantityControl}>
                    <TouchableOpacity onPress={() => onUpdateQuantity(item.product_id, Math.max(0, item.quantity - 1))} style={styles.quantityButton}>
                        <Text>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <TouchableOpacity onPress={() => onUpdateQuantity(item.product_id, item.quantity + 1)} style={styles.quantityButton}>
                        <Text>+</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.total}>Total: ${parseFloat(item.total_price).toFixed(2)}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    itemInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    price: {
        fontSize: 14,
        color: '#888',
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityButton: {
        backgroundColor: '#eee',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 4,
    },
    quantityText: {
        marginHorizontal: 10,
        fontSize: 16,
    },
    total: {
        marginTop: 10,
        fontSize: 14,
        fontWeight: 'bold',
    },
});


export default CartItem;
