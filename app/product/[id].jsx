import { useState, useEffect } from 'react'

import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Image,
} from 'react-native'

import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

import Colors from '../../constans/Colors'
import { fetchProductById } from '../../constans/api'

import { useCart } from '../../context/CartContext'
import { useAppTheme } from '../../context/ThemeContext'
import { useProducts } from '../../context/ProductContext'

import ThemeView from '../../components/ThemeView'


// =============================================================
// DISCOUNT CALCULATION
// =============================================================

const discountPct = (price, mrp) => {
    const currentPrice = Number(price || 0)
    const originalPrice = Number(mrp || 0)

    if (originalPrice > currentPrice) {
        return Math.round(
            ((originalPrice - currentPrice) / originalPrice) * 100
        )
    }

    return 0
}


// =============================================================
// PRODUCT DETAIL
// =============================================================

const ProductDetail = () => {

    const { id } = useLocalSearchParams()

    const router = useRouter()

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

    const [qty, setQty] = useState(1)

    const [product, setProduct] =
        useState(null)

    const [loading, setLoading] =
        useState(true)

    // Floating "Added to Cart" message
    const [addedToCart, setAddedToCart] =
        useState(false)


    const { addItem } = useCart()

const {
    products: allProducts,
} = useProducts()


    // =========================================================
    // LOAD PRODUCT
    // =========================================================

    useEffect(() => {

    let mounted = true

    const productId = Array.isArray(id)
        ? id[0]
        : id

    // =====================================================
    // FIRST: FIND PRODUCT IN PRODUCT CONTEXT
    // =====================================================

    const cachedProduct =
        Array.isArray(allProducts)
            ? allProducts.find(
                (item) =>
                    String(item.id) ===
                    String(productId)
            )
            : null


    if (cachedProduct) {

        console.log(
            'PRODUCT DETAIL: Loaded from ProductContext',
            cachedProduct.name
        )

        setProduct(cachedProduct)
        setLoading(false)

        return () => {
            mounted = false
        }
    }


    // =====================================================
    // FALLBACK: FETCH FROM API
    // =====================================================

    console.log(
        'PRODUCT DETAIL: Product not in context, fetching API...'
    )

    setLoading(true)

    fetchProductById(productId)
        .then((data) => {

            if (mounted) {

                console.log(
                    'PRODUCT DETAIL: Loaded from API',
                    data?.name
                )

                setProduct(data)
            }

        })
        .catch((error) => {

            console.log(
                'PRODUCT DETAIL ERROR:',
                error
            )

            if (mounted) {
                setProduct(null)
            }

        })
        .finally(() => {

            if (mounted) {
                setLoading(false)
            }

        })


    return () => {
        mounted = false
    }

}, [id, allProducts])


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (
            <ThemeView
                style={[
                    styles.center,
                    {
                        backgroundColor:
                            theme.background,
                    },
                ]}
            >

                <ActivityIndicator
                    size="large"
                    color={theme.primary}
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
                    Loading product...
                </Text>

            </ThemeView>
        )
    }


    // =========================================================
    // PRODUCT NOT FOUND
    // =========================================================

    if (!product) {

        return (
            <ThemeView
                style={[
                    styles.center,
                    {
                        backgroundColor:
                            theme.background,
                    },
                ]}
            >

                <View
                    style={[
                        styles.notFoundIcon,
                        {
                            backgroundColor:
                                theme.uiBackground,
                        },
                    ]}
                >

                    <Ionicons
                        name="bag-outline"
                        size={30}
                        color={
                            theme.textSecondary
                        }
                    />

                </View>


                <Text
                    style={[
                        styles.notFoundTitle,
                        {
                            color:
                                theme.title ||
                                theme.text,
                        },
                    ]}
                >
                    Product not found
                </Text>


                <TouchableOpacity
                    onPress={() => router.back()}
                    style={[
                        styles.backButton,
                        {
                            backgroundColor:
                                theme.primary,
                        },
                    ]}
                    activeOpacity={0.8}
                >

                    <Text
                        style={[
                            styles.backButtonText,
                            {
                                color:
                                    theme.buttonPrimaryText,
                            },
                        ]}
                    >
                        Go Back
                    </Text>

                </TouchableOpacity>

            </ThemeView>
        )
    }


    // =========================================================
    // DISCOUNT
    // =========================================================

    const pct =
        discountPct(
            product.price,
            product.mrp
        )


    // =========================================================
    // ADD TO CART
    // =========================================================

    const handleAddToCart = () => {

        addItem(product, qty)

        // Show floating message
        setAddedToCart(true)

        // Automatically hide after 2.5 seconds
        setTimeout(() => {
            setAddedToCart(false)
        }, 2500)
    }


    // =========================================================
    // BUY NOW
    // =========================================================

    const handleBuyNow = () => {

        addItem(product, qty)

        router.push('/checkout')
    }


    // =========================================================
    // MAIN UI
    // =========================================================

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
                    PRODUCT IMAGE
                ================================================= */}

                <View
                    style={[
                        styles.imageBox,
                        {
                            backgroundColor:
                                theme.imageBackground ||
                                theme.surfaceSoft,
                        },
                    ]}
                >

                    {product.imageUrl ? (

                        <Image
                            source={{
                                uri:
                                    product.imageUrl,
                            }}
                            style={
                                StyleSheet.absoluteFill
                            }
                            resizeMode="cover"
                        />

                    ) : (

                        <View
                            style={[
                                styles.imagePlaceholder,
                                {
                                    backgroundColor:
                                        theme.imagePlaceholder ||
                                        theme.uiBackground,
                                },
                            ]}
                        >

                            <Ionicons
                                name="image-outline"
                                size={55}
                                color={
                                    theme.textMuted
                                }
                            />

                        </View>

                    )}


                    {/* DISCOUNT BADGE */}

                    {pct > 0 && (

                        <View
                            style={[
                                styles.discountBadge,
                                {
                                    backgroundColor:
                                        theme.accent,
                                },
                            ]}
                        >

                            <Text
                                style={
                                    styles.discountText
                                }
                            >
                                {pct}% OFF
                            </Text>

                        </View>

                    )}


                    {/* OUT OF STOCK */}

                    {!product.inStock && (

                        <View
                            style={
                                styles.outOfStockBanner
                            }
                        >

                            <Text
                                style={
                                    styles.outOfStockText
                                }
                            >
                                Out of Stock
                            </Text>

                        </View>

                    )}

                </View>


                {/* =================================================
                    PRODUCT INFORMATION
                ================================================= */}

                <View style={styles.content}>

                    {/* CATEGORY */}

                    {!!product.category && (

                        <Text
                            style={[
                                styles.category,
                                {
                                    color:
                                        theme.textSecondary,
                                },
                            ]}
                        >
                            {product.category}
                        </Text>

                    )}


                    {/* NAME */}

                    <Text
                        style={[
                            styles.name,
                            {
                                color:
                                    theme.title ||
                                    theme.text,
                            },
                        ]}
                    >
                        {product.name}
                    </Text>


                    {/* UNIT */}

                    {!!product.unit && (

                        <Text
                            style={[
                                styles.unit,
                                {
                                    color:
                                        theme.textSecondary,
                                },
                            ]}
                        >
                            {product.unit}
                        </Text>

                    )}


                    {/* =================================================
                        PRICE
                    ================================================= */}

                    <View style={styles.priceRow}>

                        <Text
                            style={[
                                styles.price,
                                {
                                    color:
                                        theme.productPrice ||
                                        theme.primary,
                                },
                            ]}
                        >
                            ₹{product.price}
                        </Text>


                        {Number(product.mrp) >
                            Number(product.price) && (

                            <>

                                <Text
                                    style={[
                                        styles.mrp,
                                        {
                                            color:
                                                theme.textMuted,
                                        },
                                    ]}
                                >
                                    ₹{product.mrp}
                                </Text>


                                <Text
                                    style={[
                                        styles.pct,
                                        {
                                            color:
                                                theme.accent,
                                        },
                                    ]}
                                >
                                    {pct}% off
                                </Text>

                            </>

                        )}

                    </View>


                    {/* =================================================
                        DELIVERY
                    ================================================= */}

                    <View
                        style={[
                            styles.deliveryBox,
                            {
                                backgroundColor:
                                    theme.uiBackground,
                                borderColor:
                                    theme.border,
                            },
                        ]}
                    >

                        <View
                            style={[
                                styles.deliveryIcon,
                                {
                                    backgroundColor:
                                        theme.accentLight,
                                },
                            ]}
                        >

                            <Ionicons
                                name="cube-outline"
                                size={18}
                                color={
                                    theme.accent
                                }
                            />

                        </View>


                        <View style={{ flex: 1 }}>

                            <Text
                                style={[
                                    styles.deliveryTitle,
                                    {
                                        color:
                                            theme.text,
                                    },
                                ]}
                            >
                                Fresh delivery
                            </Text>

                            <Text
                                style={[
                                    styles.deliveryText,
                                    {
                                        color:
                                            theme.textSecondary,
                                    },
                                ]}
                            >
                                Fresh delivery every morning
                                by 7 AM
                            </Text>

                        </View>

                    </View>


                    {/* =================================================
                        DESCRIPTION
                    ================================================= */}

                    {product.description ? (

                        <View style={styles.descriptionSection}>

                            <Text
                                style={[
                                    styles.sectionLabel,
                                    {
                                        color:
                                            theme.title ||
                                            theme.text,
                                    },
                                ]}
                            >
                                Description
                            </Text>


                            <Text
                                style={[
                                    styles.description,
                                    {
                                        color:
                                            theme.text,
                                    },
                                ]}
                            >
                                {product.description}
                            </Text>

                        </View>

                    ) : null}


                    {/* =================================================
                        QUANTITY
                    ================================================= */}

                    <Text
                        style={[
                            styles.sectionLabel,
                            {
                                color:
                                    theme.title ||
                                    theme.text,
                            },
                        ]}
                    >
                        Quantity
                    </Text>


                    <View style={styles.qtyRow}>

                        {/* MINUS */}

                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={[
                                styles.qtyBtn,
                                {
                                    backgroundColor:
                                        theme.card,
                                    borderColor:
                                        theme.border,
                                },
                            ]}
                            onPress={() =>
                                setQty((q) =>
                                    Math.max(
                                        1,
                                        q - 1
                                    )
                                )
                            }
                        >

                            <Ionicons
                                name="remove"
                                size={18}
                                color={
                                    theme.text
                                }
                            />

                        </TouchableOpacity>


                        {/* VALUE */}

                        <View
                            style={[
                                styles.qtyValueBox,
                                {
                                    backgroundColor:
                                        theme.uiBackground,
                                },
                            ]}
                        >

                            <Text
                                style={[
                                    styles.qtyValue,
                                    {
                                        color:
                                            theme.title ||
                                            theme.text,
                                    },
                                ]}
                            >
                                {qty}
                            </Text>

                        </View>


                        {/* PLUS */}

                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={[
                                styles.qtyBtn,
                                {
                                    backgroundColor:
                                        theme.card,
                                    borderColor:
                                        theme.border,
                                },
                            ]}
                            onPress={() =>
                                setQty(
                                    (q) => q + 1
                                )
                            }
                        >

                            <Ionicons
                                name="add"
                                size={18}
                                color={
                                    theme.text
                                }
                            />

                        </TouchableOpacity>

                    </View>

                </View>

            </ScrollView>


            {/* =====================================================
                FLOATING ADDED TO CART MESSAGE
            ===================================================== */}

            {addedToCart && (

                <View
                    style={[
                        styles.addedToast,
                        {
                            backgroundColor:
                                theme.card,
                            borderColor:
                                theme.border,
                        },
                    ]}
                >

                    {/* CHECK ICON */}

                    <View
                        style={[
                            styles.successIcon,
                            {
                                backgroundColor:
                                    theme.successLight,
                            },
                        ]}
                    >

                        <Ionicons
                            name="checkmark"
                            size={19}
                            color={
                                theme.success
                            }
                        />

                    </View>


                    {/* TEXT */}

                    <View
                        style={
                            styles.toastContent
                        }
                    >

                        <Text
                            style={[
                                styles.addedTitle,
                                {
                                    color:
                                        theme.text,
                                },
                            ]}
                        >
                            Added to Cart
                        </Text>


                        <Text
                            style={[
                                styles.addedSubtitle,
                                {
                                    color:
                                        theme.textSecondary,
                                },
                            ]}
                            numberOfLines={1}
                        >
                            {product.name} • Qty {qty}
                        </Text>

                    </View>


                    {/* VIEW CART */}

                    <TouchableOpacity
                        onPress={() =>
                            router.push('/cart')
                        }
                        activeOpacity={0.7}
                    >

                        <Text
                            style={[
                                styles.viewCart,
                                {
                                    color:
                                        theme.primary,
                                },
                            ]}
                        >
                            View Cart
                        </Text>

                    </TouchableOpacity>

                </View>

            )}


            {/* =====================================================
                BOTTOM ACTION BAR
            ===================================================== */}

            <View
                style={[
                    styles.footer,
                    {
                        backgroundColor:
                            theme.card,

                        borderTopColor:
                            theme.border,
                    },
                ]}
            >

                {/* =================================================
                    ADD TO CART
                ================================================= */}

                <TouchableOpacity
                    activeOpacity={0.85}
                    style={[
                        styles.cartBtn,
                        {
                            backgroundColor:
                                theme.primary,

                            opacity:
                                product.inStock
                                    ? 1
                                    : 0.45,
                        },
                    ]}
                    onPress={
                        handleAddToCart
                    }
                    disabled={
                        !product.inStock
                    }
                >

                    <Ionicons
                        name="cart-outline"
                        size={19}
                        color={
                            theme.buttonPrimaryText
                        }
                    />

                    <Text
                        style={[
                            styles.footerBtnText,
                            {
                                color:
                                    theme.buttonPrimaryText,
                            },
                        ]}
                    >
                        Add to Cart
                    </Text>

                </TouchableOpacity>


                {/* =================================================
                    BUY NOW
                ================================================= */}

                <TouchableOpacity
                    activeOpacity={0.85}
                    style={[
                        styles.buyBtn,
                        {
                            backgroundColor:
                                theme.accent,

                            opacity:
                                product.inStock
                                    ? 1
                                    : 0.45,
                        },
                    ]}
                    onPress={
                        handleBuyNow
                    }
                    disabled={
                        !product.inStock
                    }
                >

                    <Ionicons
                        name="flash-outline"
                        size={18}
                        color="#FFFFFF"
                    />

                    <Text
                        style={[
                            styles.footerBtnText,
                            {
                                color:
                                    '#FFFFFF',
                            },
                        ]}
                    >
                        Buy Now
                    </Text>

                </TouchableOpacity>

            </View>

        </ThemeView>
    )
}


