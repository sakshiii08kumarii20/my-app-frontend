import { useState, useEffect, useMemo } from 'react'

import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Modal,
    ActivityIndicator,
} from 'react-native'

import {
    useLocalSearchParams,
    Link,
    useRouter,
} from 'expo-router'

import { Ionicons } from '@expo/vector-icons'

import Colors from '../constans/Colors'

import { fetchProducts } from '../constans/api'

import { useAppTheme } from '../context/ThemeContext'

import ThemeView from '../components/ThemeView'
import ProductCard from '../components/ProductCard'


/* =========================================================
   SORT OPTIONS
========================================================= */

const SORT_OPTIONS = [
    {
        key: 'relevance',
        label: 'Relevance',
    },
    {
        key: 'price_low',
        label: 'Price: Low to High',
    },
    {
        key: 'price_high',
        label: 'Price: High to Low',
    },
    {
        key: 'rating',
        label: 'Rating',
    },
]


/* =========================================================
   PRICE RANGES
========================================================= */

const PRICE_RANGES = [
    {
        key: 'all',
        label: 'Any Price',
        min: 0,
        max: Infinity,
    },
    {
        key: 'under50',
        label: 'Under ₹50',
        min: 0,
        max: 50,
    },
    {
        key: '50to100',
        label: '₹50–100',
        min: 50,
        max: 100,
    },
    {
        key: '100to250',
        label: '₹100–250',
        min: 100,
        max: 250,
    },
    {
        key: 'above250',
        label: 'Above ₹250',
        min: 250,
        max: Infinity,
    },
]


/* =========================================================
   SEARCH SCREEN
========================================================= */

