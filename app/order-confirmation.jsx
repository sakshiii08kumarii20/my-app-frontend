// app/order-confirmation.jsx

import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    Dimensions,
} from 'react-native'

import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

import Colors from '../constans/Colors'
import { useAppTheme } from '../context/ThemeContext'
import ThemeView from '../components/ThemeView'


// =====================================================
// SCREEN SIZE
// =====================================================

const { width } = Dimensions.get('window')


// =====================================================
// PAYMENT LABELS
// =====================================================

const PAYMENT_LABELS = {
    cod: 'Cash on Delivery',
    upi: 'UPI',
    card: 'Credit / Debit Card',
}


// =====================================================
// FORMAT DATE
// =====================================================

const formatDate = (isoString) => {

    if (!isoString) {
        return '-'
    }

    const d = new Date(isoString)

    if (Number.isNaN(d.getTime())) {
        return '-'
    }

    return (
        d.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        }) +
        ' · ' +
        d.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
        })
    )
}


// =====================================================
// ORDER CONFIRMATION
// =====================================================

const OrderConfirmation = () => {

    const router = useRouter()

    const {
        orderId,
        total,
        payment,
        date,
        items,
    } = useLocalSearchParams()


    // =====================================================
    // THEME
    // =====================================================

    const { colorScheme } = useAppTheme()

    const currentScheme =
        colorScheme === 'dark'
            ? 'dark'
            : 'light'

    const theme =
        Colors[currentScheme] || Colors.light


    // =====================================================
    // PARSE ITEMS
    // =====================================================

    let orderItems = []

    try {

        orderItems = items
            ? JSON.parse(items)
            : []

    } catch (error) {

        console.error(
            'Failed to parse order items:',
            error
        )

        orderItems = []
    }


    // =====================================================
    // PAYMENT
    // =====================================================

    const paymentLabel =
        PAYMENT_LABELS[payment] ||
        payment ||
        'Cash on Delivery'


    // =====================================================
    // ITEM COUNT
    // =====================================================

    const itemCount =
        orderItems.reduce(
            (totalCount, item) =>
                totalCount +
                Number(
                    item.qty ||
                    item.quantity ||
                    1
                ),
            0
        )


    // =====================================================
    // CONTINUE SHOPPING
    // =====================================================

    const handleContinueShopping = () => {

        router.replace('/')
    }


    // =====================================================
    // VIEW ORDERS
    // =====================================================

    const handleViewOrders = () => {

        router.replace('/orders')
    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <ThemeView
            style={[
                styles.screen,
                {
                    backgroundColor:
                        theme.background,
                },
            ]}
        >

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={
                    styles.scrollContent
                }
            >

                {/* =================================================
                    SUCCESS AREA
                ================================================= */}

                <View style={styles.successArea}>

                    {/* SUCCESS CIRCLE */}

                    <View
                        style={[
                            styles.successCircleOuter,
                            {
                                backgroundColor:
                                    colorScheme === 'dark'
                                        ? 'rgba(34,197,94,0.14)'
                                        : 'rgba(34,197,94,0.10)',
                            },
                        ]}
                    >

                        <View
                            style={[
                                styles.successCircle,
                                {
                                    backgroundColor:
                                        theme.success ||
                                        '#22C55E',
                                },
                            ]}
                        >

                            <Ionicons
                                name="checkmark"
                                size={42}
                                color="#FFFFFF"
                            />

                        </View>

                    </View>


                    {/* TITLE */}

                    <Text
                        style={[
                            styles.successTitle,
                            {
                                color:
                                    theme.title ||
                                    theme.text,
                            },
                        ]}
                    >
                        Order Placed!
                    </Text>


                    {/* SUBTITLE */}

                    <Text
                        style={[
                            styles.successSubtitle,
                            {
                                color:
                                    theme.subtitle ||
                                    theme.text,
                            },
                        ]}
                    >
                        Your order has been placed
                        successfully.
                    </Text>

                </View>


                {/* =================================================
                    MAIN ORDER CARD
                ================================================= */}

                <View
                    style={[
                        styles.orderCard,
                        {
                            backgroundColor:
                                theme.card ||
                                theme.background,

                            borderColor:
                                theme.border,
                        },
                    ]}
                >

                    {/* =================================================
                        ORDER HEADER
                    ================================================= */}

                    <View style={styles.orderHeader}>

                        <View>

                            <Text
                                style={[
                                    styles.smallLabel,
                                    {
                                        color:
                                            theme.subtitle,
                                    },
                                ]}
                            >
                                ORDER ID
                            </Text>

                            <Text
                                style={[
                                    styles.orderNumber,
                                    {
                                        color:
                                            theme.title ||
                                            theme.text,
                                    },
                                ]}
                                numberOfLines={1}
                            >
                                {orderId || 'N/A'}
                            </Text>

                        </View>


                        <View
                            style={[
                                styles.statusPill,
                                {
                                    backgroundColor:
                                        colorScheme === 'dark'
                                            ? 'rgba(34,197,94,0.14)'
                                            : 'rgba(34,197,94,0.10)',
                                },
                            ]}
                        >

                            <View
                                style={[
                                    styles.statusDot,
                                    {
                                        backgroundColor:
                                            theme.success ||
                                            '#22C55E',
                                    },
                                ]}
                            />

                            <Text
                                style={[
                                    styles.statusText,
                                    {
                                        color:
                                            theme.success ||
                                            '#22C55E',
                                    },
                                ]}
                            >
                                Placed
                            </Text>

                        </View>

                    </View>


                    {/* =================================================
                        DIVIDER
                    ================================================= */}

                    <View
                        style={[
                            styles.divider,
                            {
                                backgroundColor:
                                    theme.divider ||
                                    theme.border,
                            },
                        ]}
                    />


                    {/* =================================================
                        ORDER INFO
                    ================================================= */}

                    <View style={styles.infoRow}>

                        <View
                            style={
                                styles.infoItem
                            }
                        >

                            <View
                                style={[
                                    styles.infoIcon,
                                    {
                                        backgroundColor:
                                            theme.uiBackground ||
                                            theme.secondary,
                                    },
                                ]}
                            >

                                <Ionicons
                                    name="calendar-outline"
                                    size={17}
                                    color={
                                        theme.primary
                                    }
                                />

                            </View>

                            <View>

                                <Text
                                    style={[
                                        styles.infoLabel,
                                        {
                                            color:
                                                theme.subtitle,
                                        },
                                    ]}
                                >
                                    Ordered on
                                </Text>

                                <Text
                                    style={[
                                        styles.infoValue,
                                        {
                                            color:
                                                theme.text,
                                        },
                                    ]}
                                >
                                    {formatDate(date)}
                                </Text>

                            </View>

                        </View>

                    </View>


                    {/* =================================================
                        PAYMENT
                    ================================================= */}

                    <View style={styles.infoRow}>

                        <View
                            style={
                                styles.infoItem
                            }
                        >

                            <View
                                style={[
                                    styles.infoIcon,
                                    {
                                        backgroundColor:
                                            theme.uiBackground ||
                                            theme.secondary,
                                    },
                                ]}
                            >

                                <Ionicons
                                    name="card-outline"
                                    size={17}
                                    color={
                                        theme.primary
                                    }
                                />

                            </View>

                            <View>

                                <Text
                                    style={[
                                        styles.infoLabel,
                                        {
                                            color:
                                                theme.subtitle,
                                        },
                                    ]}
                                >
                                    Payment
                                </Text>

                                <Text
                                    style={[
                                        styles.infoValue,
                                        {
                                            color:
                                                theme.text,
                                        },
                                    ]}
                                >
                                    {paymentLabel}
                                </Text>

                            </View>

                        </View>

                    </View>


                    {/* =================================================
                        ITEMS
                    ================================================= */}

                    <View style={styles.infoRow}>

                        <View
                            style={
                                styles.infoItem
                            }
                        >

                            <View
                                style={[
                                    styles.infoIcon,
                                    {
                                        backgroundColor:
                                            theme.uiBackground ||
                                            theme.secondary,
                                    },
                                ]}
                            >

                                <Ionicons
                                    name="bag-outline"
                                    size={17}
                                    color={
                                        theme.primary
                                    }
                                />

                            </View>

                            <View>

                                <Text
                                    style={[
                                        styles.infoLabel,
                                        {
                                            color:
                                                theme.subtitle,
                                        },
                                    ]}
                                >
                                    Items
                                </Text>

                                <Text
                                    style={[
                                        styles.infoValue,
                                        {
                                            color:
                                                theme.text,
                                        },
                                    ]}
                                >
                                    {itemCount}{' '}
                                    {itemCount === 1
                                        ? 'item'
                                        : 'items'}
                                </Text>

                            </View>

                        </View>

                    </View>


                    {/* =================================================
                        TOTAL
                    ================================================= */}

                    <View
                        style={[
                            styles.totalBox,
                            {
                                backgroundColor:
                                    theme.uiBackground ||
                                    theme.secondary,
                            },
                        ]}
                    >

                        <View>

                            <Text
                                style={[
                                    styles.totalLabel,
                                    {
                                        color:
                                            theme.subtitle,
                                    },
                                ]}
                            >
                                Total Paid
                            </Text>

                            <Text
                                style={[
                                    styles.totalAmount,
                                    {
                                        color:
                                            theme.totalPrice ||
                                            theme.primary ||
                                            theme.text,
                                    },
                                ]}
                            >
                                ₹{total || '0'}
                            </Text>

                        </View>


                        <Ionicons
                            name="checkmark-circle"
                            size={27}
                            color={
                                theme.success ||
                                '#22C55E'
                            }
                        />

                    </View>

                </View>


                {/* =================================================
                    ITEMS CARD
                ================================================= */}

                {orderItems.length > 0 && (

                    <View
                        style={[
                            styles.itemsCard,
                            {
                                backgroundColor:
                                    theme.card ||
                                    theme.background,

                                borderColor:
                                    theme.border,
                            },
                        ]}
                    >

                        <View
                            style={
                                styles.itemsHeader
                            }
                        >

                            <Text
                                style={[
                                    styles.itemsTitle,
                                    {
                                        color:
                                            theme.title ||
                                            theme.text,
                                    },
                                ]}
                            >
                                Order Summary
                            </Text>

                            <Text
                                style={[
                                    styles.itemCountText,
                                    {
                                        color:
                                            theme.subtitle,
                                    },
                                ]}
                            >
                                {itemCount}{' '}
                                {itemCount === 1
                                    ? 'item'
                                    : 'items'}
                            </Text>

                        </View>


                        {orderItems.map(
                            (item, index) => {

                                const quantity =
                                    Number(
                                        item.qty ||
                                        item.quantity ||
                                        1
                                    )

                                const price =
                                    Number(
                                        item.price ||
                                        item.rate ||
                                        0
                                    )

                                const itemTotal =
                                    price *
                                    quantity

                                return (

                                    <View
                                        key={
                                            item.id ||
                                            item.product_id ||
                                            index
                                        }
                                        style={[
                                            styles.productRow,
                                            {
                                                borderBottomColor:
                                                    theme.divider ||
                                                    theme.border,
                                            },
                                        ]}
                                    >

                                        <View
                                            style={
                                                styles.productIcon
                                            }
                                        >

                                            <Ionicons
                                                name="cube-outline"
                                                size={20}
                                                color={
                                                    theme.primary
                                                }
                                            />

                                        </View>


                                        <View
                                            style={
                                                styles.productInfo
                                            }
                                        >

                                            <Text
                                                style={[
                                                    styles.productName,
                                                    {
                                                        color:
                                                            theme.text,
                                                    },
                                                ]}
                                                numberOfLines={2}
                                            >
                                                {item.name ||
                                                    'Product'}
                                            </Text>

                                            <Text
                                                style={[
                                                    styles.productQuantity,
                                                    {
                                                        color:
                                                            theme.subtitle,
                                                    },
                                                ]}
                                            >
                                                {item.unit ||
                                                    'pcs'}
                                                {' · '}
                                                Qty {quantity}
                                            </Text>

                                        </View>


                                        <Text
                                            style={[
                                                styles.productPrice,
                                                {
                                                    color:
                                                        theme.text,
                                                },
                                            ]}
                                        >
                                            ₹
                                            {itemTotal.toFixed(
                                                0
                                            )}
                                        </Text>

                                    </View>
                                )
                            }
                        )}

                    </View>
                )}


                {/* =================================================
                    DELIVERY MESSAGE
                ================================================= */}

                <View
                    style={[
                        styles.deliveryMessage,
                        {
                            backgroundColor:
                                colorScheme === 'dark'
                                    ? 'rgba(34,197,94,0.10)'
                                    : 'rgba(34,197,94,0.07)',
                        },
                    ]}
                >

                    <Ionicons
                        name="bicycle-outline"
                        size={23}
                        color={
                            theme.success ||
                            '#22C55E'
                        }
                    />

                    <View
                        style={
                            styles.deliveryTextContainer
                        }
                    >

                        <Text
                            style={[
                                styles.deliveryTitle,
                                {
                                    color:
                                        theme.text,
                                },
                            ]}
                        >
                            We're getting your order ready
                        </Text>

                        <Text
                            style={[
                                styles.deliverySubtitle,
                                {
                                    color:
                                        theme.subtitle,
                                },
                            ]}
                        >
                            You'll receive your order soon.
                        </Text>

                    </View>

                </View>


                {/* =================================================
                    BUTTONS
                ================================================= */}

                <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={
                        handleViewOrders
                    }
                    style={[
                        styles.primaryButton,
                        {
                            backgroundColor:
                                theme.buttonPrimary ||
                                theme.primary,
                        },
                    ]}
                >

                    <Ionicons
                        name="receipt-outline"
                        size={19}
                        color={
                            theme.buttonPrimaryText ||
                            '#FFFFFF'
                        }
                    />

                    <Text
                        style={[
                            styles.primaryButtonText,
                            {
                                color:
                                    theme.buttonPrimaryText ||
                                    '#FFFFFF',
                            },
                        ]}
                    >
                        View My Orders
                    </Text>

                </TouchableOpacity>


                <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={
                        handleContinueShopping
                    }
                    style={[
                        styles.secondaryButton,
                        {
                            borderColor:
                                theme.border,
                        },
                    ]}
                >

                    <Ionicons
                        name="arrow-back-outline"
                        size={18}
                        color={
                            theme.text
                        }
                    />

                    <Text
                        style={[
                            styles.secondaryButtonText,
                            {
                                color:
                                    theme.text,
                            },
                        ]}
                    >
                        Continue Shopping
                    </Text>

                </TouchableOpacity>


                {/* =================================================
                    BOTTOM MESSAGE
                ================================================= */}

                <Text
                    style={[
                        styles.bottomMessage,
                        {
                            color:
                                theme.subtitle,
                        },
                    ]}
                >
                    Thank you for shopping with us ❤️
                </Text>

            </ScrollView>

        </ThemeView>
    )
}


