import { useState } from 'react'

import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
} from 'react-native'

import { useAppTheme } from '../context/ThemeContext'
import { Link, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

import Colors from '../constans/Colors'

import ThemeView from '../components/ThemeView'
import ProductCard from '../components/ProductCard'
import BottomNavBar from '../components/BottomNavBar'

import { useProducts } from '../context/ProductContext'
import { useCart } from '../context/CartContext'

const { width } = Dimensions.get('window')


// ============================================================
// CATEGORIES
// ============================================================

const CATEGORIES = [
    {
        name: 'Women',
        icon: 'woman-outline',
    },
    {
        name: 'Mens',
        icon: 'man-outline',
    },
    {
        name: 'Food Products',
        icon: 'restaurant-outline',
    },
    {
        name: 'Event Menu',
        icon: 'restaurant-outline',
    },
]


// ============================================================
// BANNERS
// ============================================================

const BANNERS = [
    {
        id: 'b1',
        label: 'NEW COLLECTION',
        title: 'Elevate Your Style',
        subtitle: 'Discover the latest looks for every occasion',
        button: 'Shop Collection',
        icon: 'sparkles-outline',
    },

    {
        id: 'b2',
        label: 'LIMITED OFFER',
        title: 'Up to 50% OFF',
        subtitle: 'Fresh styles. Better prices. Limited time.',
        button: 'Shop Sale',
        icon: 'pricetag-outline',
    },

    {
        id: 'b3',
        label: 'TRENDING NOW',
        title: 'Step Into Style',
        subtitle: 'Explore shoes made for every move',
        button: 'Explore Shoes',
        icon: 'footsteps-outline',
    },
]


// ============================================================
// SECTION HEADER
// ============================================================

const SectionHeader = ({
    title,
    sub,
    theme,
    onPress,
}) => {
    return (
        <View style={styles.sectionHeader}>

            <View style={styles.sectionHeaderLeft}>

                <Text
                    style={[
                        styles.sectionTitle,
                        {
                            color: theme.title,
                        },
                    ]}
                >
                    {title}
                </Text>

                {sub ? (
                    <Text
                        style={[
                            styles.sectionSub,
                            {
                                color: theme.subtitle,
                            },
                        ]}
                    >
                        {sub}
                    </Text>
                ) : null}

            </View>

            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.8}
                style={[
                    styles.seeAllBtn,
                    {
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                    },
                ]}
            >

                <Text
                    style={[
                        styles.seeAllText,
                        {
                            color: theme.title,
                        },
                    ]}
                >
                    See all
                </Text>

                <Ionicons
                    name="arrow-forward"
                    size={14}
                    color={theme.title}
                />

            </TouchableOpacity>

        </View>
    )
}


// ============================================================
// HOME
// ============================================================

