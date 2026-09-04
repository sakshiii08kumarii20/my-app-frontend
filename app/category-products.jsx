
// app/category-products.jsx

import React from 'react'

import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Pressable,
    ActivityIndicator,
} from 'react-native'

import { Ionicons } from '@expo/vector-icons'

import {
    useLocalSearchParams,
    useRouter,
} from 'expo-router'

import { useAppTheme } from '../context/ThemeContext'
import Colors from '../constans/Colors'

import { useProducts } from '../context/ProductContext'

import ProductCard from '../components/ProductCard'
import ThemeView from '../components/ThemeView'
import BottomNavBar from '../components/BottomNavBar'


const CategoryProducts = () => {

    // =========================================================
    // ROUTER
    // =========================================================

    const router = useRouter()

    const params = useLocalSearchParams()

    const category = params.category


    // =========================================================
    // NORMALIZE CATEGORY
    // =========================================================

    const categoryName = React.useMemo(() => {

        const value = Array.isArray(category)
            ? category[0]
            : category

        if (!value) {
            return ''
        }

        try {

            return decodeURIComponent(
                String(value)
            )
                .trim()
                .toLowerCase()
                .replace(/[-_]+/g, ' ')
                .replace(/\s+/g, ' ')

        } catch {

            return String(value)
                .trim()
                .toLowerCase()
                .replace(/[-_]+/g, ' ')
                .replace(/\s+/g, ' ')

        }

    }, [category])


    // =========================================================
    // THEME
    // =========================================================

    const { colorScheme } = useAppTheme()

    const currentScheme =
        colorScheme === 'dark'
            ? 'dark'
            : 'light'

    const theme =
        Colors[currentScheme] ||
        Colors.light


    // =========================================================
    // PRODUCTS
    // =========================================================

    const {
        products: allProducts,
        loading,
        error,
        refreshProducts,
    } = useProducts()


    // =========================================================
    // FILTER PRODUCTS
    // =========================================================

    const products = React.useMemo(() => {

        if (!Array.isArray(allProducts)) {
            return []
        }

        // If no category exists,
        // show all products.
        if (!categoryName) {
            return allProducts
        }

        return allProducts.filter((product) => {

            if (!product?.category) {
                return false
            }

            const normalizedProductCategory =
                String(product.category)
                    .trim()
                    .toLowerCase()
                    .replace(/[-_]+/g, ' ')
                    .replace(/\s+/g, ' ')

            return (
                normalizedProductCategory ===
                categoryName
            )

        })

    }, [
        allProducts,
        categoryName,
    ])


    // =========================================================
    // DEBUG
    // =========================================================

    React.useEffect(() => {

        console.log(
            '================================'
        )

        console.log(
            'CATEGORY SCREEN:',
            category
        )

        console.log(
            'CATEGORY NORMALIZED:',
            categoryName
        )

        console.log(
            'ALL PRODUCTS:',
            allProducts?.length || 0
        )

        console.log(
            'FILTERED PRODUCTS:',
            products.length
        )

        console.log(
            'FILTERED PRODUCT NAMES:',
            products.map(
                (product) => product.name
            )
        )

        console.log(
            '================================'
        )

    }, [
        category,
        categoryName,
        allProducts,
        products,
    ])


    // =========================================================
    // PRODUCT CARD
    // =========================================================

    const renderProduct = ({
        item,
    }) => {

        return (

            <Pressable
                onPress={() =>
                    router.push(
                        `/product/${item.id}`
                    )
                }
                style={({ pressed }) => [

                    styles.productWrapper,

                    {
                        opacity:
                            pressed
                                ? 0.92
                                : 1,

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

                <ProductCard
                    item={item}
                    theme={theme}
                    cardWidth={165}
                />

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
                        {Array.isArray(category)
                            ? category[0]
                            : category ||
                              'Products'}
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
                error && (

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
                                refreshProducts
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
                !error && (

                    <FlatList
                        data={products}

                        keyExtractor={(item, index) =>
                            String(
                                item?.id ??
                                item?.product_id ??
                                index
                            )
                        }

                        renderItem={
                            renderProduct
                        }

                        numColumns={2}

                        columnWrapperStyle={
                            products.length > 1
                                ? styles.row
                                : undefined
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
        padding: 16,
        paddingBottom: 120,
    },


    row: {
        justifyContent: 'space-between',

        marginBottom: 14,
    },


    productWrapper: {
        width: '48%',
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

        marginTop: 30,
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

