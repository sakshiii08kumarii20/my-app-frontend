import { useState } from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import { Colors } from '../constans/Colors'

export const discountPct = (price, mrp) => (mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0)

const ProductCard = ({ item, theme, cardWidth = 150 }) => {
    const pct = discountPct(item.price, item.mrp)
    const [imgFailed, setImgFailed] = useState(false)
    const showImage = item.imageUrl && !imgFailed

    return (
        <View style={[styles.productCard, { width: cardWidth, backgroundColor: theme.card }]}>
            <View style={[styles.productImage, { backgroundColor: item.color }]}>
                {showImage && (
                    <Image
                        source={{ uri: item.imageUrl }}
                        style={StyleSheet.absoluteFill}
                        resizeMode="cover"
                        onError={() => setImgFailed(true)}
                    />
                )}
                {pct > 0 && (
                    <View style={[styles.discountCircle, { backgroundColor: Colors.deal, borderColor: theme.card }]}>
                        <Text style={styles.discountCircleText}>{pct}%{'\n'}OFF</Text>
                    </View>
                )}
                <View style={[styles.pricePill, { backgroundColor: Colors.navy }]}>
                    <Text style={styles.pricePillText}>₹{item.price}</Text>
                </View>
                {!item.inStock && (
                    <View style={styles.outOfStockBanner}>
                        <Text style={styles.outOfStockText}>Out of Stock</Text>
                    </View>
                )}
            </View>

            <View style={styles.productInfo}>
                <Text style={[styles.productName, { color: theme.text }]} numberOfLines={1}>{item.name}</Text>
                <Text style={[styles.unit, { color: theme.subtitle }]}>{item.unit}</Text>
                {item.mrp > item.price && (
                    <Text style={[styles.mrp, { color: theme.subtitle }]}>MRP ₹{item.mrp}</Text>
                )}
            </View>
        </View>
    )
}
export default ProductCard

const styles = StyleSheet.create({
    productCard: { borderRadius: 20, overflow: 'visible', paddingBottom: 6 },
    productImage: { height: 130, borderRadius: 18, overflow: 'hidden' },
    discountCircle: {
        position: 'absolute', top: 8, left: 8,
        width: 34, height: 34, borderRadius: 17, borderWidth: 2,
        alignItems: 'center', justifyContent: 'center',
    },
    discountCircleText: { color: '#fff', fontSize: 8, fontWeight: '800', textAlign: 'center', lineHeight: 9 },
    pricePill: {
        position: 'absolute', bottom: 8, left: 8,
        paddingVertical: 5, paddingHorizontal: 12, borderRadius: 14,
    },
    pricePillText: { color: '#fff', fontSize: 13, fontWeight: '800' },
    outOfStockBanner: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: 'rgba(0,0,0,0.6)', paddingVertical: 4, alignItems: 'center',
    },
    outOfStockText: { color: '#fff', fontSize: 10, fontWeight: '700' },

    productInfo: { paddingHorizontal: 8, paddingTop: 10 },
    productName: { fontSize: 13, fontWeight: '700', marginBottom: 2 },
    unit: { fontSize: 11, marginBottom: 4 },
    mrp: { fontSize: 11, textDecorationLine: 'line-through' },
})