// app/order-again.jsx

import React, { useState } from 'react'

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Alert,
} from 'react-native'

import { useAppTheme } from '../context/ThemeContext'
import Colors from '../constans/Colors'
import ThemeView from '../components/ThemeView'
import BottomNavBar from '../components/BottomNavBar'


const OrderAgain = () => {

    // =====================================================
    // THEME
    // =====================================================

    const { colorScheme } = useAppTheme()

    const theme =
        Colors[colorScheme] || Colors.light


    // =====================================================
    // STATE
    // =====================================================

    const [selectedFilter, setSelectedFilter] =
        useState('All')


    // =====================================================
    // SAMPLE ORDERS
    // =====================================================
    // Later you can replace this with API / AsyncStorage data.

    const orders = [
        {
            id: '#ORD-1024',
            date: '28 Aug 2026',
            status: 'Delivered',
            statusColor: theme.orderDelivered,
            statusBackground: theme.orderDeliveredBg,

            products: [
                {
                    name: 'Wireless Headphones',
                    quantity: 1,
                    price: 2499,
                    emoji: '🎧',
                },
                {
                    name: 'USB-C Charging Cable',
                    quantity: 2,
                    price: 399,
                    emoji: '🔌',
                },
            ],

            total: 3297,
        },

        {
            id: '#ORD-1019',
            date: '21 Aug 2026',
            status: 'Delivered',
            statusColor: theme.orderDelivered,
            statusBackground: theme.orderDeliveredBg,

            products: [
                {
                    name: 'Smart Watch',
                    quantity: 1,
                    price: 3499,
                    emoji: '⌚',
                },
                {
                    name: 'Watch Strap',
                    quantity: 1,
                    price: 699,
                    emoji: '🪢',
                },
            ],

            total: 4198,
        },

        {
            id: '#ORD-1012',
            date: '15 Aug 2026',
            status: 'Delivered',
            statusColor: theme.orderDelivered,
            statusBackground: theme.orderDeliveredBg,

            products: [
                {
                    name: 'Bluetooth Speaker',
                    quantity: 1,
                    price: 1899,
                    emoji: '🔊',
                },
            ],

            total: 1899,
        },
    ]


    // =====================================================
    // FILTER
    // =====================================================

    const filters = [
        'All',
        'Recent',
        'Delivered',
    ]


    // =====================================================
    // ACTIONS
    // =====================================================

    const handleReorder = (order) => {

        Alert.alert(
            'Reorder',
            `Add ${order.products.length} item(s) from ${order.id} to your cart?`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Add to Cart',
                    onPress: () => {
                        Alert.alert(
                            'Added to Cart',
                            'The products have been added to your cart.'
                        )
                    },
                },
            ]
        )
    }


    const handleViewOrder = (order) => {

        Alert.alert(
            'Order Details',
            `${order.id}\n${order.date}\nTotal: ₹${order.total}`
        )
    }


    const handleReorderAll = () => {

        Alert.alert(
            'Reorder All',
            'Add all products from your recent orders to the cart?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Reorder All',
                    onPress: () => {
                        Alert.alert(
                            'Added to Cart',
                            'Your previous products have been added to the cart.'
                        )
                    },
                },
            ]
        )
    }


    // =====================================================
    // UI
    // =====================================================

    return (
        <ThemeView style={styles.screen}>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <View style={styles.header}>

                    <View style={styles.headerTextContainer}>

                        <Text
                            style={[
                                styles.eyebrow,
                                {
                                    color: theme.primary,
                                },
                            ]}
                        >
                            QUICK REORDER
                        </Text>


                        <Text
                            style={[
                                styles.title,
                                {
                                    color: theme.title,
                                },
                            ]}
                        >
                            Order Again
                        </Text>


                        <Text
                            style={[
                                styles.subtitle,
                                {
                                    color: theme.subtitle,
                                },
                            ]}
                        >
                            Reorder your favourite products from
                            previous purchases in just a few taps.
                        </Text>

                    </View>


                    {/* REORDER ALL */}

                    <Pressable
                        onPress={handleReorderAll}
                        style={({ pressed }) => [
                            styles.reorderAllButton,
                            {
                                backgroundColor:
                                    theme.buttonPrimary,

                                opacity:
                                    pressed ? 0.75 : 1,
                            },
                        ]}
                    >

                        <Text style={styles.reorderAllIcon}>
                            ↻
                        </Text>

                        <Text
                            style={[
                                styles.reorderAllText,
                                {
                                    color:
                                        theme.buttonPrimaryText,
                                },
                            ]}
                        >
                            Reorder All
                        </Text>

                    </Pressable>

                </View>


                {/* =================================================
                    QUICK INFO CARD
                ================================================= */}

                <View
                    style={[
                        styles.quickCard,
                        {
                            backgroundColor:
                                theme.cardHighlight,

                            borderColor:
                                theme.border,
                        },
                    ]}
                >

                    <View
                        style={[
                            styles.quickIcon,
                            {
                                backgroundColor:
                                    theme.primary,
                            },
                        ]}
                    >

                        <Text style={styles.quickIconText}>
                            ↻
                        </Text>

                    </View>


                    <View style={styles.quickContent}>

                        <Text
                            style={[
                                styles.quickTitle,
                                {
                                    color:
                                        theme.title,
                                },
                            ]}
                        >
                            Your favourites are waiting
                        </Text>


                        <Text
                            style={[
                                styles.quickText,
                                {
                                    color:
                                        theme.subtitle,
                                },
                            ]}
                        >
                            Save time by ordering products
                            you've already purchased.
                        </Text>

                    </View>

                </View>


                {/* =================================================
                    FILTERS
                ================================================= */}

                <View style={styles.filterSection}>

                    <Text
                        style={[
                            styles.sectionTitle,
                            {
                                color:
                                    theme.title,
                            },
                        ]}
                    >
                        Previous Orders
                    </Text>


                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={
                            styles.filterContainer
                        }
                    >

                        {filters.map((filter) => {

                            const isSelected =
                                selectedFilter === filter

                            return (
                                <Pressable
                                    key={filter}
                                    onPress={() =>
                                        setSelectedFilter(filter)
                                    }
                                    style={[
                                        styles.filterChip,
                                        {
                                            backgroundColor:
                                                isSelected
                                                    ? theme.chipSelected
                                                    : theme.chipBackground,

                                            borderColor:
                                                isSelected
                                                    ? theme.chipSelected
                                                    : theme.chipBorder,
                                        },
                                    ]}
                                >

                                    <Text
                                        style={[
                                            styles.filterText,
                                            {
                                                color:
                                                    isSelected
                                                        ? theme.chipSelectedText
                                                        : theme.chipText,
                                            },
                                        ]}
                                    >
                                        {filter}
                                    </Text>

                                </Pressable>
                            )

                        })}

                    </ScrollView>

                </View>


                {/* =================================================
                    ORDER CARDS
                ================================================= */}

                <View style={styles.ordersContainer}>

                    {orders.map((order) => (

                        <View
                            key={order.id}
                            style={[
                                styles.orderCard,
                                {
                                    backgroundColor:
                                        theme.card,

                                    borderColor:
                                        theme.border,
                                },
                            ]}
                        >

                            {/* -----------------------------------------
                                ORDER HEADER
                            ----------------------------------------- */}

                            <View style={styles.orderHeader}>

                                <View>

                                    <Text
                                        style={[
                                            styles.orderId,
                                            {
                                                color:
                                                    theme.title,
                                            },
                                        ]}
                                    >
                                        {order.id}
                                    </Text>


                                    <Text
                                        style={[
                                            styles.orderDate,
                                            {
                                                color:
                                                    theme.subtitle,
                                            },
                                        ]}
                                    >
                                        {order.date}
                                    </Text>

                                </View>


                                {/* STATUS */}

                                <View
                                    style={[
                                        styles.statusBadge,
                                        {
                                            backgroundColor:
                                                order.statusBackground,
                                        },
                                    ]}
                                >

                                    <View
                                        style={[
                                            styles.statusDot,
                                            {
                                                backgroundColor:
                                                    order.statusColor,
                                            },
                                        ]}
                                    />

                                    <Text
                                        style={[
                                            styles.statusText,
                                            {
                                                color:
                                                    order.statusColor,
                                            },
                                        ]}
                                    >
                                        {order.status}
                                    </Text>

                                </View>

                            </View>


                            {/* -----------------------------------------
                                PRODUCTS
                            ----------------------------------------- */}

                            <View style={styles.productsContainer}>

                                {order.products.map(
                                    (product, index) => (

                                        <View
                                            key={`${order.id}-${index}`}
                                            style={styles.productRow}
                                        >

                                            {/* PRODUCT IMAGE */}

                                            <View
                                                style={[
                                                    styles.productImage,
                                                    {
                                                        backgroundColor:
                                                            theme.imageBackground,
                                                    },
                                                ]}
                                            >

                                                <Text
                                                    style={
                                                        styles.productEmoji
                                                    }
                                                >
                                                    {product.emoji}
                                                </Text>

                                            </View>


                                            {/* PRODUCT INFO */}

                                            <View
                                                style={
                                                    styles.productInfo
                                                }
                                            >

                                                <Text
                                                    numberOfLines={1}
                                                    style={[
                                                        styles.productName,
                                                        {
                                                            color:
                                                                theme.text,
                                                        },
                                                    ]}
                                                >
                                                    {product.name}
                                                </Text>


                                                <Text
                                                    style={[
                                                        styles.productQuantity,
                                                        {
                                                            color:
                                                                theme.textMuted,
                                                        },
                                                    ]}
                                                >
                                                    Qty: {product.quantity}
                                                </Text>

                                            </View>


                                            {/* PRICE */}

                                            <Text
                                                style={[
                                                    styles.productPrice,
                                                    {
                                                        color:
                                                            theme.productPrice,
                                                    },
                                                ]}
                                            >
                                                ₹{product.price}
                                            </Text>

                                        </View>

                                    )
                                )}

                            </View>


                            {/* -----------------------------------------
                                DIVIDER
                            ----------------------------------------- */}

                            <View
                                style={[
                                    styles.divider,
                                    {
                                        backgroundColor:
                                            theme.divider,
                                    },
                                ]}
                            />


                            {/* -----------------------------------------
                                TOTAL
                            ----------------------------------------- */}

                            <View style={styles.totalRow}>

                                <Text
                                    style={[
                                        styles.totalLabel,
                                        {
                                            color:
                                                theme.subtitle,
                                        },
                                    ]}
                                >
                                    Order total
                                </Text>


                                <Text
                                    style={[
                                        styles.totalPrice,
                                        {
                                            color:
                                                theme.totalPrice,
                                        },
                                    ]}
                                >
                                    ₹{order.total}
                                </Text>

                            </View>


                            {/* -----------------------------------------
                                ACTIONS
                            ----------------------------------------- */}

                            <View style={styles.actions}>

                                {/* VIEW ORDER */}

                                <Pressable
                                    onPress={() =>
                                        handleViewOrder(order)
                                    }
                                    style={({ pressed }) => [
                                        styles.viewButton,
                                        {
                                            borderColor:
                                                theme.buttonOutline,

                                            opacity:
                                                pressed ? 0.7 : 1,
                                        },
                                    ]}
                                >

                                    <Text
                                        style={[
                                            styles.viewButtonText,
                                            {
                                                color:
                                                    theme.buttonOutlineText,
                                            },
                                        ]}
                                    >
                                        View Order
                                    </Text>

                                </Pressable>


                                {/* REORDER */}

                                <Pressable
                                    onPress={() =>
                                        handleReorder(order)
                                    }
                                    style={({ pressed }) => [
                                        styles.reorderButton,
                                        {
                                            backgroundColor:
                                                theme.buttonPrimary,

                                            opacity:
                                                pressed ? 0.75 : 1,
                                        },
                                    ]}
                                >

                                    <Text
                                        style={[
                                            styles.reorderButtonText,
                                            {
                                                color:
                                                    theme.buttonPrimaryText,
                                            },
                                        ]}
                                    >
                                        ↻  Reorder
                                    </Text>

                                </Pressable>

                            </View>

                        </View>

                    ))}

                </View>


                {/* =================================================
                    BOTTOM INFORMATION
                ================================================= */}

                <View
                    style={[
                        styles.bottomInfo,
                        {
                            backgroundColor:
                                theme.surfaceSoft,
                        },
                    ]}
                >

                    <Text
                        style={[
                            styles.bottomInfoIcon,
                            {
                                color:
                                    theme.primary,
                            },
                        ]}
                    >
                        ✓
                    </Text>


                    <Text
                        style={[
                            styles.bottomInfoText,
                            {
                                color:
                                    theme.subtitle,
                            },
                        ]}
                    >
                        Your previous orders are kept here for
                        quick and easy reordering.
                    </Text>

                </View>


            </ScrollView>


            {/* =================================================
                BOTTOM NAVIGATION
            ================================================= */}

            <BottomNavBar />

        </ThemeView>
    )
}


