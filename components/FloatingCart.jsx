import React from 'react'

import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native'

import {
    useRouter,
    usePathname,
} from 'expo-router'

import { Ionicons } from '@expo/vector-icons'

import Colors from '../constans/Colors'
import { useCart } from '../context/CartContext'
import { useAppTheme } from '../context/ThemeContext'


const FloatingCart = () => {

    const router = useRouter()
    const pathname = usePathname()

    const { colorScheme } = useAppTheme()

    const theme =
        Colors[colorScheme] || Colors.light

    const cart = useCart()


    // =========================================================
    // HIDE FLOATING CART ON CART / CHECKOUT / PAYMENT / ORDERS
    // =========================================================

    const hiddenRoutes = [
        '/cart',
        '/checkout',
        '/payment',
        '/order-confirmation',
        '/orders',
        '/order-again',
    ]


    const shouldHide =
        hiddenRoutes.includes(pathname)


    if (shouldHide) {
        return null
    }


    // =========================================================
    // CART ITEMS
    // =========================================================

    const items =
        cart?.items ||
        cart?.cartItems ||
        []


    // =========================================================
    // HIDE WHEN CART IS EMPTY
    // =========================================================

    if (!items || items.length === 0) {
        return null
    }


    // =========================================================
    // ITEM COUNT
    // =========================================================

    const itemCount = items.reduce(
        (total, item) => {

            return (
                total +
                Number(item.quantity || 1)
            )

        },
        0
    )


    // =========================================================
    // TOTAL PRICE
    // =========================================================

    const total = items.reduce(
        (sum, item) => {

            const price =
                Number(
                    item.price ||
                    item.rate ||
                    0
                )

            const quantity =
                Number(
                    item.quantity || 1
                )

            return (
                sum +
                price * quantity
            )
        },
        0
    )


    // =========================================================
    // OPEN CART
    // =========================================================

    const handleCartPress = () => {

        router.push('/cart')

    }


    // =========================================================
    // UI
    // =========================================================

    return (

        <View
            pointerEvents="box-none"
            style={styles.container}
        >

            <TouchableOpacity
                activeOpacity={0.88}
                onPress={handleCartPress}
                style={[
                    styles.cartButton,
                    {
                        backgroundColor:
                            colorScheme === 'dark'
                                ? 'rgba(190,145,205,0.88)'
                                : 'rgba(154,105,161,0.90)',

                        borderColor:
                            colorScheme === 'dark'
                                ? 'rgba(255,255,255,0.20)'
                                : 'rgba(255,255,255,0.55)',
                    },
                ]}
            >

                {/* =================================================
                    CART ICON
                ================================================= */}

                <View style={styles.iconBox}>

                    <Ionicons
                        name="cart-outline"
                        size={19}
                        color="#FFFFFF"
                    />


                    {/* COUNT BADGE */}

                    <View
                        style={[
                            styles.badge,
                            {
                                backgroundColor:
                                    theme.accent ||
                                    '#FF6B6B',
                            },
                        ]}
                    >

                        <Text
                            style={styles.badgeText}
                        >
                            {itemCount > 99
                                ? '99+'
                                : itemCount}
                        </Text>

                    </View>

                </View>


                {/* =================================================
                    CART TEXT
                ================================================= */}

                <View
                    style={styles.totalContainer}
                >

                    <Text
                        style={styles.viewCartText}
                    >
                        View Cart
                    </Text>

                    <Text
                        style={styles.itemText}
                    >
                        {itemCount}{' '}
                        {itemCount === 1
                            ? 'item'
                            : 'items'}
                    </Text>

                </View>


                {/* =================================================
                    TOTAL
                ================================================= */}

                <Text
                    style={styles.total}
                >
                    ₹{total.toFixed(0)}
                </Text>


                {/* =================================================
                    ARROW
                ================================================= */}

                <Ionicons
                    name="chevron-forward"
                    size={17}
                    color="#FFFFFF"
                />

            </TouchableOpacity>

        </View>
    )
}


export default FloatingCart


// =============================================================
// STYLES
// =============================================================

const styles = StyleSheet.create({

    // =========================================================
    // FLOATING POSITION
    // =========================================================

    container: {

        position: 'absolute',

        left: 0,
        right: 0,

        /*
         * Just above bottom navigation
         */
        bottom: 68,

        alignItems: 'center',

        zIndex: 9999,

        elevation: 20,

        pointerEvents: 'box-none',
    },


    // =========================================================
    // CART BUTTON
    // =========================================================

    cartButton: {

        height: 46,

        minWidth: 185,

        maxWidth: 215,

        borderRadius: 24,

        flexDirection: 'row',

        alignItems: 'center',

        paddingHorizontal: 12,

        borderWidth: 1,

        elevation: 10,

        shadowColor: '#000',

        shadowOffset: {
            width: 0,
            height: 4,
        },

        shadowOpacity: 0.16,

        shadowRadius: 9,
    },


    // =========================================================
    // CART ICON
    // =========================================================

    iconBox: {

        width: 30,

        height: 30,

        alignItems: 'center',

        justifyContent: 'center',

        position: 'relative',

        marginRight: 7,
    },


    // =========================================================
    // BADGE
    // =========================================================

    badge: {

        position: 'absolute',

        top: -5,

        right: -6,

        minWidth: 17,

        height: 17,

        borderRadius: 9,

        alignItems: 'center',

        justifyContent: 'center',

        paddingHorizontal: 3,

        borderWidth: 1.5,

        borderColor: '#FFFFFF',
    },


    badgeText: {

        color: '#FFFFFF',

        fontSize: 8,

        fontWeight: '900',
    },


    // =========================================================
    // TEXT CONTAINER
    // =========================================================

    totalContainer: {

        flex: 1,

        justifyContent: 'center',
    },


    // =========================================================
    // VIEW CART
    // =========================================================

    viewCartText: {

        color: '#FFFFFF',

        fontSize: 12,

        fontWeight: '800',
    },


    // =========================================================
    // ITEM TEXT
    // =========================================================

    itemText: {

        color: '#FFFFFF',

        opacity: 0.78,

        fontSize: 9,

        marginTop: 1,
    },


    // =========================================================
    // TOTAL
    // =========================================================

    total: {

        color: '#FFFFFF',

        fontSize: 13,

        fontWeight: '900',

        marginRight: 5,
    },

})