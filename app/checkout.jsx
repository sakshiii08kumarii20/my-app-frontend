// app/checkout.jsx

import { useState, useEffect } from 'react'

import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Alert,
} from 'react-native'

import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'

import Colors from '../constans/Colors'
import { useAppTheme } from '../context/ThemeContext'
import { useCart } from '../context/CartContext'
import ThemeView from '../components/ThemeView'
import { createSalesOrder } from '../constans/api'


// =====================================================
// PAYMENT METHODS
// =====================================================

const PAYMENT_METHODS = [
    {
        key: 'cod',
        label: 'Cash on Delivery',
        icon: 'cash-outline',
    },
    {
        key: 'upi',
        label: 'UPI',
        icon: 'phone-portrait-outline',
    },
    {
        key: 'card',
        label: 'Credit / Debit Card',
        icon: 'card-outline',
    },
]


// =====================================================
// DELIVERY FEE
// =====================================================

const DELIVERY_FEE = 20


// =====================================================
// CHECKOUT
// =====================================================

const Checkout = () => {

    const router = useRouter()

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
    // CART
    // =====================================================

    const {
        items,
        cartTotal,
        clearCart,
    } = useCart()


    // =====================================================
    // FORM STATE
    // =====================================================

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [pincode, setPincode] = useState('')

    const [payment, setPayment] =
        useState('cod')

    const [placingOrder, setPlacingOrder] =
        useState(false)


    // =====================================================
    // TOTAL
    // =====================================================

    const total =
        cartTotal + DELIVERY_FEE


    // =====================================================
    // PREFILL CUSTOMER
    // =====================================================

    useEffect(() => {

        const prefillFromStorage = async () => {

            try {

                const [
                    [, storedName],
                    [, storedEmail],
                    [, storedPhone],
                ] = await AsyncStorage.multiGet([
                    'customerName',
                    'customerEmail',
                    'customerPhone',
                ])

                if (storedName) {
                    setName(storedName)
                }

                if (storedEmail) {
                    setEmail(storedEmail)
                }

                if (storedPhone) {
                    setPhone(storedPhone)
                }

            } catch (error) {

                console.error(
                    'Customer prefill error:',
                    error
                )

            }
        }

        prefillFromStorage()

    }, [])


    // =====================================================
    // PLACE ORDER
    // =====================================================

    const handlePlaceOrder = async () => {

        // -------------------------------------------------
        // 1. Validate delivery details
        // -------------------------------------------------

        if (
            !name.trim() ||
            !phone.trim() ||
            !address.trim() ||
            !pincode.trim()
        ) {

            Alert.alert(
                'Missing details',
                'Please fill in your name, phone, address and pincode.'
            )

            return
        }


        // -------------------------------------------------
        // 2. Validate cart
        // -------------------------------------------------

        if (
            !items ||
            items.length === 0
        ) {

            Alert.alert(
                'Cart is empty',
                'Add items to your cart before checking out.'
            )

            return
        }


        try {

            setPlacingOrder(true)


            // -------------------------------------------------
            // 3. Convert cart items to POS line items
            // -------------------------------------------------

            const line_items =
                items.map(
                    ({ product, qty }) => ({
                        item_id:
                            product.posItemId,

                        name:
                            product.name,

                        rate:
                            product.price,

                        quantity:
                            qty,

                        unit:
                            product.unit || 'pcs',
                    })
                )


            // -------------------------------------------------
            // 4. Create order data
            // -------------------------------------------------

            const orderData = {

                customer: {
                    name,
                    email:
                        email.trim() ||
                        undefined,
                    phone,
                    address,
                    pincode,
                },

                line_items,

                date:
                    new Date()
                        .toISOString()
                        .split('T')[0],

                reference_number:
                    `APP-${Date.now()}`,
            }


            // -------------------------------------------------
            // 5. Send to backend
            // -------------------------------------------------

            const result =
                await createSalesOrder(
                    orderData
                )


            console.log(
                '================================='
            )

            console.log(
                'POS ORDER RESPONSE'
            )

            console.log(
                '================================='
            )

            console.log(
                JSON.stringify(
                    result,
                    null,
                    2
                )
            )


            // -------------------------------------------------
            // 6. Get Sales Order number
            // -------------------------------------------------

            const salesOrderNumber =
                result
                    ?.zoho
                    ?.salesorder
                    ?.salesorder_number


            // -------------------------------------------------
            // 7. Clear cart ONLY after success
            // -------------------------------------------------

            clearCart()


            // -------------------------------------------------
// 8. Success
// -------------------------------------------------

router.replace({
    pathname: '/order-confirmation',

    params: {
        orderId:
            salesOrderNumber ||
            'N/A',

        total:
            String(total),

        payment:
            payment,

        date:
            new Date().toISOString(),

        items:
            JSON.stringify(
                items.map(
                    ({ product, qty }) => ({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        qty: qty,
                        unit:
                            product.unit ||
                            'pcs',
                    })
                )
            ),
    },
})

        } catch (error) {

            console.error(
                'Create order error:',
                error
            )

            Alert.alert(
                'Order Failed',
                error.message ||
                    'Unable to create order.'
            )

        } finally {

            setPlacingOrder(false)

        }
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
                    DELIVERY ADDRESS
                ================================================= */}

                <View style={styles.section}>

                    <Text
                        style={[
                            styles.sectionTitle,
                            {
                                color:
                                    theme.title,
                            },
                        ]}
                    >
                        Delivery Address
                    </Text>


                    {/* FULL NAME */}

                    <TextInput
                        placeholder="Full Name"
                        placeholderTextColor={
                            theme.placeholder ||
                            theme.textMuted
                        }
                        value={name}
                        onChangeText={setName}
                        style={[
                            styles.input,
                            {
                                backgroundColor:
                                    theme.inputBackground ||
                                    theme.card,

                                borderColor:
                                    theme.inputBorder ||
                                    theme.border,

                                color:
                                    theme.inputText ||
                                    theme.text,
                            },
                        ]}
                    />


                    {/* EMAIL */}

                    <TextInput
                        placeholder="Email (optional)"
                        placeholderTextColor={
                            theme.inputPlaceholder ||
                            theme.textMuted
                        }
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        style={[
                            styles.input,
                            {
                                backgroundColor:
                                    theme.inputBackground ||
                                    theme.card,

                                borderColor:
                                    theme.inputBorder ||
                                    theme.border,

                                color:
                                    theme.inputText ||
                                    theme.text,
                            },
                        ]}
                    />


                    {/* PHONE */}

                    <TextInput
                        placeholder="Phone Number"
                        placeholderTextColor={
                            theme.inputPlaceholder ||
                            theme.textMuted
                        }
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                        maxLength={10}
                        style={[
                            styles.input,
                            {
                                backgroundColor:
                                    theme.inputBackground ||
                                    theme.card,

                                borderColor:
                                    theme.inputBorder ||
                                    theme.border,

                                color:
                                    theme.inputText ||
                                    theme.text,
                            },
                        ]}
                    />


                    {/* ADDRESS */}

                    <TextInput
                        placeholder="Address (House no, Street, Area)"
                        placeholderTextColor={
                            theme.inputPlaceholder ||
                            theme.textMuted
                        }
                        value={address}
                        onChangeText={setAddress}
                        multiline
                        textAlignVertical="top"
                        style={[
                            styles.input,
                            styles.textArea,
                            {
                                backgroundColor:
                                    theme.inputBackground ||
                                    theme.card,

                                borderColor:
                                    theme.inputBorder ||
                                    theme.border,

                                color:
                                    theme.inputText ||
                                    theme.text,
                            },
                        ]}
                    />


                    {/* PINCODE */}

                    <TextInput
                        placeholder="Pincode"
                        placeholderTextColor={
                            theme.inputPlaceholder ||
                            theme.textMuted
                        }
                        value={pincode}
                        onChangeText={setPincode}
                        keyboardType="number-pad"
                        maxLength={6}
                        style={[
                            styles.input,
                            {
                                backgroundColor:
                                    theme.inputBackground ||
                                    theme.card,

                                borderColor:
                                    theme.inputBorder ||
                                    theme.border,

                                color:
                                    theme.inputText ||
                                    theme.text,
                            },
                        ]}
                    />

                </View>


                {/* =================================================
                    ORDER SUMMARY
                ================================================= */}

                <View style={styles.section}>

                    <Text
                        style={[
                            styles.sectionTitle,
                            {
                                color:
                                    theme.title,
                            },
                        ]}
                    >
                        Order Summary
                    </Text>


                    {items.map(
                        ({ product, qty }) => (

                            <View
                                key={product.id}
                                style={
                                    styles.summaryRow
                                }
                            >

                                <Text
                                    style={[
                                        styles.summaryItemName,
                                        {
                                            color:
                                                theme.text,
                                        },
                                    ]}
                                    numberOfLines={1}
                                >
                                    {product.name}
                                    {' '}
                                    ({product.unit})
                                    {' × '}
                                    {qty}
                                </Text>


                                <Text
                                    style={[
                                        styles.summaryItemPrice,
                                        {
                                            color:
                                                theme.text,
                                        },
                                    ]}
                                >
                                    ₹
                                    {product.price *
                                        qty}
                                </Text>

                            </View>
                        )
                    )}


                    {/* DIVIDER */}

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


                    {/* SUBTOTAL */}

                    <View
                        style={
                            styles.summaryRow
                        }
                    >

                        <Text
                            style={[
                                styles.summaryLabel,
                                {
                                    color:
                                        theme.subtitle,
                                },
                            ]}
                        >
                            Subtotal
                        </Text>

                        <Text
                            style={[
                                styles.summaryValue,
                                {
                                    color:
                                        theme.text,
                                },
                            ]}
                        >
                            ₹{cartTotal}
                        </Text>

                    </View>


                    {/* DELIVERY */}

                    <View
                        style={
                            styles.summaryRow
                        }
                    >

                        <Text
                            style={[
                                styles.summaryLabel,
                                {
                                    color:
                                        theme.subtitle,
                                },
                            ]}
                        >
                            Delivery Fee
                        </Text>

                        <Text
                            style={[
                                styles.summaryValue,
                                {
                                    color:
                                        theme.text,
                                },
                            ]}
                        >
                            ₹{DELIVERY_FEE}
                        </Text>

                    </View>


                    {/* DIVIDER */}

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


                    {/* TOTAL */}

                    <View
                        style={
                            styles.summaryRow
                        }
                    >

                        <Text
                            style={[
                                styles.totalLabel,
                                {
                                    color:
                                        theme.title,
                                },
                            ]}
                        >
                            Total
                        </Text>

                        <Text
                            style={[
                                styles.totalValue,
                                {
                                    color:
                                        theme.productPrice ||
                                        theme.primary,
                                },
                            ]}
                        >
                            ₹{total}
                        </Text>

                    </View>

                </View>


                {/* =================================================
                    PAYMENT METHOD
                ================================================= */}

                <View style={styles.section}>

                    <Text
                        style={[
                            styles.sectionTitle,
                            {
                                color:
                                    theme.title,
                            },
                        ]}
                    >
                        Payment Method
                    </Text>


                    {PAYMENT_METHODS.map(
                        (method) => {

                            const active =
                                method.key ===
                                payment

                            return (

                                <TouchableOpacity
                                    key={
                                        method.key
                                    }
                                    activeOpacity={0.8}
                                    onPress={() =>
                                        setPayment(
                                            method.key
                                        )
                                    }
                                    style={[
                                        styles.paymentOption,

                                        {
                                            borderColor:
                                                active
                                                    ? theme.primary
                                                    : theme.border,

                                            backgroundColor:
                                                active
                                                    ? theme.uiBackground
                                                    : theme.card,
                                        },
                                    ]}
                                >

                                    {/* ICON */}

                                    <View
                                        style={[
                                            styles.paymentIcon,

                                            {
                                                backgroundColor:
                                                    active
                                                        ? theme.primary
                                                        : theme.uiBackground,
                                            },
                                        ]}
                                    >

                                        <Ionicons
                                            name={
                                                method.icon
                                            }
                                            size={19}
                                            color={
                                                active
                                                    ? theme.buttonPrimaryText ||
                                                      '#FFFFFF'
                                                    : theme.subtitle
                                            }
                                        />

                                    </View>


                                    {/* LABEL */}

                                    <Text
                                        style={[
                                            styles.paymentLabel,
                                            {
                                                color:
                                                    theme.text,
                                            },
                                        ]}
                                    >
                                        {
                                            method.label
                                        }
                                    </Text>


                                    {/* RADIO */}

                                    <Ionicons
                                        name={
                                            active
                                                ? 'radio-button-on'
                                                : 'radio-button-off'
                                        }
                                        size={21}
                                        color={
                                            active
                                                ? theme.primary
                                                : theme.subtitle
                                        }
                                    />

                                </TouchableOpacity>
                            )
                        }
                    )}

                </View>

            </ScrollView>


            {/* =====================================================
                FOOTER
            ===================================================== */}

            <View
                style={[
                    styles.footer,
                    {
                        backgroundColor:
                            theme.card,

                        borderTopColor:
                            theme.border,
                    },
                ]}
            >

                <View>

                    <Text
                        style={[
                            styles.footerLabel,
                            {
                                color:
                                    theme.subtitle,
                            },
                        ]}
                    >
                        Total
                    </Text>


                    <Text
                        style={[
                            styles.footerTotal,
                            {
                                color:
                                    theme.title,
                            },
                        ]}
                    >
                        ₹{total}
                    </Text>

                </View>


                {/* PLACE ORDER */}

                <TouchableOpacity
                    activeOpacity={0.85}
                    style={[
                        styles.placeOrderBtn,

                        {
                            backgroundColor:
                                theme.buttonPrimary ||
                                theme.primary,

                            opacity:
                                placingOrder
                                    ? 0.6
                                    : 1,
                        },
                    ]}
                    onPress={
                        handlePlaceOrder
                    }
                    disabled={
                        placingOrder
                    }
                >

                    <Text
                        style={[
                            styles.placeOrderText,
                            {
                                color:
                                    theme.buttonPrimaryText ||
                                    '#FFFFFF',
                            },
                        ]}
                    >
                        {placingOrder
                            ? 'Creating...'
                            : 'Place Order'}
                    </Text>

                </TouchableOpacity>

            </View>

        </ThemeView>
    )
}


