import { StyleSheet, Text, View, TouchableOpacity, useColorScheme } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '../constans/Colors'
import ThemeView from '../components/ThemeView'

const PAYMENT_LABELS = { cod: 'Cash on Delivery', upi: 'UPI', card: 'Card' }

const formatDate = (isoString) => {
    const d = new Date(isoString)
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) +
        ' · ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}

const OrderConfirmation = () => {
    const { orderId, total, payment, date, items } = useLocalSearchParams()
    const router = useRouter()
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light

    const orderItems = items ? JSON.parse(items) : []

    return (
        <ThemeView style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={[styles.iconCircle, { backgroundColor: Colors.teal }]}>
                    <Ionicons name="checkmark" size={40} color="#fff" />
                </View>

                <Text style={[styles.title, { color: theme.title }]}>Order Placed!</Text>
                <Text style={[styles.subtitle, { color: theme.subtitle }]}>
                    Your order has been placed successfully and will be delivered soon.
                </Text>

                <View style={[styles.detailsBox, { backgroundColor: theme.uiBackground }]}>
                    <View style={styles.detailRow}>
                        <Text style={[styles.detailLabel, { color: theme.subtitle }]}>Order ID</Text>
                        <Text style={[styles.detailValue, { color: theme.text }]}>{orderId}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={[styles.detailLabel, { color: theme.subtitle }]}>Order Date</Text>
                        <Text style={[styles.detailValue, { color: theme.text }]}>{formatDate(date)}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={[styles.detailLabel, { color: theme.subtitle }]}>Payment Method</Text>
                        <Text style={[styles.detailValue, { color: theme.text }]}>{PAYMENT_LABELS[payment] ?? payment}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={[styles.detailLabel, { color: theme.subtitle }]}>Amount Paid</Text>
                        <Text style={[styles.detailValue, { color: theme.text, fontWeight: '800' }]}>₹{total}</Text>
                    </View>
                </View>

                <View style={[styles.itemsBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <Text style={[styles.itemsTitle, { color: theme.title }]}>Items Ordered</Text>
                    {orderItems.map((item) => (
                        <View key={item.id} style={styles.itemRow}>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.itemName, { color: theme.text }]}>{item.name}</Text>
                                <Text style={[styles.itemUnit, { color: theme.subtitle }]}>{item.unit} · Qty {item.qty}</Text>
                            </View>
                            <Text style={[styles.itemPrice, { color: theme.text }]}>₹{item.price * item.qty}</Text>
                        </View>
                    ))}
                </View>

                <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: Colors.primary }]} onPress={() => router.replace('/')}>
                    <Text style={styles.primaryBtnText}>Continue Shopping</Text>
                </TouchableOpacity>
            </View>
        </ThemeView>
    )
}
export default OrderConfirmation

const styles = StyleSheet.create({
    container: { alignItems: 'center', padding: 30, paddingTop: 40 },
    iconCircle: { width: 84, height: 84, borderRadius: 42, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
    title: { fontSize: 22, fontWeight: '800', marginBottom: 8 },
    subtitle: { fontSize: 14, textAlign: 'center', marginBottom: 26, lineHeight: 20 },

    detailsBox: { width: '100%', borderRadius: 14, padding: 18, marginBottom: 20 },
    detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    detailLabel: { fontSize: 13 },
    detailValue: { fontSize: 13, fontWeight: '600' },

    itemsBox: { width: '100%', borderRadius: 14, padding: 18, borderWidth: 1, marginBottom: 30 },
    itemsTitle: { fontSize: 15, fontWeight: '800', marginBottom: 12 },
    itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    itemName: { fontSize: 14, fontWeight: '600' },
    itemUnit: { fontSize: 12, marginTop: 2 },
    itemPrice: { fontSize: 14, fontWeight: '700' },

    primaryBtn: { paddingVertical: 14, paddingHorizontal: 40, borderRadius: 12, width: '100%', alignItems: 'center' },
    primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
})