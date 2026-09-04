// app/categories.jsx

import React, {
   
    useMemo,
    useState,
} from 'react'

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    Pressable,
    ActivityIndicator,
} from 'react-native'

import { Ionicons } from '@expo/vector-icons'

import { useRouter } from 'expo-router'

import { useAppTheme } from '../context/ThemeContext'
import Colors from '../constans/Colors'

import { useProducts } from '../context/ProductContext'

import ThemeView from '../components/ThemeView'
import BottomNavBar from '../components/BottomNavBar'


const Categories = () => {

    // =========================================================
    // ROUTER
    // =========================================================

    const router = useRouter()


    // =========================================================
    // THEME
    // =========================================================

    const { colorScheme } = useAppTheme()

    const currentScheme =
        colorScheme === 'dark'
            ? 'dark'
            : 'light'

    const theme =
        Colors[currentScheme] || Colors.light


    // =========================================================
    // STATE
    // =========================================================

        

    const [search, setSearch] =
        useState('')

    const {
    products,
    loading,
    error,
    refreshProducts,
} = useProducts()
   


    // =========================================================
    // CREATE CATEGORIES FROM REAL PRODUCTS
    // =========================================================

    const categories = useMemo(() => {

        const categoryMap = {}

        products.forEach((product) => {

            const category =
                product.category?.trim() ||
                'Other'

            if (!categoryMap[category]) {

                categoryMap[category] = {
                    name: category,
                    count: 0,
                }

            }

            categoryMap[category].count += 1

        })


        return Object.values(categoryMap)
            .sort((a, b) =>
                b.count - a.count
            )

    }, [products])


    // =========================================================
    // SEARCH CATEGORIES
    // =========================================================

    const filteredCategories =
        categories.filter((category) =>
            category.name
                .toLowerCase()
                .includes(
                    search.toLowerCase()
                )
        )


    // =========================================================
    // CATEGORY ICON
    // =========================================================

    const getCategoryIcon = (name) => {

        const value =
            name.toLowerCase()


        if (
            value.includes('shoe') ||
            value.includes('foot') ||
            value.includes('sport')
        ) {

            return 'footsteps-outline'

        }


        if (
            value.includes('cloth') ||
            value.includes('shirt') ||
            value.includes('fashion') ||
            value.includes('wear') ||
            value.includes('pant')
        ) {

            return 'shirt-outline'

        }


        if (
            value.includes('bag') ||
            value.includes('kit')
        ) {

            return 'briefcase-outline'

        }


        if (
            value.includes('bridal') ||
            value.includes('jewel')
        ) {

            return 'sparkles-outline'

        }


        if (
            value.includes('book') ||
            value.includes('station')
        ) {

            return 'book-outline'

        }


        if (
            value.includes('home') ||
            value.includes('furniture')
        ) {

            return 'home-outline'

        }


        if (
            value.includes('elect') ||
            value.includes('mobile') ||
            value.includes('phone')
        ) {

            return 'phone-portrait-outline'

        }


        if (
            value.includes('beauty') ||
            value.includes('cosmetic')
        ) {

            return 'sparkles-outline'

        }


        return 'grid-outline'

    }


    // =========================================================
    // CATEGORY PRESS
    // =========================================================

    const handleCategoryPress =
        (categoryName) => {

            router.push({
                pathname: '/category-products',
                params: {
                    category: categoryName,
                },
            })

        }


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

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={
                    styles.scrollContent
                }
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <View
                    style={styles.header}
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
                        SHOP BY CATEGORY
                    </Text>


                    <Text
                        style={[
                            styles.title,
                            {
                                color:
                                    theme.title,
                            },
                        ]}
                    >
                        Categories
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
                        Explore our products by
                        category and find what you need.
                    </Text>

                </View>


                {/* =================================================
                    SEARCH
                ================================================= */}

                <View
                    style={[
                        styles.searchBox,
                        {
                            backgroundColor:
                                theme.inputBackground,

                            borderColor:
                                theme.inputBorder,
                        },
                    ]}
                >

                    <Ionicons
                        name="search-outline"
                        size={20}
                        color={
                            theme.inputPlaceholder
                        }
                    />


                    <TextInput
                        value={search}
                        onChangeText={
                            setSearch
                        }
                        placeholder="Search categories..."
                        placeholderTextColor={
                            theme.inputPlaceholder
                        }
                        style={[
                            styles.searchInput,
                            {
                                color:
                                    theme.inputText,
                            },
                        ]}
                    />


                    {search.length > 0 && (

                        <Pressable
                            onPress={() =>
                                setSearch('')
                            }
                        >

                            <Ionicons
                                name="close-circle"
                                size={20}
                                color={
                                    theme.inputPlaceholder
                                }
                            />

                        </Pressable>

                    )}

                </View>


                {/* =================================================
                    SUMMARY
                ================================================= */}

                <View
                    style={styles.summaryRow}
                >

                    <View>

                        <Text
                            style={[
                                styles.sectionTitle,
                                {
                                    color:
                                        theme.title,
                                },
                            ]}
                        >
                            Browse Categories
                        </Text>


                        <Text
                            style={[
                                styles.summaryText,
                                {
                                    color:
                                        theme.textMuted,
                                },
                            ]}
                        >
                            {categories.length}{' '}
                            categories • {' '}
                            {products.length}{' '}
                            products
                        </Text>

                    </View>

                </View>


                {/* =================================================
                    LOADING
                ================================================= */}

                {loading && (

                    <View
                        style={
                            styles.loadingContainer
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
                            Loading categories...
                        </Text>

                    </View>

                )}


                {/* =================================================
                    ERROR
                ================================================= */}

                {!loading &&
                    error  && (

                        <View
                            style={[
                                styles.messageCard,
                                {
                                    backgroundColor:
                                        theme.card,

                                    borderColor:
                                        theme.border,
                                },
                            ]}
                        >

                            <Ionicons
                                name="alert-circle-outline"
                                size={36}
                                color={
                                    theme.accent
                                }
                            />


                            <Text
                                style={[
                                    styles.messageTitle,
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
                                    styles.messageText,
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
                    CATEGORY GRID
                ================================================= */}

                {!loading &&
                    !error && (

                        <View
                            style={
                                styles.grid
                            }
                        >

                            {filteredCategories.map(
                                (category) => (

                                    <Pressable
                                        key={
                                            category.name
                                        }

                                        onPress={() =>
                                            handleCategoryPress(
                                                category.name
                                            )
                                        }

                                        style={({
                                            pressed,
                                        }) => [

                                            styles.card,

                                            {
                                                backgroundColor:
                                                    theme.card,

                                                borderColor:
                                                    theme.border,

                                                transform: [
                                                    {
                                                        scale:
                                                            pressed
                                                                ? 0.97
                                                                : 1,
                                                    },
                                                ],
                                            },

                                        ]}
                                    >

                                        {/* =================================================
                                            ICON
                                        ================================================= */}

                                        <View
                                            style={[
                                                styles.iconContainer,
                                                {
                                                    backgroundColor:
                                                        theme.uiBackground,
                                                },
                                            ]}
                                        >

                                            <Ionicons
                                                name={
                                                    getCategoryIcon(
                                                        category.name
                                                    )
                                                }
                                                size={25}
                                                color={
                                                    theme.primary
                                                }
                                            />

                                        </View>


                                        {/* =================================================
                                            NAME
                                        ================================================= */}

                                        <Text
                                            numberOfLines={
                                                2
                                            }
                                            style={[
                                                styles.cardTitle,
                                                {
                                                    color:
                                                        theme.title,
                                                },
                                            ]}
                                        >
                                            {
                                                category.name
                                            }
                                        </Text>


                                        {/* =================================================
                                            COUNT
                                        ================================================= */}

                                        <Text
                                            style={[
                                                styles.cardCount,
                                                {
                                                    color:
                                                        theme.textMuted,
                                                },
                                            ]}
                                        >
                                            {
                                                category.count
                                            }{' '}
                                            {
                                                category.count === 1
                                                    ? 'product'
                                                    : 'products'
                                            }
                                        </Text>


                                        {/* =================================================
                                            ARROW
                                        ================================================= */}

                                        <View
                                            style={
                                                styles.arrow
                                            }
                                        >

                                            <Ionicons
                                                name="arrow-forward"
                                                size={16}
                                                color={
                                                    theme.textMuted
                                                }
                                            />

                                        </View>

                                    </Pressable>

                                )
                            )}

                        </View>

                    )}

            </ScrollView>


            {/* =================================================
                BOTTOM NAVIGATION
            ================================================= */}

            <BottomNavBar />

        </ThemeView>
    )
}


export default Categories


// =============================================================
// STYLES
// =============================================================

const styles = StyleSheet.create({

    screen: {
        flex: 1,
    },


    scrollContent: {
        padding: 20,
        paddingBottom: 120,
    },


    // =========================================================
    // HEADER
    // =========================================================

    header: {
        marginBottom: 20,
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
    },


    // =========================================================
    // SEARCH
    // =========================================================

    searchBox: {
        height: 50,

        borderWidth: 1,
        borderRadius: 15,

        flexDirection: 'row',
        alignItems: 'center',

        paddingHorizontal: 14,

        marginBottom: 24,
    },


    searchInput: {
        flex: 1,

        fontSize: 13,

        marginLeft: 10,

        paddingVertical: 0,
    },


    // =========================================================
    // SUMMARY
    // =========================================================

    summaryRow: {
        marginBottom: 15,
    },


    sectionTitle: {
        fontSize: 19,
        fontWeight: '800',
    },


    summaryText: {
        fontSize: 11,
        marginTop: 4,
    },


    // =========================================================
    // GRID
    // =========================================================

    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',

        justifyContent: 'space-between',

        gap: 12,
    },


    card: {
        width: '48.2%',

        minHeight: 160,

        borderWidth: 1,
        borderRadius: 18,

        padding: 15,

        position: 'relative',
    },


    iconContainer: {
        width: 50,
        height: 50,

        borderRadius: 15,

        alignItems: 'center',
        justifyContent: 'center',

        marginBottom: 14,
    },


    cardTitle: {
        fontSize: 14,
        fontWeight: '800',

        marginBottom: 5,

        paddingRight: 15,
    },


    cardCount: {
        fontSize: 11,
    },


    arrow: {
        position: 'absolute',

        right: 13,
        bottom: 13,
    },


    // =========================================================
    // LOADING
    // =========================================================

    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',

        paddingVertical: 60,
    },


    loadingText: {
        fontSize: 12,

        marginTop: 12,
    },


    // =========================================================
    // ERROR
    // =========================================================

    messageCard: {
        borderWidth: 1,
        borderRadius: 18,

        padding: 25,

        alignItems: 'center',
        justifyContent: 'center',
    },


    messageTitle: {
        fontSize: 16,
        fontWeight: '800',

        marginTop: 10,
        marginBottom: 5,
    },


    messageText: {
        fontSize: 12,

        textAlign: 'center',

        lineHeight: 18,
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