export default Checkout


// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({

    screen: {
        flex: 1,
    },

    scrollContent: {
        paddingBottom: 30,
    },


    // =================================================
    // SECTION
    // =================================================

    section: {
        paddingHorizontal: 18,
        paddingTop: 20,
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: '800',
        marginBottom: 12,
    },


    // =================================================
    // INPUTS
    // =================================================

    input: {
        borderWidth: 1,
        borderRadius: 12,

        paddingHorizontal: 14,
        paddingVertical: 12,

        fontSize: 14,

        marginBottom: 12,
    },

    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },


    // =================================================
    // ORDER SUMMARY
    // =================================================

    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        marginBottom: 8,
    },

    summaryItemName: {
        flex: 1,

        fontSize: 13,

        marginRight: 8,
    },

    summaryItemPrice: {
        fontSize: 13,
        fontWeight: '600',
    },

    summaryLabel: {
        fontSize: 13,
    },

    summaryValue: {
        fontSize: 13,
        fontWeight: '600',
    },

    totalLabel: {
        fontSize: 16,
        fontWeight: '800',
    },

    totalValue: {
        fontSize: 17,
        fontWeight: '900',
    },

    divider: {
        height: 1,
        marginVertical: 9,
    },


    // =================================================
    // PAYMENT
    // =================================================

    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',

        borderWidth: 1,
        borderRadius: 14,

        padding: 12,

        marginBottom: 10,
    },

    paymentIcon: {
        width: 38,
        height: 38,

        borderRadius: 19,

        alignItems: 'center',
        justifyContent: 'center',
    },

    paymentLabel: {
        flex: 1,

        marginLeft: 10,

        fontSize: 14,
        fontWeight: '600',
    },


    // =================================================
    // FOOTER
    // =================================================

    footer: {
        flexDirection: 'row',

        justifyContent:
            'space-between',

        alignItems: 'center',

        padding: 16,

        borderTopWidth: 1,
    },

    footerLabel: {
        fontSize: 12,
    },

    footerTotal: {
        fontSize: 20,
        fontWeight: '800',
        marginTop: 2,
    },


    // =================================================
    // PLACE ORDER BUTTON
    // =================================================

    placeOrderBtn: {
        paddingVertical: 14,
        paddingHorizontal: 28,

        borderRadius: 12,

        minWidth: 145,

        alignItems: 'center',
        justifyContent: 'center',
    },

    placeOrderText: {
        fontWeight: '800',
        fontSize: 14,
    },

})