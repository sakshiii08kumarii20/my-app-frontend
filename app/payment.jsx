import { useState } from 'react'
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    useColorScheme,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

import { Colors } from '../constans/Colors'
import ThemeView from '../components/ThemeView'
import { useCart } from '../context/CartContext'

const Payment = () => {
    const router = useRouter()
    const params = useLocalSearchParams()
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light

    const { clearCart } = useCart()

    const [loading, setLoading] = useState(false)

    const total = Number(params.total || 0)

    const handleTestPayment = async () => {
        try {
            setLoading(true)

            // TEST PAYMENT
            // This does NOT charge a real card.
            const response = await fetch(
                'http://192.168.0.131:4000/api/payments/test',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        amount: total,
                        payment_method: params.payment || 'test',
                    }),
                }
            )

            const data = await response.json()

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || 'Test payment failed'
                )
            }

            const orderId = data.payment_id
                ? `ORD-${data.payment_id}`
                : `ORD${Date.now().toString().slice(-8)}`

            const orderDate = new Date().toISOString()

            clearCart()

            router.replace({
                pathname: '/order-confirmation',
                params: {
                    orderId,
                    total: String(total),
                    payment: params.payment || 'test',
                    date: orderDate,
                    items: params.items || '[]',
                },
            })
        } catch (error) {
            console.log('TEST PAYMENT ERROR:', error)

            Alert.alert(
                'Payment Failed',
                error.message || 'Unable to complete test payment.'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <ThemeView style={styles.container}>

            <View style={styles.header}>
                <Ionicons
                    name="card-outline"
                    size={42}
                    color={Colors.primary}
                />

                <Text
                    style={[
                        styles.title,
                        { color: theme.title },
                    ]}
                >
                    Test Payment
                </Text>

                <Text
                    style={[
                        styles.subtitle,
                        { color: theme.subtitle },
                    ]}
                >
                    Sandbox / Demo Payment
                </Text>
            </View>

            <View
                style={[
                    styles.card,
                    {
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                    },
                ]}
            >
                <Text
                    style={[
                        styles.label,
                        { color: theme.subtitle },
                    ]}
                >
                    Amount to Pay
                </Text>

                <Text
                    style={[
                        styles.amount,
                        { color: theme.title },
                    ]}
                >
                    ₹{total}
                </Text>

                <View
                    style={[
                        styles.divider,
                        { backgroundColor: theme.border },
                    ]}
                />

                <View style={styles.row}>
                    <Text
                        style={[
                            styles.rowLabel,
                            { color: theme.subtitle },
                        ]}
                    >
                        Payment Method
                    </Text>

                    <Text
                        style={[
                            styles.rowValue,
                            { color: theme.text },
                        ]}
                    >
                        Test Payment
                    </Text>
                </View>

                <View style={styles.row}>
                    <Text
                        style={[
                            styles.rowLabel,
                            { color: theme.subtitle },
                        ]}
                    >
                        Environment
                    </Text>

                    <Text
                        style={[
                            styles.rowValue,
                            { color: Colors.primary },
                        ]}
                    >
                        SANDBOX
                    </Text>
                </View>
            </View>

            <View
                style={[
                    styles.infoBox,
                    { backgroundColor: theme.uiBackground },
                ]}
            >
                <Ionicons
                    name="information-circle-outline"
                    size={22}
                    color={Colors.primary}
                />

                <Text
                    style={[
                        styles.infoText,
                        { color: theme.text },
                    ]}
                >
                    This is a test payment. No real money will
                    be charged.
                </Text>
            </View>

            <View style={styles.bottom}>
                <TouchableOpacity
                    disabled={loading}
                    onPress={handleTestPayment}
                    style={[
                        styles.payButton,
                        {
                            backgroundColor: loading
                                ? theme.subtitle
                                : Colors.primary,
                        },
                    ]}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <Ionicons
                                name="lock-closed-outline"
                                size={19}
                                color="#fff"
                            />

                            <Text style={styles.payText}>
                                Pay ₹{total}
                            </Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>

        </ThemeView>
    )
}

export default Payment

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 18,
    },

    header: {
        alignItems: 'center',
        marginTop: 35,
        marginBottom: 25,
    },

    title: {
        fontSize: 24,
        fontWeight: '800',
        marginTop: 12,
    },

    subtitle: {
        fontSize: 14,
        marginTop: 5,
    },

    card: {
        borderWidth: 1,
        borderRadius: 16,
        padding: 20,
    },

    label: {
        fontSize: 13,
        textAlign: 'center',
    },

    amount: {
        fontSize: 36,
        fontWeight: '900',
        textAlign: 'center',
        marginTop: 6,
    },

    divider: {
        height: 1,
        marginVertical: 18,
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },

    rowLabel: {
        fontSize: 13,
    },

    rowValue: {
        fontSize: 13,
        fontWeight: '700',
    },

    infoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 12,
        marginTop: 20,
    },

    infoText: {
        flex: 1,
        marginLeft: 10,
        fontSize: 13,
        lineHeight: 19,
    },

    bottom: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingBottom: 10,
    },

    payButton: {
        height: 55,
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },

    payText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '800',
        marginLeft: 8,
    },
})