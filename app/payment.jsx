import { useState } from 'react'
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

import Colors from '../constans/Colors'
import ThemeView from '../components/ThemeView'
import { useAppTheme } from '../context/ThemeContext'
import { useCart } from '../context/CartContext'

const Payment = () => {
    const router = useRouter()
    const params = useLocalSearchParams()

    // =====================================================
    // THEME
    // =====================================================

    const { colorScheme } = useAppTheme()

    const theme =
        Colors[colorScheme] || Colors.light

    // =====================================================
    // CART
    // =====================================================

    const { clearCart } = useCart()

    const [loading, setLoading] = useState(false)

    // =====================================================
    // TOTAL
    // =====================================================

    const total = Number(params.total || 0)

    // =====================================================
    // TEST PAYMENT
    // =====================================================

    const handleTestPayment = async () => {
        try {
            setLoading(true)

            const response = await fetch(
                'http://192.168.0.131:4000/api/payments/test',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json',
                    },

                    body: JSON.stringify({
                        amount: total,
                        payment_method:
                            params.payment || 'test',
                    }),
                }
            )

            const data = await response.json()

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message ||
                        'Test payment failed'
                )
            }

            // =================================================
            // CREATE ORDER ID
            // =================================================

            const orderId = data.payment_id
                ? `ORD-${data.payment_id}`
                : `ORD${Date.now()
                      .toString()
                      .slice(-8)}`

            const orderDate =
                new Date().toISOString()

            // =================================================
            // CLEAR CART
            // =================================================

            clearCart()

            // =================================================
            // GO TO ORDER CONFIRMATION
            // =================================================

            router.replace({
                pathname: '/order-confirmation',

                params: {
                    orderId,

                    total: String(total),

                    payment:
                        params.payment ||
                        'test',

                    date: orderDate,

                    items:
                        params.items ||
                        '[]',
                },
            })
        } catch (error) {
            console.log(
                'TEST PAYMENT ERROR:',
                error
            )

            Alert.alert(
                'Payment Failed',
                error.message ||
                    'Unable to complete test payment.'
            )
        } finally {
            setLoading(false)
        }
    }

    // =====================================================
    // UI
    // =====================================================

    return (
        <ThemeView style={styles.container}>

            {/* =================================================
                HEADER
            ================================================= */}

            <View style={styles.header}>

                <View
                    style={[
                        styles.iconCircle,
                        {
                            backgroundColor:
                                theme.accentLight ||
                                theme.uiBackground,
                        },
                    ]}
                >
                    <Ionicons
                        name="card-outline"
                        size={34}
                        color={theme.primary}
                    />
                </View>

                <Text
                    style={[
                        styles.title,
                        {
                            color: theme.title,
                        },
                    ]}
                >
                    Test Payment
                </Text>

                <Text
                    style={[
                        styles.subtitle,
                        {
                            color:
                                theme.subtitle,
                        },
                    ]}
                >
                    Sandbox / Demo Payment
                </Text>

            </View>


            {/* =================================================
                PAYMENT CARD
            ================================================= */}

            <View
                style={[
                    styles.card,
                    {
                        backgroundColor:
                            theme.card,

                        borderColor:
                            theme.border,
                    },
                ]}
            >

                <Text
                    style={[
                        styles.label,
                        {
                            color:
                                theme.subtitle,
                        },
                    ]}
                >
                    Amount to Pay
                </Text>

                <Text
                    style={[
                        styles.amount,
                        {
                            color:
                                theme.title,
                        },
                    ]}
                >
                    ₹{total}
                </Text>

                <View
                    style={[
                        styles.divider,
                        {
                            backgroundColor:
                                theme.border,
                        },
                    ]}
                />

                {/* PAYMENT METHOD */}

                <View style={styles.row}>

                    <Text
                        style={[
                            styles.rowLabel,
                            {
                                color:
                                    theme.subtitle,
                            },
                        ]}
                    >
                        Payment Method
                    </Text>

                    <Text
                        style={[
                            styles.rowValue,
                            {
                                color:
                                    theme.text,
                            },
                        ]}
                    >
                        Test Payment
                    </Text>

                </View>


                {/* ENVIRONMENT */}

                <View style={styles.row}>

                    <Text
                        style={[
                            styles.rowLabel,
                            {
                                color:
                                    theme.subtitle,
                            },
                        ]}
                    >
                        Environment
                    </Text>

                    <View
                        style={[
                            styles.sandboxBadge,
                            {
                                backgroundColor:
                                    theme.uiBackground,
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.sandboxText,
                                {
                                    color:
                                        theme.primary,
                                },
                            ]}
                        >
                            SANDBOX
                        </Text>
                    </View>

                </View>

            </View>


            {/* =================================================
                INFORMATION BOX
            ================================================= */}

            <View
                style={[
                    styles.infoBox,
                    {
                        backgroundColor:
                            theme.uiBackground,

                        borderColor:
                            theme.border,
                    },
                ]}
            >

                <Ionicons
                    name="information-circle-outline"
                    size={22}
                    color={theme.primary}
                />

                <Text
                    style={[
                        styles.infoText,
                        {
                            color:
                                theme.text,
                        },
                    ]}
                >
                    This is a test payment. No real
                    money will be charged.
                </Text>

            </View>


            {/* =================================================
                BOTTOM PAYMENT BUTTON
            ================================================= */}

            <View style={styles.bottom}>

                <TouchableOpacity
                    disabled={loading}
                    onPress={handleTestPayment}
                    activeOpacity={0.8}
                    style={[
                        styles.payButton,
                        {
                            backgroundColor:
                                loading
                                    ? theme.textMuted ||
                                      theme.subtitle
                                    : theme.primary,

                            opacity:
                                loading ? 0.7 : 1,
                        },
                    ]}
                >

                    {loading ? (

                        <ActivityIndicator
                            color="#FFFFFF"
                            size="small"
                        />

                    ) : (

                        <>
                            <Ionicons
                                name="lock-closed-outline"
                                size={19}
                                color="#FFFFFF"
                            />

                            <Text
                                style={
                                    styles.payText
                                }
                            >
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


// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 18,
    },

    // =================================================
    // HEADER
    // =================================================

    header: {
        alignItems: 'center',
        marginTop: 35,
        marginBottom: 25,
    },

    iconCircle: {
        width: 68,
        height: 68,
        borderRadius: 34,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },

    title: {
        fontSize: 24,
        fontWeight: '800',
        marginTop: 4,
    },

    subtitle: {
        fontSize: 14,
        marginTop: 5,
    },

    // =================================================
    // PAYMENT CARD
    // =================================================

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
        alignItems: 'center',
        marginBottom: 12,
    },

    rowLabel: {
        fontSize: 13,
    },

    rowValue: {
        fontSize: 13,
        fontWeight: '700',
    },

    // =================================================
    // SANDBOX BADGE
    // =================================================

    sandboxBadge: {
        paddingHorizontal: 9,
        paddingVertical: 4,
        borderRadius: 6,
    },

    sandboxText: {
        fontSize: 11,
        fontWeight: '800',
    },

    // =================================================
    // INFO
    // =================================================

    infoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 12,
        marginTop: 20,
        borderWidth: 1,
    },

    infoText: {
        flex: 1,
        marginLeft: 10,
        fontSize: 13,
        lineHeight: 19,
    },

    // =================================================
    // BOTTOM
    // =================================================

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
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '800',
        marginLeft: 8,
    },

})