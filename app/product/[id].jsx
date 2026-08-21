import { useState, useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, useColorScheme, ActivityIndicator, Image } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '../../constans/Colors'
import { fetchProductById } from '../../constans/api'
import { useCart } from '../../context/CartContext'
import ThemeView from '../../components/ThemeView'

const discountPct = (price, mrp) => (mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0)

const ProductDetail = () => {
    const { id } = useLocalSearchParams()
    const router = useRouter()
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light
    const [qty, setQty] = useState(1)
    const { addItem } = useCart()

    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchProductById(id)
            .then(setProduct)
            .finally(() => setLoading(false))
    }, [id])

    if (loading) {
        return (
            <ThemeView style={styles.center}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </ThemeView>
        )
    }

    if (!product) {
        return (
            <ThemeView style={styles.center}>
                <Text style={{ color: theme.text }}>Product not found</Text>
            </ThemeView>
        )
    }

    const pct = discountPct(product.price, product.mrp)

    const handleAddToCart = () => {
        addItem(product, qty)
        router.push('/cart')
    }

    const handleBuyNow = () => {
        addItem(product, qty)
        router.push('/checkout')
    }

    return (
        <ThemeView style={{ flex: 1 }}>
            <ScrollView showsVerticalScrollIndicator={false}>

                <View style={[styles.imageBox, { backgroundColor: product.color }]}>
                    {product.imageUrl && (
                        <Image
                            source={{ uri: product.imageUrl }}
                            style={StyleSheet.absoluteFill}
                            resizeMode="cover"
                        />
                    )}
                    {pct > 0 && (
                        <View style={[styles.discountBadge, { backgroundColor: Colors.deal }]}>
                            <Text style={styles.discountText}>{pct}% OFF</Text>
                        </View>
                    )}
                    {!product.inStock && (
                        <View style={styles.outOfStockBanner}>
                            <Text style={styles.outOfStockText}>Out of Stock</Text>
                        </View>
                    )}
                </View>

                <View style={styles.content}>
                    <Text style={[styles.category, { color: theme.subtitle }]}>{product.category}</Text>
                    <Text style={[styles.name, { color: theme.title }]}>{product.name}</Text>
                    <Text style={[styles.unit, { color: theme.subtitle }]}>{product.unit}</Text>

                    <View style={styles.priceRow}>
                        <Text style={[styles.price, { color: theme.title }]}>₹{product.price}</Text>
                        {product.mrp > product.price && (
                            <>
                                <Text style={[styles.mrp, { color: theme.subtitle }]}>₹{product.mrp}</Text>
                                <Text style={[styles.pct, { color: Colors.deal }]}>{pct}% off</Text>
                            </>
                        )}
                    </View>

                    <View style={[styles.deliveryBox, { backgroundColor: theme.uiBackground }]}>
                        <Ionicons name="cube-outline" size={18} color={Colors.teal} />
                        <Text style={[styles.deliveryText, { color: theme.text }]}>Fresh delivery every morning by 7 AM</Text>
                    </View>

                    {product.description ? (
                        <>
                            <Text style={[styles.sectionLabel, { color: theme.title }]}>Description</Text>
                            <Text style={[styles.description, { color: theme.text }]}>{product.description}</Text>
                        </>
                    ) : null}

                    <Text style={[styles.sectionLabel, { color: theme.title }]}>Quantity</Text>
                    <View style={styles.qtyRow}>
                        <TouchableOpacity
                            style={[styles.qtyBtn, { borderColor: theme.border }]}
                            onPress={() => setQty((q) => Math.max(1, q - 1))}
                        >
                            <Ionicons name="remove" size={18} color={theme.text} />
                        </TouchableOpacity>
                        <Text style={[styles.qtyValue, { color: theme.text }]}>{qty}</Text>
                        <TouchableOpacity
                            style={[styles.qtyBtn, { borderColor: theme.border }]}
                            onPress={() => setQty((q) => q + 1)}
                        >
                            <Ionicons name="add" size={18} color={theme.text} />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            <View style={[styles.footer, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
                <TouchableOpacity
                    style={[styles.cartBtn, { backgroundColor: Colors.navy, opacity: product.inStock ? 1 : 0.5 }]}
                    onPress={handleAddToCart}
                    disabled={!product.inStock}
                >
                    <Ionicons name="cart-outline" size={18} color="#fff" />
                    <Text style={styles.footerBtnText}>Add to Cart</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.buyBtn, { backgroundColor: Colors.deal, opacity: product.inStock ? 1 : 0.5 }]}
                    onPress={handleBuyNow}
                    disabled={!product.inStock}
                >
                    <Text style={styles.footerBtnText}>Buy Now</Text>
                </TouchableOpacity>
            </View>
        </ThemeView>
    )
}
export default ProductDetail

const styles = StyleSheet.create({
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    imageBox: { height: 280, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
    discountBadge: {
        position: 'absolute', top: 16, left: 16,
        paddingVertical: 4, paddingHorizontal: 10, borderRadius: 6,
    },
    discountText: { color: '#fff', fontWeight: '800', fontSize: 12 },
    outOfStockBanner: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: 'rgba(0,0,0,0.6)', paddingVertical: 8, alignItems: 'center',
    },
    outOfStockText: { color: '#fff', fontSize: 13, fontWeight: '700' },

    content: { padding: 18 },
    category: { fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
    name: { fontSize: 22, fontWeight: '800', marginBottom: 2 },
    unit: { fontSize: 14, marginBottom: 14 },

    priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 10, marginBottom: 16 },
    price: { fontSize: 26, fontWeight: '800' },
    mrp: { fontSize: 15, textDecorationLine: 'line-through' },
    pct: { fontSize: 14, fontWeight: '700' },

    deliveryBox: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        padding: 12, borderRadius: 10, marginBottom: 20,
    },
    deliveryText: { fontSize: 13 },

    sectionLabel: { fontSize: 15, fontWeight: '700', marginBottom: 8, marginTop: 6 },
    description: { fontSize: 14, lineHeight: 21, marginBottom: 16 },

    qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 30 },
    qtyBtn: { width: 36, height: 36, borderRadius: 8, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    qtyValue: { fontSize: 16, fontWeight: '700', minWidth: 20, textAlign: 'center' },

    footer: {
        flexDirection: 'row', gap: 12, padding: 14, borderTopWidth: 1,
    },
    cartBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 13, borderRadius: 10 },
    buyBtn: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 13, borderRadius: 10 },
    footerBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
})