export default OrderAgain


// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({

    screen: {
        flex: 1,
    },


    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 110,
    },


    // =================================================
    // HEADER
    // =================================================

    header: {
        marginBottom: 20,
    },


    headerTextContainer: {
        marginBottom: 16,
    },


    eyebrow: {
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 1.5,
        marginBottom: 5,
    },


    title: {
        fontSize: 30,
        fontWeight: '800',
        marginBottom: 8,
    },


    subtitle: {
        fontSize: 14,
        lineHeight: 21,
        maxWidth: 360,
    },


    // =================================================
    // REORDER ALL
    // =================================================

    reorderAllButton: {
        minHeight: 48,
        borderRadius: 14,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

        paddingHorizontal: 18,
    },


    reorderAllIcon: {
        color: '#FFFFFF',
        fontSize: 21,
        fontWeight: '700',
        marginRight: 8,
    },


    reorderAllText: {
        fontSize: 14,
        fontWeight: '800',
    },


    // =================================================
    // QUICK CARD
    // =================================================

    quickCard: {
        borderWidth: 1,
        borderRadius: 18,

        padding: 16,

        flexDirection: 'row',
        alignItems: 'center',

        marginBottom: 28,
    },


    quickIcon: {
        width: 48,
        height: 48,
        borderRadius: 15,

        alignItems: 'center',
        justifyContent: 'center',

        marginRight: 13,
    },


    quickIconText: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: '700',
    },


    quickContent: {
        flex: 1,
    },


    quickTitle: {
        fontSize: 15,
        fontWeight: '800',
        marginBottom: 3,
    },


    quickText: {
        fontSize: 12,
        lineHeight: 18,
    },


    // =================================================
    // FILTER
    // =================================================

    filterSection: {
        marginBottom: 18,
    },


    sectionTitle: {
        fontSize: 19,
        fontWeight: '800',
        marginBottom: 12,
    },


    filterContainer: {
        paddingRight: 10,
    },


    filterChip: {
        minHeight: 36,

        paddingHorizontal: 17,

        borderRadius: 20,
        borderWidth: 1,

        alignItems: 'center',
        justifyContent: 'center',

        marginRight: 8,
    },


    filterText: {
        fontSize: 12,
        fontWeight: '700',
    },


    // =================================================
    // ORDERS
    // =================================================

    ordersContainer: {
        gap: 16,
    },


    orderCard: {
        borderWidth: 1,
        borderRadius: 20,

        padding: 16,
    },


    // =================================================
    // ORDER HEADER
    // =================================================

    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',

        marginBottom: 16,
    },


    orderId: {
        fontSize: 15,
        fontWeight: '800',
        marginBottom: 4,
    },


    orderDate: {
        fontSize: 12,
    },


    statusBadge: {
        minHeight: 30,

        paddingHorizontal: 10,

        borderRadius: 20,

        flexDirection: 'row',
        alignItems: 'center',
    },


    statusDot: {
        width: 7,
        height: 7,

        borderRadius: 10,

        marginRight: 6,
    },


    statusText: {
        fontSize: 11,
        fontWeight: '800',
    },


    // =================================================
    // PRODUCTS
    // =================================================

    productsContainer: {
        gap: 12,
    },


    productRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },


    productImage: {
        width: 54,
        height: 54,

        borderRadius: 14,

        alignItems: 'center',
        justifyContent: 'center',

        marginRight: 12,
    },


    productEmoji: {
        fontSize: 25,
    },


    productInfo: {
        flex: 1,
        paddingRight: 8,
    },


    productName: {
        fontSize: 13,
        fontWeight: '700',
        marginBottom: 4,
    },


    productQuantity: {
        fontSize: 11,
    },


    productPrice: {
        fontSize: 13,
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
    // TOTAL
    // =================================================

    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        marginBottom: 15,
    },


    totalLabel: {
        fontSize: 12,
    },


    totalPrice: {
        fontSize: 18,
        fontWeight: '900',
    },


    // =================================================
    // ACTIONS
    // =================================================

    actions: {
        flexDirection: 'row',
        gap: 10,
    },


    viewButton: {
        flex: 1,

        minHeight: 44,

        borderRadius: 13,
        borderWidth: 1,

        alignItems: 'center',
        justifyContent: 'center',
    },


    viewButtonText: {
        fontSize: 12,
        fontWeight: '800',
    },


    reorderButton: {
        flex: 1,

        minHeight: 44,

        borderRadius: 13,

        alignItems: 'center',
        justifyContent: 'center',
    },


    reorderButtonText: {
        fontSize: 12,
        fontWeight: '800',
    },


    // =================================================
    // BOTTOM INFO
    // =================================================

    bottomInfo: {
        marginTop: 20,

        borderRadius: 15,

        padding: 14,

        flexDirection: 'row',
        alignItems: 'center',
    },


    bottomInfoIcon: {
        fontSize: 18,
        fontWeight: '900',

        marginRight: 9,
    },


    bottomInfoText: {
        flex: 1,

        fontSize: 11,
        lineHeight: 17,
    },

})