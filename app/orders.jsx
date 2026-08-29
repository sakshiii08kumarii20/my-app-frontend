import {
    useState,
    useCallback,
} from 'react'

import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native'

import {
    useRouter,
    useFocusEffect,
} from 'expo-router'

import AsyncStorage from '@react-native-async-storage/async-storage'

import Colors from '../constans/Colors'
import { useAppTheme } from '../context/ThemeContext'
import ThemeView from '../components/ThemeView'
import BottomNavBar from '../components/BottomNavBar'
import { fetchMyOrders } from '../constans/api'


// =====================================================
// ORDER CARD
// =====================================================

const OrderCard = ({ order, theme }) => {

    const status =
        order.status?.toUpperCase() ||
        'DRAFT'

    return (
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

            {/* =================================================
                TOP ROW
            ================================================= */}

            <View style={styles.cardTopRow}>

                <Text
                    style={[
                        styles.orderNumber,
                        {
                            color:
                                theme.title,
                        },
                    ]}
                >
                    {order.salesorder_number ||
                        order.salesorder_id ||
                        'Order'}
                </Text>

                <View
                    style={[
                        styles.statusBadge,
                        {
                            backgroundColor:
                                theme.uiBackground,
                        },
                    ]}
                >

                    <Text
                        style={[
                            styles.status,
                            {
                                color:
                                    theme.primary,
                            },
                        ]}
                    >
                        {status}
                    </Text>

                </View>

            </View>


            {/* =================================================
                DATE
            ================================================= */}

            <Text
                style={[
                    styles.date,
                    {
                        color:
                            theme.subtitle,
                    },
                ]}
            >
                {order.date || '-'}
            </Text>


            {/* =================================================
                TOTAL
            ================================================= */}

            <Text
                style={[
                    styles.total,
                    {
                        color:
                            theme.totalPrice,
                    },
                ]}
            >
                ₹{order.total || '0'}
            </Text>

        </View>
    )
}


// =====================================================
// ORDERS SCREEN
// =====================================================