const Search = () => {

    const params =
        useLocalSearchParams()

    const router =
        useRouter()

    const { colorScheme } =
        useAppTheme()


    const theme =
        Colors[colorScheme] ||
        Colors.light


    /* =====================================================
       STATE
    ===================================================== */

    const [query, setQuery] =
        useState(
            String(params.q || '')
        )

    const [products, setProducts] =
        useState([])

    const [loading, setLoading] =
        useState(true)

    const [category, setCategory] =
        useState('All')

    const [priceRange, setPriceRange] =
        useState('all')

    const [sort, setSort] =
        useState('relevance')

    const [sortModalOpen, setSortModalOpen] =
        useState(false)


    /* =====================================================
       LOAD PRODUCTS
    ===================================================== */

    useEffect(() => {

        let mounted = true

        const loadProducts = async () => {

            try {

                setLoading(true)

                const data =
                    await fetchProducts()

                if (mounted) {

                    setProducts(
                        Array.isArray(data)
                            ? data
                            : []
                    )

                }

            } catch (error) {

                console.log(
                    'SEARCH PRODUCTS ERROR:',
                    error
                )

                if (mounted) {
                    setProducts([])
                }

            } finally {

                if (mounted) {
                    setLoading(false)
                }

            }
        }

        loadProducts()

        return () => {
            mounted = false
        }

    }, [])


    /* =====================================================
       CATEGORIES FROM PRODUCTS
    ===================================================== */

    const categories =
        useMemo(() => {

            const values =
                products
                    .map(
                        (product) =>
                            product.category
                    )
                    .filter(Boolean)

            return [
                'All',
                ...Array.from(
                    new Set(values)
                ),
            ]

        }, [products])


    /* =====================================================
       FILTER + SORT
    ===================================================== */

    const results =
        useMemo(() => {

            const range =
                PRICE_RANGES.find(
                    (item) =>
                        item.key ===
                        priceRange
                ) ||
                PRICE_RANGES[0]


            const searchText =
                String(query)
                    .trim()
                    .toLowerCase()


            let list =
                products.filter(
                    (product) => {

                        const productName =
                            String(
                                product.name ||
                                ''
                            ).toLowerCase()


                        const productSku =
                            String(
                                product.sku ||
                                ''
                            ).toLowerCase()


                        const productCategory =
                            String(
                                product.category ||
                                ''
                            ).toLowerCase()


                        const matchesQuery =
                            searchText === '' ||
                            productName.includes(
                                searchText
                            ) ||
                            productSku.includes(
                                searchText
                            ) ||
                            productCategory.includes(
                                searchText
                            )


                        const matchesCategory =
                            category === 'All' ||
                            product.category ===
                                category


                        const productPrice =
                            Number(
                                product.price ||
                                0
                            )


                        const matchesPrice =
                            productPrice >=
                                range.min &&
                            productPrice <=
                                range.max


                        return (
                            matchesQuery &&
                            matchesCategory &&
                            matchesPrice
                        )
                    }
                )


            /* PRICE LOW */

            if (
                sort ===
                'price_low'
            ) {

                list =
                    [...list].sort(
                        (a, b) =>
                            Number(
                                a.price || 0
                            ) -
                            Number(
                                b.price || 0
                            )
                    )
            }


            /* PRICE HIGH */

            if (
                sort ===
                'price_high'
            ) {

                list =
                    [...list].sort(
                        (a, b) =>
                            Number(
                                b.price || 0
                            ) -
                            Number(
                                a.price || 0
                            )
                    )
            }


            /* RATING */

            if (
                sort ===
                'rating'
            ) {

                list =
                    [...list].sort(
                        (a, b) =>
                            Number(
                                b.rating || 0
                            ) -
                            Number(
                                a.rating || 0
                            )
                    )
            }


            return list

        }, [
            products,
            query,
            category,
            priceRange,
            sort,
        ])


    /* =====================================================
       SORT LABEL
    ===================================================== */

    const activeSortLabel =
        SORT_OPTIONS.find(
            (item) =>
                item.key === sort
        )?.label ||
        'Relevance'


    /* =====================================================
       UI
    ===================================================== */

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
                SEARCH HEADER
            ================================================= */}

            <View
                style={
                    styles.topRow
                }
            >

                <TouchableOpacity
                    onPress={() =>
                        router.back()
                    }
                    style={
                        styles.backButton
                    }
                    activeOpacity={0.7}
                >

                    <Ionicons
                        name="arrow-back"
                        size={22}
                        color={
                            theme.headerIcon ||
                            theme.text
                        }
                    />

                </TouchableOpacity>


                <View
                    style={[
                        styles.searchBar,
                        {
                            backgroundColor:
                                theme.card,

                            borderColor:
                                theme.border,
                        },
                    ]}
                >

                    <Ionicons
                        name="search-outline"
                        size={19}
                        color={
                            theme.textMuted ||
                            theme.textSecondary
                        }
                    />


                    <TextInput
                        placeholder="Search products..."
                        placeholderTextColor={
                            theme.textMuted ||
                            theme.textSecondary
                        }
                        value={query}
                        onChangeText={
                            setQuery
                        }
                        autoFocus={
                            !params.q
                        }
                        returnKeyType="search"
                        style={[
                            styles.searchInput,
                            {
                                color:
                                    theme.text,
                            },
                        ]}
                    />


                    {query.length > 0 && (

                        <TouchableOpacity
                            onPress={() =>
                                setQuery('')
                            }
                            activeOpacity={0.7}
                        >

                            <Ionicons
                                name="close-circle"
                                size={19}
                                color={
                                    theme.textMuted
                                }
                            />

                        </TouchableOpacity>

                    )}

                </View>

            </View>


            {/* =================================================
                CONTENT
            ================================================= */}

            <ScrollView
                showsVerticalScrollIndicator={
                    false
                }
                contentContainerStyle={
                    styles.scrollContent
                }
            >

                {/* =================================================
                    CATEGORY
                ================================================= */}

                {categories.length > 1 && (

                    <>

                        <Text
                            style={[
                                styles.filterLabel,
                                {
                                    color:
                                        theme.textMuted ||
                                        theme.textSecondary,
                                },
                            ]}
                        >
                            Category
                        </Text>


                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={
                                false
                            }
                            contentContainerStyle={
                                styles.horizontalChips
                            }
                        >

                            {categories.map(
                                (cat) => {

                                    const active =
                                        cat ===
                                        category

                                    return (

                                        <TouchableOpacity
                                            key={cat}
                                            onPress={() =>
                                                setCategory(
                                                    cat
                                                )
                                            }
                                            activeOpacity={
                                                0.75
                                            }
                                            style={[
                                                styles.chip,
                                                {
                                                    backgroundColor:
                                                        active
                                                            ? theme.primary
                                                            : theme.card,

                                                    borderColor:
                                                        active
                                                            ? theme.primary
                                                            : theme.border,
                                                },
                                            ]}
                                        >

                                            <Text
                                                style={[
                                                    styles.chipText,
                                                    {
                                                        color:
                                                            active
                                                                ? '#FFFFFF'
                                                                : theme.text,
                                                    },
                                                ]}
                                            >
                                                {cat}
                                            </Text>

                                        </TouchableOpacity>

                                    )
                                }
                            )}

                        </ScrollView>

                    </>

                )}


                {/* =================================================
                    PRICE
                ================================================= */}

                <Text
                    style={[
                        styles.filterLabel,
                        {
                            color:
                                theme.textMuted ||
                                theme.textSecondary,
                        },
                    ]}
                >
                    Price
                </Text>


                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={
                        false
                    }
                    contentContainerStyle={
                        styles.horizontalChips
                    }
                >

                    {PRICE_RANGES.map(
                        (range) => {

                            const active =
                                range.key ===
                                priceRange

                            return (

                                <TouchableOpacity
                                    key={
                                        range.key
                                    }
                                    onPress={() =>
                                        setPriceRange(
                                            range.key
                                        )
                                    }
                                    activeOpacity={
                                        0.75
                                    }
                                    style={[
                                        styles.chip,
                                        {
                                            backgroundColor:
                                                active
                                                    ? theme.accent
                                                    : theme.card,

                                            borderColor:
                                                active
                                                    ? theme.accent
                                                    : theme.border,
                                        },
                                    ]}
                                >

                                    <Text
                                        style={[
                                            styles.chipText,
                                            {
                                                color:
                                                    active
                                                        ? '#FFFFFF'
                                                        : theme.text,
                                            },
                                        ]}
                                    >
                                        {
                                            range.label
                                        }
                                    </Text>

                                </TouchableOpacity>

                            )
                        }
                    )}

                </ScrollView>


                {/* =================================================
                    RESULTS HEADER
                ================================================= */}

                <View
                    style={
                        styles.sortRow
                    }
                >

                    <View>

                        <Text
                            style={[
                                styles.resultsTitle,
                                {
                                    color:
                                        theme.heading ||
                                        theme.text,
                                },
                            ]}
                        >
                            Products
                        </Text>


                        <Text
                            style={[
                                styles.resultCount,
                                {
                                    color:
                                        theme.textMuted ||
                                        theme.textSecondary,
                                },
                            ]}
                        >
                            {results.length}{' '}
                            {results.length === 1
                                ? 'result'
                                : 'results'}
                        </Text>

                    </View>


                    <TouchableOpacity
                        style={[
                            styles.sortBtn,
                            {
                                backgroundColor:
                                    theme.card,

                                borderColor:
                                    theme.border,
                            },
                        ]}
                        onPress={() =>
                            setSortModalOpen(
                                true
                            )
                        }
                        activeOpacity={0.75}
                    >

                        <Ionicons
                            name="swap-vertical"
                            size={15}
                            color={
                                theme.primary
                            }
                        />


                        <Text
                            style={[
                                styles.sortText,
                                {
                                    color:
                                        theme.text,
                                },
                            ]}
                            numberOfLines={1}
                        >
                            {
                                activeSortLabel
                            }
                        </Text>


                        <Ionicons
                            name="chevron-down"
                            size={14}
                            color={
                                theme.textMuted
                            }
                        />

                    </TouchableOpacity>

                </View>


                {/* =================================================
                    LOADING
                ================================================= */}

                {loading ? (

                    <View
                        style={
                            styles.loadingState
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
                                        theme.textSecondary,
                                },
                            ]}
                        >
                            Loading products...
                        </Text>

                    </View>

                ) : results.length === 0 ? (

                    /* =================================================
                       EMPTY
                    ================================================= */

                    <View
                        style={
                            styles.emptyState
                        }
                    >

                        <View
                            style={[
                                styles.emptyIcon,
                                {
                                    backgroundColor:
                                        theme.uiBackground ||
                                        theme.card,
                                },
                            ]}
                        >

                            <Ionicons
                                name="search-outline"
                                size={40}
                                color={
                                    theme.textMuted
                                }
                            />

                        </View>


                        <Text
                            style={[
                                styles.emptyText,
                                {
                                    color:
                                        theme.heading ||
                                        theme.text,
                                },
                            ]}
                        >
                            No products found
                        </Text>


                        <Text
                            style={[
                                styles.emptySubtext,
                                {
                                    color:
                                        theme.textMuted ||
                                        theme.textSecondary,
                                },
                            ]}
                        >
                            Try a different search
                            or filter
                        </Text>


                        <TouchableOpacity
                            onPress={() => {
                                setQuery('')
                                setCategory(
                                    'All'
                                )
                                setPriceRange(
                                    'all'
                                )
                                setSort(
                                    'relevance'
                                )
                            }}
                            style={[
                                styles.resetButton,
                                {
                                    backgroundColor:
                                        theme.primary,
                                },
                            ]}
                            activeOpacity={0.8}
                        >

                            <Text
                                style={
                                    styles.resetButtonText
                                }
                            >
                                Clear Filters
                            </Text>

                        </TouchableOpacity>

                    </View>

                ) : (

                    /* =================================================
                       PRODUCTS
                    ================================================= */

                    <View
                        style={
                            styles.grid
                        }
                    >

                        {results.map(
                            (item) => (

                                <Link
                                    href={`/product/${item.id}`}
                                    asChild
                                    key={
                                        String(
                                            item.id
                                        )
                                    }
                                >

                                    <TouchableOpacity
                                        activeOpacity={
                                            0.9
                                        }
                                        style={
                                            styles.productWrapper
                                        }
                                    >

                                        <ProductCard
                                            item={
                                                item
                                            }
                                            theme={
                                                theme
                                            }
                                            cardWidth={
                                                165
                                            }
                                        />

                                    </TouchableOpacity>

                                </Link>

                            )
                        )}

                    </View>

                )}

            </ScrollView>


            {/* =================================================
                SORT MODAL
            ================================================= */}

            <Modal
                visible={
                    sortModalOpen
                }
                transparent
                animationType="slide"
                onRequestClose={() =>
                    setSortModalOpen(
                        false
                    )
                }
            >

                <View
                    style={[
                        styles.modalOverlay,
                        {
                            backgroundColor:
                                colorScheme ===
                                'dark'
                                    ? 'rgba(0,0,0,0.72)'
                                    : 'rgba(0,0,0,0.42)',
                        },
                    ]}
                >

                    <TouchableOpacity
                        style={
                            styles.modalDismiss
                        }
                        activeOpacity={1}
                        onPress={() =>
                            setSortModalOpen(
                                false
                            )
                        }
                    />


                    <View
                        style={[
                            styles.modalSheet,
                            {
                                backgroundColor:
                                    theme.card,

                                borderColor:
                                    theme.border,
                            },
                        ]}
                    >

                        {/* HEADER */}

                        <View
                            style={
                                styles.modalHeader
                            }
                        >

                            <View>

                                <Text
                                    style={[
                                        styles.modalTitle,
                                        {
                                            color:
                                                theme.heading ||
                                                theme.text,
                                        },
                                    ]}
                                >
                                    Sort products
                                </Text>


                                <Text
                                    style={[
                                        styles.modalSubtitle,
                                        {
                                            color:
                                                theme.textMuted ||
                                                theme.textSecondary,
                                        },
                                    ]}
                                >
                                    Choose how you want
                                    to view the products
                                </Text>

                            </View>


                            <TouchableOpacity
                                onPress={() =>
                                    setSortModalOpen(
                                        false
                                    )
                                }
                                style={[
                                    styles.modalClose,
                                    {
                                        backgroundColor:
                                            theme.uiBackground ||
                                            theme.background,
                                    },
                                ]}
                                activeOpacity={0.7}
                            >

                                <Ionicons
                                    name="close"
                                    size={20}
                                    color={
                                        theme.text
                                    }
                                />

                            </TouchableOpacity>

                        </View>


                        {/* OPTIONS */}

                        {SORT_OPTIONS.map(
                            (option) => {

                                const active =
                                    option.key ===
                                    sort

                                return (

                                    <TouchableOpacity
                                        key={
                                            option.key
                                        }
                                        style={[
                                            styles.modalOption,
                                            {
                                                backgroundColor:
                                                    active
                                                        ? theme.uiBackground ||
                                                          theme.background
                                                        : 'transparent',

                                                borderColor:
                                                    active
                                                        ? theme.border
                                                        : 'transparent',
                                            },
                                        ]}
                                        onPress={() => {

                                            setSort(
                                                option.key
                                            )

                                            setSortModalOpen(
                                                false
                                            )

                                        }}
                                        activeOpacity={
                                            0.75
                                        }
                                    >

                                        <Text
                                            style={[
                                                styles.modalOptionText,
                                                {
                                                    color:
                                                        active
                                                            ? theme.primary
                                                            : theme.text,

                                                    fontWeight:
                                                        active
                                                            ? '800'
                                                            : '500',
                                                },
                                            ]}
                                        >
                                            {
                                                option.label
                                            }
                                        </Text>


                                        {active && (

                                            <Ionicons
                                                name="checkmark-circle"
                                                size={21}
                                                color={
                                                    theme.primary
                                                }
                                            />

                                        )}

                                    </TouchableOpacity>

                                )
                            }
                        )}

                    </View>

                </View>

            </Modal>

        </ThemeView>
    )
}


