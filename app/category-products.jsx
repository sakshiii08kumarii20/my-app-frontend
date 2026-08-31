// app/category-products.jsx

import React, { useEffect, useState } from 'react'

import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Pressable,
    ActivityIndicator,
} from 'react-native'

import { Ionicons } from '@expo/vector-icons'

import { useLocalSearchParams, useRouter } from 'expo-router'

import { useAppTheme } from '../context/ThemeContext'
import Colors from '../constans/Colors'

import { fetchProducts } from '../constans/api'

import ThemeView from '../components/ThemeView'
import BottomNavBar from '../components/BottomNavBar'


const CategoryProducts = () => {

    // =========================================================
    // ROUTER
    // =========================================================

    const router = useRouter()

    const { category } =
        useLocalSearchParams()


    // =========================================================
    // THEME
    // =========================================================

    const { colorScheme } =
        useAppTheme()

    const currentScheme =
        colorScheme === 'dark'
            ? 'dark'
            : 'light'

    const theme =
        Colors[currentScheme] ||
        Colors.light


    // =========================================================
    // STATE
    // =========================================================

    const [products, setProducts] =
        useState([])

    const [loading, setLoading] =
        useState(true)

    const [error, setError] =
        useState('')


    // =========================================================
    // LOAD PRODUCTS
    // =========================================================

    useEffect(() => {

        loadProducts()

    }, [])


    const loadProducts = async () => {

        try {

            setLoading(true)
            setError('')

            const data =
                await fetchProducts()

            const categoryName =
                Array.isArray(category)
                    ? category[0]
                    : category

            const filtered =
                (data || []).filter(
                    (product) =>
                        (
                            product.category ||
                            'Other'
                        ).trim() ===
                        categoryName
                )

            setProducts(filtered)

        } catch (err) {

            console.error(
                'Category products error:',
                err
            )

            setError(
                'Unable to load products.'
            )

        } finally {

            setLoading(false)

        }
    }


    // =========================================================
    // PRODUCT CARD
    // =========================================================

    const renderProduct = ({ item }) => {

        const discount =
            item.mrp > item.price
                ? Math.round(
                    (
                        (item.mrp - item.price) /
                        item.mrp
                    ) * 100
                )
                : 0


        return (

            <Pressable
                onPress={() =>
                    router.push(
                        `/product/${item.id}`
                    )
                }
                style={({ pressed }) => [

                    styles.productCard,

                    {
                        backgroundColor:
                            theme.card,

                        borderColor:
                            theme.border,

                        transform: [
                            {
                                scale:
                                    pressed
                                        ? 0.98
                                        : 1,
                            },
                        ],
                    },
                ]}
            >

                {/* =================================================
                    PRODUCT ICON / IMAGE AREA
                ================================================= */}

                <View
                    style={[
                        styles.productImage,
                        {
                            backgroundColor:
                                theme.surfaceSoft,
                        },
                    ]}
                >

                    <Ionicons
                        name="cube-outline"
                        size={42}
                        color={
                            theme.primary
                        }
                    />

                </View>


                {/* =================================================
                    PRODUCT INFO
                ================================================= */}

                <View
                    style={
                        styles.productInfo
                    }
                >

                    <Text
                        numberOfLines={2}
                        style={[
                            styles.productName,
                            {
                                color:
                                    theme.title,
                            },
                        ]}
                    >
                        {item.name}
                    </Text>


                    {/* PRICE */}

                    <View
                        style={
                            styles.priceRow
                        }
                    >

                        <Text
                            style={[
                                styles.price,
                                {
                                    color:
                                        theme.primary,
                                },
                            ]}
                        >
                            ₹{item.price}
                        </Text>


                        {item.mrp >
                            item.price && (

                            <Text
                                style={[
                                    styles.mrp,
                                    {
                                        color:
                                            theme.textMuted,
                                    },
                                ]}
                            >
                                ₹{item.mrp}
                            </Text>

                        )}

                    </View>


                    {/* DISCOUNT */}

                    {discount > 0 && (

                        <View
                            style={[
                                styles.discountBadge,
                                {
                                    backgroundColor:
                                        theme.primary,
                                },
                            ]}
                        >

                            <Text
                                style={
                                    styles.discountText
                                }
                            >
                                {discount}% OFF
                            </Text>

                        </View>

                    )}


                    {/* UNIT */}

                    {item.unit && (

                        <Text
                            style={[
                                styles.unit,
                                {
                                    color:
                                        theme.subtitle,
                                },
                            ]}
                        >
                            {item.unit}
                        </Text>

                    )}

                </View>


                {/* ARROW */}

                <View
                    style={[
                        styles.arrowButton,
                        {
                            backgroundColor:
                                theme.uiBackground,
                        },
                    ]}
                >

                    <Ionicons
                        name="arrow-forward"
                        size={17}
                        color={
                            theme.primary
                        }
                    />

                </View>

            </Pressable>

        )
    }


    // =========================================================
    // EMPTY STATE
    // =========================================================

    const EmptyState = () => (

        <View
            style={[
                styles.emptyCard,
                {
                    backgroundColor:
                        theme.card,

                    borderColor:
                        theme.border,
                },
            ]}
        >

            <Ionicons
                name="cube-outline"
                size={45}
                color={
                    theme.textMuted
                }
            />


            <Text
                style={[
                    styles.emptyTitle,
                    {
                        color:
                            theme.title,
                    },
                ]}
            >
                No products found
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
                There are no products available
                in this category.
            </Text>

        </View>

    )


    // =========================================================
    // UI
    // =========================================================

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

            {/* =================================================
                HEADER
            ================================================= */}

            <View
                style={[
                    styles.header,
                    {
                        borderBottomColor:
                            theme.border,
                    },
                ]}
            >

                <Pressable
                    onPress={() =>
                        router.back()
                    }
                    style={
                        styles.backButton
                    }
                >

                    <Ionicons
                        name="arrow-back"
                        size={23}
                        color={
                            theme.title
                        }
                    />

                </Pressable>


                <View
                    style={
                        styles.headerText
                    }
                >

                    <Text
                        style={[
                            styles.eyebrow,
                            {
                                color:
                                    theme.primary,
                            },
                        ]}
                    >
                        CATEGORY
                    </Text>


                    <Text
                        numberOfLines={1}
                        style={[
                            styles.title,
                            {
                                color:
                                    theme.title,
                            },
                        ]}
                    >
                        {category || 'Products'}
                    </Text>


                    {!loading && (

                        <Text
                            style={[
                                styles.count,
                                {
                                    color:
                                        theme.subtitle,
                                },
                            ]}
                        >
                            {products.length}{' '}
                            {products.length === 1
                                ? 'product'
                                : 'products'}
                        </Text>

                    )}

                </View>

            </View>


            {/* =================================================
                LOADING
            ================================================= */}

            {loading && (

                <View
                    style={
                        styles.loading
                    }
                >

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
                        Loading products...
                    </Text>

                </View>

            )}


            {/* =================================================
                ERROR
            ================================================= */}

            {!loading &&
                error !== '' && (

                    <View
                        style={
                            styles.center
                        }
                    >

                        <Ionicons
                            name="alert-circle-outline"
                            size={45}
                            color={
                                theme.primary
                            }
                        />

                        <Text
                            style={[
                                styles.emptyTitle,
                                {
                                    color:
                                        theme.title,
                                },
                            ]}
                        >
                            Something went wrong
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
                            {error}
                        </Text>


                        <Pressable
                            onPress={
                                loadProducts
                            }
                            style={[
                                styles.retryButton,
                                {
                                    backgroundColor:
                                        theme.primary,
                                },
                            ]}
                        >

                            <Text
                                style={
                                    styles.retryText
                                }
                            >
                                Try Again
                            </Text>

                        </Pressable>

                    </View>

                )}


            {/* =================================================
                PRODUCTS
            ================================================= */}

            {!loading &&
                error === '' && (

                    <FlatList
                        data={products}
                        keyExtractor={(item) =>
                            String(item.id)
                        }
                        renderItem={
                            renderProduct
                        }
                        numColumns={2}
                        columnWrapperStyle={
                            styles.row
                        }
                        contentContainerStyle={[
                            styles.list,
                            products.length === 0 &&
                                styles.emptyList,
                        ]}
                        showsVerticalScrollIndicator={
                            false
                        }
                        ListEmptyComponent={
                            EmptyState
                        }
                    />

                )}


            {/* =================================================
                BOTTOM NAV
            ================================================= */}

            <BottomNavBar />

        </ThemeView>

    )
}