const Orders = () => {

    const {
        colorScheme,
    } = useAppTheme()

    const theme =
        Colors[colorScheme] ??
        Colors.light

    const router = useRouter()


    // =================================================
    // STATE
    // =================================================

    const [orders, setOrders] =
        useState([])

    const [loading, setLoading] =
        useState(true)

    const [error, setError] =
        useState(null)

    const [loggedIn, setLoggedIn] =
        useState(false)


    // =================================================
    // LOAD ORDERS
    // =================================================

    useFocusEffect(
        useCallback(() => {

            const loadOrders =
                async () => {

                    setLoading(true)
                    setError(null)

                    try {

                        // ---------------------------------
                        // GET CUSTOMER PHONE
                        // ---------------------------------

                        const phone =
                            await AsyncStorage.getItem(
                                'customerPhone'
                            )


                        // ---------------------------------
                        // NOT LOGGED IN
                        // ---------------------------------

                        if (!phone) {

                            setLoggedIn(false)
                            setOrders([])
                            setLoading(false)

                            return
                        }


                        setLoggedIn(true)


                        // ---------------------------------
                        // FETCH ORDERS
                        // ---------------------------------

                        const result =
                            await fetchMyOrders(phone)

                        setOrders(
                            Array.isArray(result)
                                ? result
                                : []
                        )

                    } catch (err) {

                        console.error(
                            'Fetch orders error:',
                            err
                        )

                        setError(
                            err?.message ||
                            'Unable to load your orders.'
                        )

                    } finally {

                        setLoading(false)

                    }
                }


            loadOrders()

        }, [])
    )


    // =====================================================
    // UI
    // =====================================================

    return (
        <ThemeView style={styles.screen}>

            <View style={styles.container}>

                {/* =================================================
                    TITLE
                ================================================= */}

                <Text
                    style={[
                        styles.title,
                        {
                            color:
                                theme.title,
                        },
                    ]}
                >
                    Your Orders
                </Text>


                {/* =================================================
                    LOADING
                ================================================= */}

                {loading && (

                    <View style={styles.centerBox}>

                        <ActivityIndicator
                            size="large"
                            color={
                                theme.primary
                            }
                        />

                        <Text
                            style={[
                                styles.loadingText,
                                {
                                    color:
                                        theme.subtitle,
                                },
                            ]}
                        >
                            Loading your orders...
                        </Text>

                    </View>

                )}


                {/* =================================================
                    NOT LOGGED IN
                ================================================= */}

                {!loading &&
                    !loggedIn && (

                        <View
                            style={
                                styles.centerBox
                            }
                        >

                            <View
                                style={[
                                    styles.emptyIcon,
                                    {
                                        backgroundColor:
                                            theme.uiBackground,
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.emptyIconText,
                                        {
                                            color:
                                                theme.primary,
                                        },
                                    ]}
                                >
                                    👤
                                </Text>
                            </View>

                            <Text
                                style={[
                                    styles.emptyTitle,
                                    {
                                        color:
                                            theme.title,
                                    },
                                ]}
                            >
                                Login Required
                            </Text>

                            <Text
                                style={[
                                    styles.emptyText,
                                    {
                                        color:
                                            theme.subtitle,
                                    },
                                ]}
                            >
                                Log in to see your
                                order history.
                            </Text>

                            <TouchableOpacity
                                style={[
                                    styles.loginBtn,
                                    {
                                        backgroundColor:
                                            theme.buttonPrimary,
                                    },
                                ]}
                                onPress={() =>
                                    router.push(
                                        '/login'
                                    )
                                }
                                activeOpacity={0.8}
                            >
                                <Text
                                    style={[
                                        styles.loginBtnText,
                                        {
                                            color:
                                                theme.buttonPrimaryText,
                                        },
                                    ]}
                                >
                                    Log In
                                </Text>
                            </TouchableOpacity>

                        </View>

                    )}


                {/* =================================================
                    ERROR
                ================================================= */}

                {!loading &&
                    loggedIn &&
                    error && (

                        <View
                            style={
                                styles.centerBox
                            }
                        >

                            <View
                                style={[
                                    styles.errorBox,
                                    {
                                        backgroundColor:
                                            theme.errorLight,
                                        borderColor:
                                            theme.error,
                                    },
                                ]}
                            >

                                <Text
                                    style={[
                                        styles.errorTitle,
                                        {
                                            color:
                                                theme.error,
                                        },
                                    ]}
                                >
                                    Something went wrong
                                </Text>

                                <Text
                                    style={[
                                        styles.errorText,
                                        {
                                            color:
                                                theme.text,
                                        },
                                    ]}
                                >
                                    {error}
                                </Text>

                            </View>

                        </View>

                    )}


                {/* =================================================
                    NO ORDERS
                ================================================= */}

                {!loading &&
                    loggedIn &&
                    !error &&
                    orders.length === 0 && (

                        <View
                            style={
                                styles.centerBox
                            }
                        >

                            <View
                                style={[
                                    styles.emptyIcon,
                                    {
                                        backgroundColor:
                                            theme.uiBackground,
                                    },
                                ]}
                            >

                                <Text
                                    style={[
                                        styles.emptyCartIcon,
                                        {
                                            color:
                                                theme.primary,
                                        },
                                    ]}
                                >
                                    🛍
                                </Text>

                            </View>

                            <Text
                                style={[
                                    styles.emptyTitle,
                                    {
                                        color:
                                            theme.title,
                                    },
                                ]}
                            >
                                No Orders Yet
                            </Text>

                            <Text
                                style={[
                                    styles.emptyText,
                                    {
                                        color:
                                            theme.subtitle,
                                    },
                                ]}
                            >
                                Your orders will
                                appear here.
                            </Text>

                            <TouchableOpacity
                                style={[
                                    styles.loginBtn,
                                    {
                                        backgroundColor:
                                            theme.buttonPrimary,
                                    },
                                ]}
                                onPress={() =>
                                    router.replace('/')
                                }
                                activeOpacity={0.8}
                            >

                                <Text
                                    style={[
                                        styles.loginBtnText,
                                        {
                                            color:
                                                theme.buttonPrimaryText,
                                        },
                                    ]}
                                >
                                    Start Shopping
                                </Text>

                            </TouchableOpacity>

                        </View>

                    )}


                {/* =================================================
                    ORDERS LIST
                ================================================= */}

                {!loading &&
                    loggedIn &&
                    !error &&
                    orders.length > 0 && (

                        <FlatList
                            data={orders}

                            keyExtractor={(
                                item,
                                index
                            ) =>
                                item.salesorder_id ||
                                item.salesorder_number ||
                                String(index)
                            }

                            renderItem={({
                                item,
                            }) => (
                                <OrderCard
                                    order={item}
                                    theme={theme}
                                />
                            )}

                            showsVerticalScrollIndicator={
                                false
                            }

                            contentContainerStyle={
                                styles.list
                            }
                        />

                    )}

            </View>


            {/* =================================================
                BOTTOM NAVIGATION
            ================================================= */}

            <BottomNavBar />

        </ThemeView>
    )
}

export default Orders


// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({

    screen: {
        flex: 1,
    },

    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },

    // =================================================
    // TITLE
    // =================================================

    title: {
        fontSize: 22,
        fontWeight: '800',
        marginBottom: 16,
    },

    // =================================================
    // CENTER
    // =================================================

    centerBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },

    loadingText: {
        marginTop: 12,
        fontSize: 13,
    },

    // =================================================
    // EMPTY STATE
    // =================================================

    emptyIcon: {
        width: 72,
        height: 72,
        borderRadius: 36,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },

    emptyIconText: {
        fontSize: 30,
    },

    emptyCartIcon: {
        fontSize: 30,
    },

    emptyTitle: {
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 6,
    },

    emptyText: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 18,
        lineHeight: 20,
    },

    // =================================================
    // LOGIN
    // =================================================

    loginBtn: {
        paddingVertical: 13,
        paddingHorizontal: 28,
        borderRadius: 11,
    },

    loginBtnText: {
        fontSize: 14,
        fontWeight: '700',
    },

    // =================================================
    // ERROR
    // =================================================

    errorBox: {
        width: '100%',
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
    },

    errorTitle: {
        fontSize: 15,
        fontWeight: '800',
        marginBottom: 6,
    },

    errorText: {
        fontSize: 13,
        lineHeight: 19,
    },

    // =================================================
    // LIST
    // =================================================

    list: {
        paddingBottom: 20,
    },

    // =================================================
    // ORDER CARD
    // =================================================

    card: {
        borderWidth: 1,
        borderRadius: 14,
        padding: 16,
        marginBottom: 12,
    },

    cardTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 6,
    },

    orderNumber: {
        flex: 1,
        fontSize: 15,
        fontWeight: '700',
        marginRight: 10,
    },

    statusBadge: {
        paddingHorizontal: 9,
        paddingVertical: 5,
        borderRadius: 8,
    },

    status: {
        fontSize: 11,
        fontWeight: '800',
    },

    date: {
        fontSize: 13,
        marginBottom: 7,
    },

    total: {
        fontSize: 17,
        fontWeight: '800',
    },

})