export default Search


/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({

    screen: {
        flex: 1,
    },


    /* HEADER */

    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 8,
        gap: 9,
    },

    backButton: {
        width: 36,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },

    searchBar: {
        flex: 1,
        height: 46,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 15,
        paddingHorizontal: 13,
    },

    searchInput: {
        flex: 1,
        fontSize: 14,
        marginLeft: 9,
        paddingVertical: 0,
    },


    /* SCROLL */

    scrollContent: {
        paddingBottom: 35,
    },


    /* FILTER */

    filterLabel: {
        fontSize: 11,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        paddingHorizontal: 16,
        marginTop: 14,
        marginBottom: 9,
    },

    horizontalChips: {
        paddingHorizontal: 16,
        gap: 8,
    },

    chip: {
        minHeight: 34,
        borderWidth: 1,
        borderRadius: 18,
        paddingHorizontal: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },

    chipText: {
        fontSize: 12,
        fontWeight: '600',
    },


    /* SORT */

    sortRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginTop: 20,
        marginBottom: 12,
    },

    resultsTitle: {
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 2,
    },

    resultCount: {
        fontSize: 12,
        fontWeight: '500',
    },

    sortBtn: {
        maxWidth: 185,
        minHeight: 38,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        borderWidth: 1,
        borderRadius: 11,
        paddingHorizontal: 11,
    },

    sortText: {
        fontSize: 11,
        fontWeight: '600',
        flexShrink: 1,
    },


    /* LOADING */

    loadingState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 70,
        paddingBottom: 100,
    },

    loadingText: {
        marginTop: 12,
        fontSize: 13,
    },


    /* GRID */

    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        rowGap: 18,
    },

    productWrapper: {
        marginBottom: 2,
    },


    /* EMPTY */

    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
        paddingTop: 70,
        paddingBottom: 100,
    },

    emptyIcon: {
        width: 78,
        height: 78,
        borderRadius: 39,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },

    emptyText: {
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 5,
    },

    emptySubtext: {
        fontSize: 13,
        textAlign: 'center',
    },

    resetButton: {
        marginTop: 18,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
    },

    resetButtonText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '800',
    },


    /* MODAL */

    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },

    modalDismiss: {
        flex: 1,
    },

    modalSheet: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        borderWidth: 1,
        paddingHorizontal: 18,
        paddingTop: 18,
        paddingBottom: 30,
    },

    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },

    modalTitle: {
        fontSize: 18,
        fontWeight: '800',
    },

    modalSubtitle: {
        fontSize: 11,
        marginTop: 3,
    },

    modalClose: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },

    modalOption: {
        minHeight: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 14,
        marginTop: 6,
    },

    modalOptionText: {
        fontSize: 14,
    },

})