export default CategoryProducts


// =============================================================
// STYLES
// =============================================================

const styles = StyleSheet.create({

    screen: {
        flex: 1,
    },


    // =========================================================
    // HEADER
    // =========================================================

    header: {
        flexDirection: 'row',

        alignItems: 'center',

        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 15,

        borderBottomWidth: 1,
    },


    backButton: {
        width: 42,
        height: 42,

        borderRadius: 21,

        alignItems: 'center',
        justifyContent: 'center',

        marginRight: 10,
    },


    headerText: {
        flex: 1,
    },


    eyebrow: {
        fontSize: 10,
        fontWeight: '800',

        letterSpacing: 1.5,

        marginBottom: 3,
    },


    title: {
        fontSize: 25,
        fontWeight: '800',
    },


    count: {
        fontSize: 11,

        marginTop: 3,
    },


    // =========================================================
    // PRODUCT LIST
    // =========================================================

    list: {
        padding: 20,
        paddingBottom: 120,
    },


    row: {
        justifyContent: 'space-between',

        marginBottom: 14,
    },


    productCard: {
        width: '48%',

        borderWidth: 1,
        borderRadius: 18,

        overflow: 'hidden',
    },


    productImage: {
        height: 125,

        alignItems: 'center',
        justifyContent: 'center',
    },


    productInfo: {
        padding: 12,
        paddingBottom: 15,
    },


    productName: {
        fontSize: 14,
        fontWeight: '800',

        lineHeight: 19,

        minHeight: 38,
    },


    priceRow: {
        flexDirection: 'row',

        alignItems: 'center',

        marginTop: 8,
    },


    price: {
        fontSize: 16,
        fontWeight: '800',
    },


    mrp: {
        fontSize: 11,

        textDecorationLine:
            'line-through',

        marginLeft: 7,
    },


    discountBadge: {
        alignSelf: 'flex-start',

        borderRadius: 6,

        paddingHorizontal: 6,
        paddingVertical: 3,

        marginTop: 7,
    },


    discountText: {
        color: '#FFFFFF',

        fontSize: 8,
        fontWeight: '800',
    },


    unit: {
        fontSize: 10,

        marginTop: 6,
    },


    arrowButton: {
        position: 'absolute',

        right: 9,
        bottom: 9,

        width: 30,
        height: 30,

        borderRadius: 15,

        alignItems: 'center',
        justifyContent: 'center',
    },


    // =========================================================
    // LOADING
    // =========================================================

    loading: {
        flex: 1,

        alignItems: 'center',
        justifyContent: 'center',
    },


    loadingText: {
        fontSize: 12,

        marginTop: 12,
    },


    // =========================================================
    // EMPTY
    // =========================================================

    emptyList: {
        flexGrow: 1,
    },


    emptyCard: {
        borderWidth: 1,
        borderRadius: 18,

        padding: 30,

        alignItems: 'center',
        justifyContent: 'center',
    },


    emptyTitle: {
        fontSize: 17,
        fontWeight: '800',

        marginTop: 12,
    },


    emptyText: {
        fontSize: 12,

        lineHeight: 18,

        textAlign: 'center',

        marginTop: 6,
    },


    center: {
        flex: 1,

        alignItems: 'center',
        justifyContent: 'center',

        padding: 30,
    },


    retryButton: {
        marginTop: 18,

        paddingHorizontal: 20,
        paddingVertical: 10,

        borderRadius: 12,
    },


    retryText: {
        color: '#FFFFFF',

        fontSize: 12,
        fontWeight: '700',
    },

})