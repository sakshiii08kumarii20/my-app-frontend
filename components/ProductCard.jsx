import { useState } from 'react'
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

/* =========================================================
   DISCOUNT CALCULATION
========================================================= */

export const discountPct = (price, mrp) =>
    mrp > price
        ? Math.round(((mrp - price) / mrp) * 100)
        : 0

/* =========================================================
   PRODUCT CARD
========================================================= */

const ProductCard = ({
    item,
    theme,
    cardWidth = 165,
}) => {
    const pct = discountPct(item.price, item.mrp)

    const [imgFailed, setImgFailed] = useState(false)
    const [liked, setLiked] = useState(false)

    const showImage = item.imageUrl && !imgFailed

    return (
        <View
            style={[
                styles.productCard,
                {
                    width: cardWidth,
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                },
            ]}
        >

            {/* =================================================
                PRODUCT IMAGE
            ================================================= */}

            <View
                style={[
                    styles.imageContainer,
                    {
                        backgroundColor:
                            theme.imageBackground ||
                            theme.uiBackground ||
                            theme.card,
                    },
                ]}
            >

                {showImage ? (
                    <Image
                        source={{ uri: item.imageUrl }}
                        style={styles.productImage}
                        resizeMode="cover"
                        onError={() => setImgFailed(true)}
                    />
                ) : (
                    <View
                        style={[
                            styles.imagePlaceholder,
                            {
                                backgroundColor:
                                    theme.imagePlaceholder ||
                                    theme.uiBackground ||
                                    theme.card,
                            },
                        ]}
                    >
                        <Ionicons
                            name="image-outline"
                            size={38}
                            color={
                                theme.textMuted ||
                                theme.subtitle ||
                                theme.text
                            }
                        />
                    </View>
                )}

                {/* =================================================
                    DISCOUNT BADGE
                ================================================= */}

                {pct > 0 && (
                    <View
                        style={[
                            styles.discountBadge,
                            {
                                backgroundColor:
                                    theme.saleBadge ||
                                    theme.accent ||
                                    theme.primary,
                            },
                        ]}
                    >
                        <Text style={styles.discountText}>
                            {pct}% OFF
                        </Text>
                    </View>
                )}

                {/* =================================================
                    WISHLIST
                ================================================= */}

                <TouchableOpacity
                    style={[
                        styles.wishlistButton,
                        {
                            backgroundColor:
                                theme.surface ||
                                theme.card,

                            borderColor:
                                theme.borderLight ||
                                theme.border,
                        },
                    ]}
                    onPress={() => setLiked(!liked)}
                    activeOpacity={0.8}
                >
                    <Ionicons
                        name={
                            liked
                                ? 'heart'
                                : 'heart-outline'
                        }
                        size={18}
                        color={
                            liked
                                ? theme.wishlistActive ||
                                  theme.danger
                                : theme.textMuted ||
                                  theme.subtitle
                        }
                    />
                </TouchableOpacity>

                {/* =================================================
                    PRICE PILL
                ================================================= */}

                <View
                    style={[
                        styles.pricePill,
                        {
                            backgroundColor:
                                theme.primary,
                        },
                    ]}
                >
                    <Text style={styles.priceText}>
                        ₹{item.price}
                    </Text>
                </View>

                {/* =================================================
                    OUT OF STOCK
                ================================================= */}

                {!item.inStock && (
                    <View
                        style={[
                            styles.outOfStockOverlay,
                            {
                                backgroundColor:
                                    theme.overlay ||
                                    'rgba(0,0,0,0.65)',
                            },
                        ]}
                    >
                        <Text style={styles.outOfStockText}>
                            OUT OF STOCK
                        </Text>
                    </View>
                )}

            </View>

            {/* =================================================
                PRODUCT INFORMATION
            ================================================= */}

            <View style={styles.productInfo}>

                <Text
                    style={[
                        styles.productName,
                        {
                            color:
                                theme.title ||
                                theme.text,
                        },
                    ]}
                    numberOfLines={2}
                >
                    {item.name}
                </Text>

                {/* =================================================
                    PRICE ROW
                ================================================= */}

                <View style={styles.priceRow}>

                    <Text
                        style={[
                            styles.currentPrice,
                            {
                                color:
                                    theme.productPrice ||
                                    theme.primary ||
                                    theme.title,
                            },
                        ]}
                    >
                        ₹{item.price}
                    </Text>

                    {item.mrp > item.price && (
                        <Text
                            style={[
                                styles.mrp,
                                {
                                    color:
                                        theme.productOldPrice ||
                                        theme.textMuted ||
                                        theme.subtitle,
                                },
                            ]}
                        >
                            ₹{item.mrp}
                        </Text>
                    )}

                </View>

                {/* =================================================
                    SAVINGS
                ================================================= */}

                {item.mrp > item.price && (
                    <Text
                        style={[
                            styles.savings,
                            {
                                color:
                                    theme.success ||
                                    theme.accent ||
                                    theme.primary,
                            },
                        ]}
                    >
                        You save ₹{item.mrp - item.price}
                    </Text>
                )}

            </View>

        </View>
    )
}

export default ProductCard

/* =============================================================
   STYLES
============================================================= */

const styles = StyleSheet.create({

    /* =========================================================
       CARD
    ========================================================= */

    productCard: {
        borderRadius: 18,
        overflow: 'hidden',
        borderWidth: 1,
        paddingBottom: 10,
    },

    /* =========================================================
       IMAGE
    ========================================================= */

    imageContainer: {
        height: 170,
        borderRadius: 18,
        overflow: 'hidden',
        position: 'relative',
    },

    productImage: {
        width: '100%',
        height: '100%',
    },

    imagePlaceholder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    /* =========================================================
       DISCOUNT
    ========================================================= */

    discountBadge: {
        position: 'absolute',
        top: 10,
        left: 10,
        paddingHorizontal: 9,
        paddingVertical: 6,
        borderRadius: 9,
    },

    discountText: {
        color: '#FFFFFF',
        fontSize: 9,
        fontWeight: '900',
        letterSpacing: 0.4,
    },

    /* =========================================================
       WISHLIST
    ========================================================= */

    wishlistButton: {
        position: 'absolute',
        top: 9,
        right: 9,
        width: 35,
        height: 35,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },

    /* =========================================================
       PRICE PILL
    ========================================================= */

    pricePill: {
        position: 'absolute',
        bottom: 9,
        left: 9,
        paddingHorizontal: 11,
        paddingVertical: 6,
        borderRadius: 15,
    },

    priceText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '900',
    },

    /* =========================================================
       OUT OF STOCK
    ========================================================= */

    outOfStockOverlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        paddingVertical: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },

    outOfStockText: {
        color: '#FFFFFF',
        fontSize: 9,
        fontWeight: '900',
        letterSpacing: 0.8,
    },

    /* =========================================================
       PRODUCT INFORMATION
    ========================================================= */

    productInfo: {
        paddingHorizontal: 10,
        paddingTop: 11,
    },

    productName: {
        fontSize: 13,
        fontWeight: '700',
        lineHeight: 18,
        minHeight: 36,
    },

    /* =========================================================
       PRICE ROW
    ========================================================= */

    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
        gap: 7,
    },

    currentPrice: {
        fontSize: 15,
        fontWeight: '900',
    },

    mrp: {
        fontSize: 11,
        textDecorationLine: 'line-through',
    },

    /* =========================================================
       SAVINGS
    ========================================================= */

    savings: {
        fontSize: 10,
        fontWeight: '700',
        marginTop: 4,
    },

})