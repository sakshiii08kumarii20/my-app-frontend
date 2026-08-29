import { StatusBar } from 'expo-status-bar'
import {
    TouchableOpacity,
    View,
} from 'react-native'
import { Stack, Link } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

import Colors from '../constans/Colors'
import { CartProvider } from '../context/CartContext'
import { ThemeProvider, useAppTheme } from '../context/ThemeContext'
import FloatingCart from '../components/FloatingCart'

const AppNavigator = () => {
    const { colorScheme } = useAppTheme()

    const theme =
        Colors[colorScheme] || Colors.light

    return (
        <>
            {/* =====================================================
                STATUS BAR
            ===================================================== */}

            <StatusBar
                style={
                    colorScheme === 'dark'
                        ? 'light'
                        : 'dark'
                }
                backgroundColor={theme.background}
            />

            {/* =====================================================
                NAVIGATION
            ===================================================== */}

            <Stack
                screenOptions={{
                    headerStyle: {
                        backgroundColor:
                            theme.headerBackground ||
                            theme.background,
                    },

                    headerTintColor:
                        theme.headerText ||
                        theme.text,

                    headerTitleStyle: {
                        color:
                            theme.headerText ||
                            theme.text,

                        fontWeight: '700',
                    },

                    headerShadowVisible: false,

                    contentStyle: {
                        backgroundColor:
                            theme.background,
                    },

                    animation: 'slide_from_right',
                }}
            >

                {/* =================================================
                    HOME
                ================================================= */}

                <Stack.Screen
                    name="index"
                    options={{
                        title: 'Home',

                        headerRight: () => (
                            <Link
                                href="/profile"
                                asChild
                            >
                                <TouchableOpacity
                                    style={{
                                        marginRight: 15,
                                        width: 38,
                                        height: 38,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons
                                        name="person-circle-outline"
                                        size={27}
                                        color={
                                            theme.headerIcon ||
                                            theme.text
                                        }
                                    />
                                </TouchableOpacity>
                            </Link>
                        ),
                    }}
                />

                {/* =================================================
                    PROFILE
                ================================================= */}

                <Stack.Screen
                    name="profile"
                    options={{
                        title: 'Profile',
                    }}
                />

                {/* =================================================
                    AUTH
                ================================================= */}

                <Stack.Screen
                    name="login"
                    options={{
                        title: 'Login',
                    }}
                />

                <Stack.Screen
                    name="signup"
                    options={{
                        title: 'Sign Up',
                    }}
                />

                {/* =================================================
                    CART
                ================================================= */}

                <Stack.Screen
                    name="cart"
                    options={{
                        title: 'Your Cart',
                    }}
                />

                {/* =================================================
                    SEARCH
                ================================================= */}

                <Stack.Screen
                    name="search"
                    options={{
                        title: 'Search',
                    }}
                />

                {/* =================================================
                    PRODUCT DETAIL
                ================================================= */}

                <Stack.Screen
                    name="product/[id]"
                    options={{
                        title: 'Product Details',
                        headerBackTitle: 'Back',
                    }}
                />

                {/* =================================================
                    CHECKOUT
                ================================================= */}

                <Stack.Screen
                    name="checkout"
                    options={{
                        title: 'Checkout',
                    }}
                />

                {/* =================================================
                    PAYMENT
                ================================================= */}

                <Stack.Screen
                    name="payment"
                    options={{
                        title: 'Payment',
                    }}
                />

                {/* =================================================
                    ORDER CONFIRMATION
                ================================================= */}

                <Stack.Screen
                    name="order-confirmation"
                    options={{
                        title: 'Order Confirmation',
                        headerBackVisible: false,
                    }}
                />

                {/* =================================================
                    ORDERS
                ================================================= */}

                <Stack.Screen
                    name="orders"
                    options={{
                        title: 'Your Orders',
                    }}
                />

                {/* =================================================
                    ORDER AGAIN
                ================================================= */}

                <Stack.Screen
                    name="order-again"
                    options={{
                        title: 'Order Again',
                    }}
                />

                {/* =================================================
                    CATEGORIES
                ================================================= */}

                <Stack.Screen
                    name="categories"
                    options={{
                        title: 'Categories',
                    }}
                />

            </Stack>
        </>
    )
}


/* ===============================================================
   ROOT LAYOUT
=============================================================== */

const RootLayout = () => {
    return (
        <ThemeProvider>
            <CartProvider>

                <View style={{ flex: 1 }}>

                    <AppNavigator />

                    <FloatingCart />

                </View>

            </CartProvider>
        </ThemeProvider>
    )
}

export default RootLayout