export default ProductDetail


// =============================================================
// STYLES
// =============================================================

const styles = StyleSheet.create({

    // =========================================================
    // SCREEN
    // =========================================================

    container: {
        flex: 1,
    },

    scrollContent: {
        paddingBottom: 30,
    },


    // =========================================================
    // CENTER
    // =========================================================

    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 25,
    },

    loadingText: {
        fontSize: 13,
        marginTop: 12,
    },

    notFoundIcon: {
        width: 68,
        height: 68,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
    },

    notFoundTitle: {
        fontSize: 19,
        fontWeight: '800',
    },

    backButton: {
        marginTop: 18,
        paddingHorizontal: 24,
        paddingVertical: 11,
        borderRadius: 22,
    },

    backButtonText: {
        fontSize: 13,
        fontWeight: '800',
    },


    // =========================================================
    // PRODUCT IMAGE
    // =========================================================

    imageBox: {
        height: 290,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },

    imagePlaceholder: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },

    discountBadge: {
        position: 'absolute',
        top: 16,
        left: 16,
        paddingVertical: 6,
        paddingHorizontal: 11,
        borderRadius: 9,
    },

    discountText: {
        color: '#FFFFFF',
        fontWeight: '800',
        fontSize: 12,
    },

    outOfStockBanner: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingVertical: 10,
        alignItems: 'center',
        backgroundColor:
            'rgba(0,0,0,0.65)',
    },

    outOfStockText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '700',
    },


    // =========================================================
    // CONTENT
    // =========================================================

    content: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },

    category: {
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        marginBottom: 6,
        fontWeight: '700',
    },

    name: {
        fontSize: 25,
        lineHeight: 31,
        fontWeight: '800',
        marginBottom: 4,
    },

    unit: {
        fontSize: 13,
        marginBottom: 14,
    },


    // =========================================================
    // PRICE
    // =========================================================

    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 10,
        marginBottom: 20,
    },

    price: {
        fontSize: 28,
        fontWeight: '900',
    },

    mrp: {
        fontSize: 15,
        textDecorationLine: 'line-through',
    },

    pct: {
        fontSize: 13,
        fontWeight: '800',
    },


    // =========================================================
    // DELIVERY
    // =========================================================

    deliveryBox: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 13,
        borderRadius: 14,
        borderWidth: 1,
        marginBottom: 22,
    },

    deliveryIcon: {
        width: 38,
        height: 38,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 11,
    },

    deliveryTitle: {
        fontSize: 13,
        fontWeight: '800',
        marginBottom: 2,
    },

    deliveryText: {
        fontSize: 12,
        lineHeight: 18,
    },


    // =========================================================
    // DESCRIPTION
    // =========================================================

    descriptionSection: {
        marginBottom: 18,
    },

    sectionLabel: {
        fontSize: 15,
        fontWeight: '800',
        marginBottom: 9,
        marginTop: 5,
    },

    description: {
        fontSize: 14,
        lineHeight: 21,
    },


    // =========================================================
    // QUANTITY
    // =========================================================

    qtyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 15,
    },

    qtyBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    qtyValueBox: {
        minWidth: 52,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },

    qtyValue: {
        fontSize: 16,
        fontWeight: '800',
    },


    // =========================================================
    // FLOATING CART MESSAGE
    // =========================================================

    addedToast: {
        position: 'absolute',

        left: 14,
        right: 14,
        bottom: 88,

        flexDirection: 'row',
        alignItems: 'center',

        paddingVertical: 12,
        paddingHorizontal: 13,

        borderRadius: 17,
        borderWidth: 1,

        elevation: 10,

        shadowOffset: {
            width: 0,
            height: 4,
        },

        shadowOpacity: 0.16,
        shadowRadius: 10,
    },

    successIcon: {
        width: 38,
        height: 38,
        borderRadius: 19,

        alignItems: 'center',
        justifyContent: 'center',

        marginRight: 10,
    },

    toastContent: {
        flex: 1,
        marginRight: 8,
    },

    addedTitle: {
        fontSize: 13,
        fontWeight: '800',
    },

    addedSubtitle: {
        fontSize: 11,
        marginTop: 3,
    },

    viewCart: {
        fontSize: 12,
        fontWeight: '800',
    },


    // =========================================================
    // FOOTER
    // =========================================================

    footer: {
        flexDirection: 'row',

        gap: 10,

        paddingHorizontal: 14,
        paddingTop: 11,
        paddingBottom: 14,

        borderTopWidth: 1,
    },

    cartBtn: {
        flex: 1,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

        gap: 8,

        paddingVertical: 14,

        borderRadius: 13,
    },

    buyBtn: {
        flex: 1,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

        gap: 7,

        paddingVertical: 14,

        borderRadius: 13,
    },

    footerBtnText: {
        fontWeight: '800',
        fontSize: 14,
    },

})