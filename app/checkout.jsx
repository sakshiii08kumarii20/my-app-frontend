import { useState } from 'react'
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, useColorScheme, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '../constans/Colors'
import { useCart } from '../context/CartContext'
import ThemeView from '../components/ThemeView'

const PAYMENT_METHODS = [
    { key: 'cod', label: 'Cash on Delivery', icon: 'cash-outline' },
    { key: 'upi', label: 'UPI', icon: 'phone-portrait-outline' },
    { key: 'card', label: 'Credit / Debit Card', icon: 'card-outline' },
]

const DELIVERY_FEE = 20

const Checkout = () => {
    const router = useRouter()
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light
    const { items, cartTotal, clearCart } = useCart()

    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [pincode, setPincode] = useState('')
    const [payment, setPayment] = useState('cod')

    const total = cartTotal + DELIVERY_FEE

    const handlePlaceOrder = () => {
    if (!name || !phone || !address || !pincode) {
        Alert.alert(
            'Missing details',
            'Please fill in your name, phone, address and pincode.'
        )
        return
    }

    if (items.length === 0) {
        Alert.alert(
            'Cart is empty',
            'Add items to your cart before checking out.'
        )
        return
    }

    const orderItems = items.map(({ product, qty }) => ({
        id: product.id,
        name: product.name,
        unit: product.unit,
        price: product.price,
        qty,
    }))

    router.push({
        pathname: '/payment',
        params: {
            name,
            phone,
            address,
            pincode,
            payment,
            total: String(total),
            items: JSON.stringify(orderItems),
        },
    })
}

    return (
        <ThemeView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>

                {/* Delivery Address */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.title }]}>Delivery Address</Text>

                    <TextInput
                        placeholder="Full Name"
                        placeholderTextColor={theme.subtitle}
                        value={name}
                        onChangeText={setName}
                        style={[styles.input, { backgroundColor: theme.uiBackground, borderColor: theme.border, color: theme.text }]}
                    />
                    <TextInput
                        placeholder="Phone Number"
                        placeholderTextColor={theme.subtitle}
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                        style={[styles.input, { backgroundColor: theme.uiBackground, borderColor: theme.border, color: theme.text }]}
                    />
                    <TextInput
                        placeholder="Address (House no, Street, Area)"
                        placeholderTextColor={theme.subtitle}
                        value={address}
                        onChangeText={setAddress}
                        multiline
                        style={[styles.input, styles.textArea, { backgroundColor: theme.uiBackground, borderColor: theme.border, color: theme.text }]}
                    />
                    <TextInput
                        placeholder="Pincode"
                        placeholderTextColor={theme.subtitle}
                        value={pincode}
                        onChangeText={setPincode}
                        keyboardType="number-pad"
                        maxLength={6}
                        style={[styles.input, { backgroundColor: theme.uiBackground, borderColor: theme.border, color: theme.text }]}
                    />
                </View>

                {/* Order Summary */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.title }]}>Order Summary</Text>
                    {items.map(({ product, qty }) => (
                        <View key={product.id} style={styles.summaryRow}>
                            <Text style={[styles.summaryItemName, { color: theme.text }]} numberOfLines={1}>
                                {product.name} ({product.unit}) × {qty}
                            </Text>
                            <Text style={[styles.summaryItemPrice, { color: theme.text }]}>₹{product.price * qty}</Text>
                        </View>
                    ))}
                    <View style={[styles.divider, { backgroundColor: theme.border }]} />
                    <View style={styles.summaryRow}>
                        <Text style={[styles.summaryLabel, { color: theme.subtitle }]}>Subtotal</Text>
                        <Text style={[styles.summaryValue, { color: theme.text }]}>₹{cartTotal}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={[styles.summaryLabel, { color: theme.subtitle }]}>Delivery Fee</Text>
                        <Text style={[styles.summaryValue, { color: theme.text }]}>₹{DELIVERY_FEE}</Text>
                    </View>
                    <View style={[styles.divider, { backgroundColor: theme.border }]} />
                    <View style={styles.summaryRow}>
                        <Text style={[styles.totalLabel, { color: theme.title }]}>Total</Text>
                        <Text style={[styles.totalValue, { color: theme.title }]}>₹{total}</Text>
                    </View>
                </View>

                {/* Payment Method */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.title }]}>Payment Method</Text>
                    {PAYMENT_METHODS.map((m) => {
                        const active = m.key === payment
                        return (
                            <TouchableOpacity
                                key={m.key}
                                onPress={() => setPayment(m.key)}
                                style={[
                                    styles.paymentOption,
                                    { borderColor: active ? Colors.primary : theme.border, backgroundColor: active ? theme.uiBackground : theme.card },
                                ]}
                            >
                                <Ionicons name={m.icon} size={20} color={active ? Colors.primary : theme.subtitle} />
                                <Text style={{ flex: 1, marginLeft: 10, color: theme.text, fontSize: 14, fontWeight: '600' }}>{m.label}</Text>
                                <Ionicons
                                    name={active ? 'radio-button-on' : 'radio-button-off'}
                                    size={20}
                                    color={active ? Colors.primary : theme.subtitle}
                                />
                            </TouchableOpacity>
                        )
                    })}
                </View>
            </ScrollView>

            <View style={[styles.footer, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
                <View>
                    <Text style={[styles.footerLabel, { color: theme.subtitle }]}>Total</Text>
                    <Text style={[styles.footerTotal, { color: theme.title }]}>₹{total}</Text>
                </View>
                <TouchableOpacity style={[styles.placeOrderBtn, { backgroundColor: Colors.primary }]} onPress={handlePlaceOrder}>
                    <Text style={styles.placeOrderText}>Place Order</Text>
                </TouchableOpacity>
            </View>
        </ThemeView>
    )
}
export default Checkout

const styles = StyleSheet.create({
    section: { paddingHorizontal: 18, paddingTop: 20 },
    sectionTitle: { fontSize: 16, fontWeight: '800', marginBottom: 12 },

    input: {
        borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12,
        fontSize: 14, marginBottom: 12,
    },
    textArea: { height: 70, textAlignVertical: 'top' },

    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    summaryItemName: { flex: 1, fontSize: 13, marginRight: 8 },
    summaryItemPrice: { fontSize: 13, fontWeight: '600' },
    summaryLabel: { fontSize: 13 },
    summaryValue: { fontSize: 13, fontWeight: '600' },
    totalLabel: { fontSize: 16, fontWeight: '800' },
    totalValue: { fontSize: 16, fontWeight: '800' },
    divider: { height: 1, marginVertical: 8 },

    paymentOption: {
        flexDirection: 'row', alignItems: 'center',
        borderWidth: 1, borderRadius: 12, padding: 14, marginBottom: 10,
    },

    footer: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        padding: 16, borderTopWidth: 1,
    },
    footerLabel: { fontSize: 12 },
    footerTotal: { fontSize: 20, fontWeight: '800' },
    placeOrderBtn: { paddingVertical: 14, paddingHorizontal: 28, borderRadius: 12 },
    placeOrderText: { color: '#fff', fontWeight: '700', fontSize: 15 },
})