const Home = () => {

    const { colorScheme } = useAppTheme()

    /*
     * IMPORTANT:
     * This protects the app even if ThemeContext temporarily
     * returns undefined.
     */

    const currentScheme =
        colorScheme === 'dark'
            ? 'dark'
            : 'light'

    const theme =
        Colors[currentScheme] || Colors.light

    const { cartCount } = useCart()

    const router = useRouter()


    const {
    products,
    loading,
    error,
    refreshProducts,
} = useProducts()

    const [activeCategory, setActiveCategory] =
        useState('Women')



    // ========================================================
    // PRODUCT SECTIONS
    // ========================================================

    const NEW_ARRIVALS =
        products.slice(0, 4)

    const TRENDING =
        products.slice(4, 8)


    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {

        return (
            <ThemeView
                style={[
                    styles.loadingContainer,
                    {
                        backgroundColor:
                            theme.background,
                    },
                ]}
            >

                <View
                    style={[
                        styles.loadingIcon,
                        {
                            backgroundColor:
                                theme.accentLight,
                        },
                    ]}
                >

                    <Ionicons
                        name="bag-handle-outline"
                        size={25}
                        color={theme.accent}
                    />

                </View>

                <ActivityIndicator
                    size="small"
                    color={theme.primary}
                    style={styles.loader}
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
                    Curating your styles...
                </Text>

            </ThemeView>
        )
    }


    // ========================================================
    // ERROR
    // ========================================================

    if (error) {

        return (
            <ThemeView
                style={[
                    styles.loadingContainer,
                    {
                        backgroundColor:
                            theme.background,
                    },
                ]}
            >

                <View
                    style={[
                        styles.errorIcon,
                        {
                            backgroundColor:
                                theme.errorLight,
                        },
                    ]}
                >

                    <Ionicons
                        name="cloud-offline-outline"
                        size={32}
                        color={theme.error}
                    />

                </View>

                <Text
                    style={[
                        styles.errorText,
                        {
                            color:
                                theme.title,
                        },
                    ]}
                >
                    Couldn't load products
                </Text>

                <Text
                    style={[
                        styles.errorSubText,
                        {
                            color:
                                theme.subtitle,
                        },
                    ]}
                >
                    Please check your connection
                    and try again.
                </Text>

                <TouchableOpacity
    activeOpacity={0.85}
    onPress={refreshProducts}
    style={[
        styles.retryButton,
        {
            backgroundColor:
                theme.primary,
        },
    ]}
>
    <Text
        style={[
            styles.retryButtonText,
            {
                color:
                    theme.buttonPrimaryText,
            },
        ]}
    >
        Try Again
    </Text>
</TouchableOpacity>

            </ThemeView>
        )
    }


    // ========================================================
    // MAIN UI
    // ========================================================

    return (
        <ThemeView
            style={[
                styles.container,
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

                <View style={styles.header}>

                    <View>

                        <Text
                            style={[
                                styles.brandSmall,
                                {
                                    color:
                                        theme.accentDark,
                                },
                            ]}
                        >
                            WELCOME BACK
                        </Text>

                        <Text
                            style={[
                                styles.brandTitle,
                                {
                                    color:
                                        theme.title,
                                },
                            ]}
                        >
                            Discover your style.
                        </Text>

                    </View>


                    <View
                        style={styles.headerActions}
                    >

                        {/* SEARCH */}

                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() =>
                                router.push('/search')
                            }
                            style={[
                                styles.headerButton,
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
                                size={21}
                                color={
                                    theme.headerIcon
                                }
                            />

                        </TouchableOpacity>


                        {/* CART */}

                        <Link
                            href="/cart"
                            asChild
                        >

                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={[
                                    styles.headerButton,
                                    {
                                        backgroundColor:
                                            theme.card,
                                        borderColor:
                                            theme.border,
                                    },
                                ]}
                            >

                                <Ionicons
                                    name="bag-outline"
                                    size={21}
                                    color={
                                        theme.headerIcon
                                    }
                                />

                                {cartCount > 0 && (
                                    <View
                                        style={[
                                            styles.cartBadge,
                                            {
                                                backgroundColor:
                                                    theme.accentDark,
                                            },
                                        ]}
                                    >

                                        <Text
                                            style={
                                                styles.cartBadgeText
                                            }
                                        >
                                            {cartCount}
                                        </Text>

                                    </View>
                                )}

                            </TouchableOpacity>

                        </Link>

                    </View>

                </View>


                {/* =================================================
                    HERO
                ================================================= */}

                <View
                    style={[
                        styles.hero,
                        {
                            backgroundColor:
                                theme.primaryDark,
                        },
                    ]}
                >

                    <View
                        style={
                            styles.heroContent
                        }
                    >

                        <Text
                            style={
                                styles.heroLabel
                            }
                        >
                            NEW SEASON
                        </Text>

                        <Text
                            style={
                                styles.heroTitle
                            }
                        >
                            Find your
                            {'\n'}
                            perfect look.
                        </Text>

                        <Text
                            style={
                                styles.heroSubtitle
                            }
                        >
                            New styles have arrived.
                            {'\n'}
                            Discover something
                            you'll love.
                        </Text>

                        <TouchableOpacity
                            activeOpacity={0.85}
                            onPress={() =>
                                router.push(
                                    '/categories'
                                )
                            }
                            style={[
                                styles.heroButton,
                                {
                                    backgroundColor:
                                        theme.accentLight,
                                },
                            ]}
                        >

                            <Text
                                style={[
                                    styles.heroButtonText,
                                    {
                                        color:
                                            theme.primaryDark,
                                    },
                                ]}
                            >
                                Shop Now
                            </Text>

                            <Ionicons
                                name="arrow-forward"
                                size={16}
                                color={
                                    theme.primaryDark
                                }
                            />

                        </TouchableOpacity>

                    </View>


                    {/* DECORATION */}

                    <View
                        style={[
                            styles.heroCircleOne,
                            {
                                backgroundColor:
                                    'rgba(255,255,255,0.04)',
                            },
                        ]}
                    />

                    <View
                        style={[
                            styles.heroCircleTwo,
                            {
                                backgroundColor:
                                    'rgba(201,143,143,0.10)',
                            },
                        ]}
                    />

                    <View
                        style={
                            styles.heroFashionIcon
                        }
                    >

                        <Ionicons
                            name="shirt-outline"
                            size={88}
                            color="rgba(255,255,255,0.12)"
                        />

                    </View>

                </View>


                {/* =================================================
                    CATEGORIES
                ================================================= */}

                <View
                    style={styles.categorySection}
                >

                    <SectionHeader
                        title="Shop by category"
                        sub="Find what fits your style"
                        theme={theme}
                        onPress={() =>
                            router.push(
                                '/categories'
                            )
                        }
                    />


                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={
                            false
                        }
                        contentContainerStyle={
                            styles.categoryScroll
                        }
                    >

                        {CATEGORIES.map(
                            (category) => {

                                const active =
                                    category.name ===
                                    activeCategory

                                return (
                                    <TouchableOpacity
                                        key={
                                            category.name
                                        }
                                        activeOpacity={
                                            0.8
                                        }
                                        onPress={() => {
    setActiveCategory(category.name)

    router.push({
        pathname: '/category-products',
        params: {
            category: category.name,
        },
    })
}}
                                        style={[
                                            styles.categoryCard,
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

                                        <View
                                            style={[
                                                styles.categoryIcon,
                                                {
                                                    backgroundColor:
                                                        active
                                                            ? 'rgba(255,255,255,0.12)'
                                                            : theme.uiBackground,
                                                },
                                            ]}
                                        >

                                            <Ionicons
                                                name={
                                                    category.icon
                                                }
                                                size={22}
                                                color={
                                                    active
                                                        ? '#FFFFFF'
                                                        : theme.title
                                                }
                                            />

                                        </View>


                                        <Text
                                            style={[
                                                styles.categoryName,
                                                {
                                                    color:
                                                        active
                                                            ? '#FFFFFF'
                                                            : theme.title,
                                                },
                                            ]}
                                        >
                                            {
                                                category.name
                                            }
                                        </Text>

                                    </TouchableOpacity>
                                )
                            }
                        )}

                    </ScrollView>

                </View>


                {/* =================================================
                    PROMOTIONAL BANNERS
                ================================================= */}

                <ScrollView
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={
                        false
                    }
                    style={styles.bannerScroll}
                >

                    {BANNERS.map(
                        (banner) => (

                            <View
                                key={
                                    banner.id
                                }
                                style={[
                                    styles.banner,
                                    {
                                        width:
                                            width -
                                            32,
                                        backgroundColor:
                                            theme.primary,
                                    },
                                ]}
                            >

                                <View
                                    style={
                                        styles.bannerContent
                                    }
                                >

                                    <Text
                                        style={[
                                            styles.bannerLabel,
                                            {
                                                color:
                                                    theme.accentLight,
                                            },
                                        ]}
                                    >
                                        {
                                            banner.label
                                        }
                                    </Text>

                                    <Text
                                        style={
                                            styles.bannerTitle
                                        }
                                    >
                                        {
                                            banner.title
                                        }
                                    </Text>

                                    <Text
                                        style={
                                            styles.bannerSubtitle
                                        }
                                    >
                                        {
                                            banner.subtitle
                                        }
                                    </Text>

                                    <TouchableOpacity
                                        activeOpacity={
                                            0.85
                                        }
                                        onPress={() =>
                                            router.push(
                                                '/categories'
                                            )
                                        }
                                        style={[
                                            styles.bannerButton,
                                            {
                                                backgroundColor:
                                                    theme.accent,
                                            },
                                        ]}
                                    >

                                        <Text
                                            style={
                                                styles.bannerButtonText
                                            }
                                        >
                                            {
                                                banner.button
                                            }
                                        </Text>

                                        <Ionicons
                                            name="arrow-forward"
                                            size={14}
                                            color="#FFFFFF"
                                        />

                                    </TouchableOpacity>

                                </View>


                                <View
                                    style={
                                        styles.bannerDecoration
                                    }
                                >

                                    <Ionicons
                                        name={
                                            banner.icon
                                        }
                                        size={95}
                                        color="rgba(255,255,255,0.10)"
                                    />

                                </View>

                            </View>

                        )
                    )}

                </ScrollView>


                {/* =================================================
                    NEW ARRIVALS
                ================================================= */}

                {NEW_ARRIVALS.length > 0 && (

                    <View
                        style={styles.section}
                    >

                        <SectionHeader
                            title="New arrivals"
                            sub="Fresh styles just for you"
                            theme={theme}
                            onPress={() =>
                                router.push(
                                    '/categories'
                                )
                            }
                        />

                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={
                                false
                            }
                            contentContainerStyle={
                                styles.productScroll
                            }
                        >

                            {NEW_ARRIVALS.map(
                                (item) => (

                                    <Link
                                        key={
                                            item.id
                                        }
                                        href={`/product/${item.id}`}
                                        asChild
                                    >

                                        <TouchableOpacity
                                            activeOpacity={
                                                0.9
                                            }
                                            style={
                                                styles.productItem
                                            }
                                        >

                                            <ProductCard
                                                item={item}
                                                theme={
                                                    theme
                                                }
                                            />

                                        </TouchableOpacity>

                                    </Link>

                                )
                            )}

                        </ScrollView>

                    </View>
                )}


                {/* =================================================
                    TRENDING
                ================================================= */}

                {TRENDING.length > 0 && (

                    <View
                        style={styles.section}
                    >

                        <SectionHeader
                            title="Trending now"
                            sub="What everyone is loving"
                            theme={theme}
                            onPress={() =>
                                router.push(
                                    '/categories'
                                )
                            }
                        />


                        <View
                            style={styles.grid}
                        >

                            {TRENDING.map(
                                (item) => (

                                    <Link
                                        key={
                                            item.id
                                        }
                                        href={`/product/${item.id}`}
                                        asChild
                                    >

                                        <TouchableOpacity
                                            activeOpacity={
                                                0.9
                                            }
                                            style={[
                                                styles.gridItem,
                                                {
                                                    width:
                                                        (width -
                                                            48) /
                                                        2,
                                                },
                                            ]}
                                        >

                                            <ProductCard
                                                item={item}
                                                theme={
                                                    theme
                                                }
                                                cardWidth={
                                                    (width -
                                                        48) /
                                                    2
                                                }
                                            />

                                        </TouchableOpacity>

                                    </Link>

                                )
                            )}

                        </View>

                    </View>
                )}


                {/* =================================================
                    SALE STRIP
                ================================================= */}

                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() =>
                        router.push(
                            '/categories'
                        )
                    }
                    style={[
                        styles.saleStrip,
                        {
                            backgroundColor:
                                theme.primary,
                        },
                    ]}
                >

                    <View
                        style={[
                            styles.saleIcon,
                            {
                                backgroundColor:
                                    'rgba(201,143,143,0.18)',
                            },
                        ]}
                    >

                        <Ionicons
                            name="pricetag-outline"
                            size={23}
                            color={
                                theme.accentLight
                            }
                        />

                    </View>


                    <View
                        style={
                            styles.saleTextContainer
                        }
                    >

                        <Text
                            style={
                                styles.saleTitle
                            }
                        >
                            SALE UP TO 50% OFF
                        </Text>

                        <Text
                            style={
                                styles.saleSubtitle
                            }
                        >
                            Don't miss our
                            limited-time offers.
                        </Text>

                    </View>


                    <Ionicons
                        name="arrow-forward"
                        size={19}
                        color="#FFFFFF"
                    />

                </TouchableOpacity>


                {/* =================================================
                    EMPTY
                ================================================= */}

                {products.length === 0 && (

                    <View
                        style={
                            styles.emptyContainer
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

                            <Ionicons
                                name="bag-outline"
                                size={32}
                                color={
                                    theme.subtitle
                                }
                            />

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
                            No products available
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
                            Products will appear
                            here once they are
                            available.
                        </Text>

                    </View>
                )}

                <View
                    style={{
                        height: 30,
                    }}
                />

            </ScrollView>


            {/* =====================================================
                BOTTOM NAVIGATION
            ===================================================== */}

            <BottomNavBar />

        </ThemeView>
    )
}


export default Home


// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },

    scrollContent: {
        paddingBottom: 100,
    },


    // ========================================================
    // LOADING
    // ========================================================

    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
    },

    loadingIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },

    loader: {
        marginBottom: 10,
    },

    loadingText: {
        fontSize: 13,
        fontWeight: '500',
    },


    // ========================================================
    // ERROR
    // ========================================================

    errorIcon: {
        width: 70,
        height: 70,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },

    errorText: {
        fontSize: 18,
        fontWeight: '800',
        marginTop: 4,
    },

    errorSubText: {
        fontSize: 13,
        textAlign: 'center',
        marginTop: 7,
        lineHeight: 19,
    },

    retryButton: {
        marginTop: 20,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 22,
    },

    retryButtonText: {
        fontSize: 12,
        fontWeight: '800',
    },


    // ========================================================
    // HEADER
    // ========================================================

    header: {
        paddingHorizontal: 20,
        paddingTop: 18,
        paddingBottom: 17,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    brandSmall: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 2,
        marginBottom: 5,
    },

    brandTitle: {
        fontSize: 22,
        fontWeight: '800',
        letterSpacing: -0.5,
    },

    headerActions: {
        flexDirection: 'row',
        gap: 9,
    },

    headerButton: {
        width: 42,
        height: 42,
        borderRadius: 21,

        alignItems: 'center',
        justifyContent: 'center',

        borderWidth: 1,
    },

    cartBadge: {
        position: 'absolute',

        top: -2,
        right: -2,

        minWidth: 17,
        height: 17,

        paddingHorizontal: 4,

        borderRadius: 9,

        alignItems: 'center',
        justifyContent: 'center',
    },

    cartBadgeText: {
        color: '#FFFFFF',
        fontSize: 9,
        fontWeight: '900',
    },


    // ========================================================
    // HERO
    // ========================================================

    hero: {
        marginHorizontal: 16,
        marginTop: 4,

        height: 245,

        borderRadius: 28,

        overflow: 'hidden',

        position: 'relative',
    },

    heroContent: {
        padding: 25,
        zIndex: 2,
    },

    heroLabel: {
        color: '#C8BEB6',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 2,
        marginBottom: 10,
    },

    heroTitle: {
        color: '#FFFFFF',
        fontSize: 32,
        fontWeight: '900',
        lineHeight: 36,
        letterSpacing: -1,
    },

    heroSubtitle: {
        color: '#B9AEA6',
        fontSize: 13,
        lineHeight: 19,
        marginTop: 10,
    },

    heroButton: {
        marginTop: 18,

        paddingVertical: 11,
        paddingHorizontal: 17,

        borderRadius: 22,

        alignSelf: 'flex-start',

        flexDirection: 'row',
        alignItems: 'center',

        gap: 8,
    },

    heroButtonText: {
        fontSize: 12,
        fontWeight: '800',
    },

    heroCircleOne: {
        position: 'absolute',

        width: 220,
        height: 220,

        borderRadius: 110,

        right: -80,
        top: -65,
    },

    heroCircleTwo: {
        position: 'absolute',

        width: 180,
        height: 180,

        borderRadius: 90,

        right: -25,
        bottom: -90,
    },

    heroFashionIcon: {
        position: 'absolute',

        right: 24,
        top: 78,
    },


    // ========================================================
    // SECTION HEADER
    // ========================================================

    sectionHeader: {
        paddingHorizontal: 20,
        marginBottom: 15,

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    sectionHeaderLeft: {
        flex: 1,
        paddingRight: 10,
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: '800',
        letterSpacing: -0.5,
    },

    sectionSub: {
        fontSize: 12,
        marginTop: 4,
    },

    seeAllBtn: {
        height: 34,

        paddingHorizontal: 11,

        borderRadius: 17,

        borderWidth: 1,

        flexDirection: 'row',
        alignItems: 'center',

        gap: 5,
    },

    seeAllText: {
        fontSize: 11,
        fontWeight: '700',
    },


    // ========================================================
    // CATEGORIES
    // ========================================================

    categorySection: {
        marginTop: 28,
    },

    categoryScroll: {
        paddingHorizontal: 20,
        gap: 10,
    },

    categoryCard: {
        width: 91,
        height: 100,

        borderRadius: 20,

        borderWidth: 1,

        alignItems: 'center',
        justifyContent: 'center',
    },

    categoryIcon: {
        width: 46,
        height: 46,

        borderRadius: 23,

        alignItems: 'center',
        justifyContent: 'center',

        marginBottom: 9,
    },

    categoryName: {
        fontSize: 11,
        fontWeight: '700',
    },


    // ========================================================
    // BANNERS
    // ========================================================

    bannerScroll: {
        marginTop: 28,
    },

    banner: {
        height: 170,

        marginLeft: 16,

        borderRadius: 25,

        overflow: 'hidden',

        position: 'relative',
    },

    bannerContent: {
        padding: 21,
        zIndex: 2,
    },

    bannerLabel: {
        fontSize: 9,
        fontWeight: '900',
        letterSpacing: 1.5,
    },

    bannerTitle: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: '900',
        marginTop: 7,
    },

    bannerSubtitle: {
        color: '#C4BBB4',
        fontSize: 12,
        marginTop: 5,
        maxWidth: 230,
        lineHeight: 17,
    },

    bannerButton: {
        marginTop: 13,

        alignSelf: 'flex-start',

        flexDirection: 'row',
        alignItems: 'center',

        gap: 6,

        borderRadius: 18,

        paddingVertical: 8,
        paddingHorizontal: 13,
    },

    bannerButtonText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '800',
    },

    bannerDecoration: {
        position: 'absolute',
        right: 25,
        top: 38,
    },


    // ========================================================
    // PRODUCTS
    // ========================================================

    section: {
        marginTop: 30,
    },

    productScroll: {
        paddingHorizontal: 20,
    },

    productItem: {
        marginRight: 14,
    },

    grid: {
        paddingHorizontal: 16,

        flexDirection: 'row',
        flexWrap: 'wrap',

        justifyContent: 'space-between',

        rowGap: 22,
    },

    gridItem: {
        marginBottom: 2,
    },


    // ========================================================
    // SALE
    // ========================================================

    saleStrip: {
        marginHorizontal: 16,
        marginTop: 30,

        borderRadius: 20,

        padding: 16,

        flexDirection: 'row',
        alignItems: 'center',
    },

    saleIcon: {
        width: 44,
        height: 44,

        borderRadius: 22,

        alignItems: 'center',
        justifyContent: 'center',

        marginRight: 12,
    },

    saleTextContainer: {
        flex: 1,
    },

    saleTitle: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '900',
        letterSpacing: 0.5,
    },

    saleSubtitle: {
        color: '#AAA19A',
        fontSize: 10,
        marginTop: 3,
    },


    // ========================================================
    // EMPTY
    // ========================================================

    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',

        paddingHorizontal: 30,
        paddingVertical: 60,
    },

    emptyIcon: {
        width: 64,
        height: 64,

        borderRadius: 32,

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
        textAlign: 'center',

        marginTop: 6,

        lineHeight: 18,
    },

})