export default OrderConfirmation


// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({

    screen: {
        flex: 1,
    },


    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 40,
    },


    // =================================================
    // SUCCESS
    // =================================================

    successArea: {
        alignItems: 'center',
        paddingTop: 5,
        paddingBottom: 22,
    },


    successCircleOuter: {
        width: 104,
        height: 104,
        borderRadius: 52,

        alignItems: 'center',
        justifyContent: 'center',

        marginBottom: 15,
    },


    successCircle: {
        width: 76,
        height: 76,
        borderRadius: 38,

        alignItems: 'center',
        justifyContent: 'center',

        elevation: 5,

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.12,
        shadowRadius: 7,
    },


    successTitle: {
        fontSize: 25,
        fontWeight: '900',
        marginBottom: 5,
    },


    successSubtitle: {
        fontSize: 14,
        textAlign: 'center',
    },


    // =================================================
    // ORDER CARD
    // =================================================

    orderCard: {
        width: '100%',

        borderRadius: 18,
        borderWidth: 1,

        padding: 17,

        marginBottom: 14,

        elevation: 2,

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },


    orderHeader: {
        flexDirection: 'row',

        justifyContent:
            'space-between',

        alignItems: 'center',
    },


    smallLabel: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.7,
        marginBottom: 3,
    },


    orderNumber: {
        fontSize: 17,
        fontWeight: '900',

        maxWidth:
            width * 0.55,
    },


    statusPill: {
        flexDirection: 'row',
        alignItems: 'center',

        paddingHorizontal: 10,
        paddingVertical: 6,

        borderRadius: 20,
    },


    statusDot: {
        width: 7,
        height: 7,

        borderRadius: 4,

        marginRight: 5,
    },


    statusText: {
        fontSize: 11,
        fontWeight: '800',
    },


    // =================================================
    // DIVIDER
    // =================================================

    divider: {
        height: 1,

        marginVertical: 15,
    },


    // =================================================
    // INFO
    // =================================================

    infoRow: {
        marginBottom: 13,
    },


    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },


    infoIcon: {
        width: 36,
        height: 36,

        borderRadius: 18,

        alignItems: 'center',
        justifyContent: 'center',

        marginRight: 10,
    },


    infoLabel: {
        fontSize: 11,
        marginBottom: 2,
    },


    infoValue: {
        fontSize: 13,
        fontWeight: '700',
    },


    // =================================================
    // TOTAL
    // =================================================

    totalBox: {
        flexDirection: 'row',

        justifyContent:
            'space-between',

        alignItems: 'center',

        borderRadius: 13,

        paddingHorizontal: 14,
        paddingVertical: 12,

        marginTop: 4,
    },


    totalLabel: {
        fontSize: 11,
        marginBottom: 2,
    },


    totalAmount: {
        fontSize: 20,
        fontWeight: '900',
    },


    // =================================================
    // ITEMS CARD
    // =================================================

    itemsCard: {
        width: '100%',

        borderRadius: 18,
        borderWidth: 1,

        paddingHorizontal: 16,
        paddingTop: 16,

        marginBottom: 14,
    },


    itemsHeader: {
        flexDirection: 'row',

        justifyContent:
            'space-between',

        alignItems: 'center',

        marginBottom: 8,
    },


    itemsTitle: {
        fontSize: 16,
        fontWeight: '800',
    },


    itemCountText: {
        fontSize: 11,
        fontWeight: '600',
    },


    // =================================================
    // PRODUCT
    // =================================================

    productRow: {
        flexDirection: 'row',

        alignItems: 'center',

        paddingVertical: 12,

        borderBottomWidth: 1,
    },


    productIcon: {
        width: 38,
        height: 38,

        borderRadius: 10,

        alignItems: 'center',
        justifyContent: 'center',

        backgroundColor:
            'rgba(0,0,0,0.035)',

        marginRight: 10,
    },


    productInfo: {
        flex: 1,
        marginRight: 10,
    },


    productName: {
        fontSize: 13,
        fontWeight: '700',
    },


    productQuantity: {
        fontSize: 11,
        marginTop: 3,
    },


    productPrice: {
        fontSize: 13,
        fontWeight: '800',
    },


    // =================================================
    // DELIVERY MESSAGE
    // =================================================

    deliveryMessage: {
        flexDirection: 'row',
        alignItems: 'center',

        width: '100%',

        borderRadius: 14,

        padding: 13,

        marginBottom: 18,
    },


    deliveryTextContainer: {
        flex: 1,
        marginLeft: 10,
    },


    deliveryTitle: {
        fontSize: 13,
        fontWeight: '800',
        marginBottom: 2,
    },


    deliverySubtitle: {
        fontSize: 11,
    },


    // =================================================
    // BUTTONS
    // =================================================

    primaryButton: {
        width: '100%',

        minHeight: 50,

        borderRadius: 13,

        flexDirection: 'row',

        alignItems: 'center',
        justifyContent: 'center',

        gap: 8,

        marginBottom: 10,
    },


    primaryButtonText: {
        fontSize: 14,
        fontWeight: '800',
    },


    secondaryButton: {
        width: '100%',

        minHeight: 50,

        borderRadius: 13,

        borderWidth: 1,

        flexDirection: 'row',

        alignItems: 'center',
        justifyContent: 'center',

        gap: 8,
    },


    secondaryButtonText: {
        fontSize: 14,
        fontWeight: '700',
    },


    // =================================================
    // BOTTOM
    // =================================================

    bottomMessage: {
        textAlign: 'center',

        fontSize: 11,

        marginTop: 20,
    },

})