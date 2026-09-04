import { StatusBar } from 'expo-status-bar'
import {
    TouchableOpacity,
    View,
} from 'react-native'
import { Stack, Link } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context'
import { Platform } from 'react-native'

import Colors from '../constans/Colors'
import { CartProvider } from '../context/CartContext'
import { ThemeProvider, useAppTheme } from '../context/ThemeContext'
import FloatingCart from '../components/FloatingCart'

// Keep the native splash screen visible until fonts (and theme) are ready
SplashScreen.preventAutoHideAsync()

const AppNavigator = () => {
    const { colorScheme } = useAppTheme()
    const insets = useSafeAreaInsets()

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

                    // Explicitly tell the native header how tall the status
                    // bar is, using the REAL device inset. Expo Go's
                    // edge-to-edge handling on Android doesn't always apply
                    // this correctly on its own, which is what was pushing
                    // the header (and back arrow) off-screen.
                    headerStatusBarHeight:
                        Platform.OS === 'android'
                            ? insets.top
                            : undefined,

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
    // Wait for the icon font to be ready before rendering anything —
    // this is what was causing the profile icon (and bottom bar icons)
    // to be invisible/misaligned on first load.
    const [fontsLoaded] = useFonts(Ionicons.font)

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync()
        }
    }, [fontsLoaded])

    if (!fontsLoaded) {
        return null
    }

    return (
        <SafeAreaProvider>
            <ThemeProvider>
                <CartProvider>

                    <View style={{ flex: 1 }}>

                        <AppNavigator />

                        <FloatingCart />

                    </View>

                </CartProvider>
            </ThemeProvider>
        </SafeAreaProvider>
    )
}

export default RootLayout