import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
} from 'react-native'

import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

import Colors from '../constans/Colors'

import { useCart } from '../context/CartContext'
import { useAppTheme } from '../context/ThemeContext'

import ThemeView from '../components/ThemeView'


const Cart = () => {

    const { colorScheme } = useAppTheme()

    const theme =
        Colors[colorScheme] || Colors.light

    const router = useRouter()

    const {
        items,
        removeItem,
        updateQty,
        cartTotal,
    } = useCart()


    // =========================================================
    // EMPTY CART
    // =========================================================

    if (items.length === 0) {

        return (
            <ThemeView style={styles.emptyContainer}>

                <Ionicons
                    name="cart-outline"
                    size={64}
                    color={theme.subtitle}
                />

                <Text
                    style={[
                        styles.emptyText,
                        {
                            color: theme.title,
                        },
                    ]}
                >
                    Your cart is empty
                </Text>

                <TouchableOpacity
                    style={[
                        styles.shopBtn,
                        {
                            backgroundColor:
                                theme.buttonAccent,
                        },
                    ]}
                    onPress={() =>
                        router.push('/')
                    }
                >

                    <Text
                        style={[
                            styles.shopBtnText,
                            {
                                color:
                                    theme.buttonAccentText,
                            },
                        ]}
                    >
                        Start Shopping
                    </Text>

                </TouchableOpacity>

            </ThemeView>
        )
    }


    // =========================================================
    // CART
    // =========================================================

    return (
        <ThemeView style={{ flex: 1 }}>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.list}
            >

                {items.map(({ product, qty }) => (

                    <View
                        key={product.id}
                        style={[
                            styles.item,
                            {
                                backgroundColor:
                                    theme.card,

                                borderColor:
                                    theme.border,
                            },
                        ]}
                    >

                        {/* PRODUCT IMAGE / COLOR */}

                        <View
                            style={[
                                styles.thumb,
                                {
                                    backgroundColor:
                                        product.color ||
                                        theme.imageBackground,
                                },
                            ]}
                        />


                        {/* PRODUCT INFO */}

                        <View style={styles.itemInfo}>

                            <Text
                                style={[
                                    styles.itemName,
                                    {
                                        color:
                                            theme.title,
                                    },
                                ]}
                                numberOfLines={1}
                            >
                                {product.name}
                            </Text>


                            <Text
                                style={[
                                    styles.itemPrice,
                                    {
                                        color:
                                            theme.productPrice,
                                    },
                                ]}
                            >
                                ₹{product.price}
                            </Text>


                            {/* QUANTITY */}

                            <View style={styles.qtyRow}>

                                <TouchableOpacity
                                    style={[
                                        styles.qtyBtn,
                                        {
                                            borderColor:
                                                theme.quantityBorder,

                                            backgroundColor:
                                                theme.quantityBackground,
                                        },
                                    ]}
                                    onPress={() =>
                                        updateQty(
                                            product.id,
                                            qty - 1
                                        )
                                    }
                                >

                                    <Ionicons
                                        name="remove"
                                        size={14}
                                        color={theme.text}
                                    />

                                </TouchableOpacity>


                                <Text
                                    style={[
                                        styles.qtyValue,
                                        {
                                            color:
                                                theme.text,
                                        },
                                    ]}
                                >
                                    {qty}
                                </Text>


                                <TouchableOpacity
                                    style={[
                                        styles.qtyBtn,
                                        {
                                            borderColor:
                                                theme.quantityBorder,

                                            backgroundColor:
                                                theme.quantityBackground,
                                        },
                                    ]}
                                    onPress={() =>
                                        updateQty(
                                            product.id,
                                            qty + 1
                                        )
                                    }
                                >

                                    <Ionicons
                                        name="add"
                                        size={14}
                                        color={theme.text}
                                    />

                                </TouchableOpacity>


                                {/* DELETE */}

                                <TouchableOpacity
                                    onPress={() =>
                                        removeItem(
                                            product.id
                                        )
                                    }
                                    style={{
                                        marginLeft: 16,
                                    }}
                                >

                                    <Ionicons
                                        name="trash-outline"
                                        size={18}
                                        color={theme.error}
                                    />

                                </TouchableOpacity>

                            </View>

                        </View>

                    </View>

                ))}

            </ScrollView>


            {/* =================================================
                FOOTER
            ================================================= */}

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

                <View>

                    <Text
                        style={[
                            styles.totalLabel,
                            {
                                color:
                                    theme.subtitle,
                            },
                        ]}
                    >
                        Total
                    </Text>

                    <Text
                        style={[
                            styles.totalValue,
                            {
                                color:
                                    theme.totalPrice,
                            },
                        ]}
                    >
                        ₹{cartTotal}
                    </Text>

                </View>


                <TouchableOpacity
                    style={[
                        styles.checkoutBtn,
                        {
                            backgroundColor:
                                theme.checkoutButton,
                        },
                    ]}
                    onPress={() =>
                        router.push('/checkout')
                    }
                >

                    <Text
                        style={[
                            styles.checkoutBtnText,
                            {
                                color:
                                    theme.checkoutButtonText,
                            },
                        ]}
                    >
                        Proceed to Checkout
                    </Text>

                </TouchableOpacity>

            </View>

        </ThemeView>
    )
}


export default Cart


// =============================================================
// STYLES
// =============================================================

const styles = StyleSheet.create({

    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: 30,
    },

    emptyText: {
        fontSize: 16,
        fontWeight: '600',
    },

    shopBtn: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
        marginTop: 8,
    },

    shopBtnText: {
        fontWeight: '700',
    },


    // =========================================================
    // LIST
    // =========================================================

    list: {
        padding: 16,
        gap: 12,
        paddingBottom: 30,
    },

    item: {
        flexDirection: 'row',
        gap: 12,
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
    },

    thumb: {
        width: 70,
        height: 70,
        borderRadius: 8,
    },

    itemInfo: {
        flex: 1,
        justifyContent: 'center',
    },

    itemName: {
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 4,
    },

    itemPrice: {
        fontSize: 13,
        marginBottom: 8,
        fontWeight: '700',
    },


    // =========================================================
    // QUANTITY
    // =========================================================

    qtyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },

    qtyBtn: {
        width: 28,
        height: 28,
        borderRadius: 6,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    qtyValue: {
        fontSize: 14,
        fontWeight: '700',
        minWidth: 16,
        textAlign: 'center',
    },


    // =========================================================
    // FOOTER
    // =========================================================

    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderTopWidth: 1,
    },

    totalLabel: {
        fontSize: 12,
    },

    totalValue: {
        fontSize: 20,
        fontWeight: '800',
    },

    checkoutBtn: {
        paddingVertical: 13,
        paddingHorizontal: 20,
        borderRadius: 10,
    },

    checkoutBtnText: {
        fontWeight: '700',
    },

})