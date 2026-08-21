import { useState, useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, useColorScheme, Dimensions, ActivityIndicator } from 'react-native'
import { Link, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '../constans/Colors'
import ThemeView from '../components/ThemeView'
import ProductCard from '../components/ProductCard'
import { fetchProducts } from '../constans/api'
import { useCart } from '../context/CartContext'

const { width } = Dimensions.get('window')

const CATEGORIES = [
    { name: 'Milk', icon: 'water-outline' },
    { name: 'Curd & Yogurt', icon: 'nutrition-outline' },
    { name: 'Paneer', icon: 'square-outline' },
    { name: 'Ghee & Butter', icon: 'flame-outline' },
    { name: 'Cheese', icon: 'pizza-outline' },
    { name: 'Buttermilk', icon: 'cafe-outline' },
    { name: 'Ice Cream', icon: 'ice-cream-outline' },
]

const BANNERS = [
    { id: 'b1', title: 'Farm Fresh Milk', subtitle: 'Delivered chilled, every morning' },
    { id: 'b2', title: 'Subscribe & Save', subtitle: 'Get 10% off on daily milk delivery' },
    { id: 'b3', title: 'Pure Cow Ghee', subtitle: 'Traditionally made, straight from the farm' },
]

const SectionHeader = ({ title, sub, theme }) => (
    <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderLeft}>
            <View style={[styles.sectionDot, { backgroundColor: Colors.primary }]} />
            <View>
                <Text style={[styles.sectionTitle, { color: theme.title }]}>{title}</Text>
                {sub ? <Text style={[styles.sectionSub, { color: theme.subtitle }]}>{sub}</Text> : null}
            </View>
        </View>
        <TouchableOpacity style={[styles.seeAllBtn, { backgroundColor: theme.uiBackground }]}>
            <Ionicons name="arrow-forward" size={16} color={Colors.primary} />
        </TouchableOpacity>
    </View>
)

const Home = () => {
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light
    const [activeCategory, setActiveCategory] = useState('Milk')
    const { cartCount } = useCart()
    const router = useRouter()

    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        fetchProducts()
            .then(setProducts)
            .catch(() => setError(true))
            .finally(() => setLoading(false))
    }, [])

    const DEALS = products.slice(0, 4)
    const RECOMMENDED = products.slice(4, 8)

    if (loading) {
        return (
            <ThemeView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </ThemeView>
        )
    }

    if (error) {
        return (
            <ThemeView style={styles.loadingContainer}>
                <Ionicons name="cloud-offline-outline" size={40} color={theme.subtitle} />
                <Text style={{ color: theme.text, marginTop: 10 }}>Couldn't load products. Check your connection.</Text>
            </ThemeView>
        )
    }

    return (
        <ThemeView style={{ flex: 1 }}>
            <ScrollView showsVerticalScrollIndicator={false}>

                {/* Curved hero */}
                <View style={[styles.hero, { backgroundColor: Colors.navy }]}>
                    <View style={styles.heroTopRow}>
                        <View>
                            <Text style={styles.heroGreeting}>Deliver to</Text>
                            <View style={styles.heroLocationRow}>
                                <Ionicons name="location" size={14} color={Colors.gold} />
                                <Text style={styles.heroLocation}>Home - 500001</Text>
                                <Ionicons name="chevron-down" size={12} color="#fff" />
                            </View>
                        </View>
                        <Link href="/cart" asChild>
                            <TouchableOpacity style={styles.cartBtn}>
                                <Ionicons name="cart-outline" size={22} color="#fff" />
                                {cartCount > 0 && (
                                    <View style={[styles.cartBadge, { backgroundColor: Colors.deal }]}>
                                        <Text style={styles.cartBadgeText}>{cartCount}</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        </Link>
                    </View>
                    <Text style={styles.heroHeadline}>Farm fresh,{'\n'}delivered daily 🥛</Text>
                </View>

                {/* Floating search capsule */}
                <TouchableOpacity
                    style={[styles.searchCapsule, { backgroundColor: theme.card, shadowColor: theme.shadow }]}
                    activeOpacity={0.8}
                    onPress={() => router.push('/search')}
                >
                    <Ionicons name="search" size={18} color={theme.subtitle} />
                    <Text style={{ flex: 1, color: theme.subtitle, fontSize: 14 }}>Search milk, curd, ghee and more</Text>
                    <View style={[styles.searchDivider, { backgroundColor: theme.border }]} />
                    <Ionicons name="options-outline" size={18} color={Colors.primary} />
                </TouchableOpacity>

                {/* Category pills */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
                    {CATEGORIES.map((cat) => {
                        const active = cat.name === activeCategory
                        return (
                            <TouchableOpacity
                                key={cat.name}
                                onPress={() => setActiveCategory(cat.name)}
                                style={[
                                    styles.categoryPill,
                                    {
                                        backgroundColor: active ? Colors.primary : theme.card,
                                        borderColor: active ? Colors.primary : theme.border,
                                    },
                                ]}
                            >
                                <Ionicons name={cat.icon} size={15} color={active ? '#fff' : Colors.primary} />
                                <Text style={{ color: active ? '#fff' : theme.text, fontSize: 13, fontWeight: '600' }}>
                                    {cat.name}
                                </Text>
                            </TouchableOpacity>
                        )
                    })}
                </ScrollView>

                {/* Banner */}
                <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={{ marginTop: 4 }}>
                    {BANNERS.map((b) => (
                        <View key={b.id} style={[styles.banner, { width: width - 32, marginLeft: 16, backgroundColor: theme.card, borderColor: theme.border }]}>
                            <View style={[styles.bannerAccent, { backgroundColor: Colors.gold }]} />
                            <View style={[styles.bannerAccent2, { backgroundColor: Colors.teal }]} />
                            <Text style={[styles.bannerTitle, { color: theme.title }]}>{b.title}</Text>
                            <Text style={[styles.bannerSubtitle, { color: theme.subtitle }]}>{b.subtitle}</Text>
                            <View style={[styles.bannerCta, { backgroundColor: Colors.primary }]}>
                                <Text style={styles.bannerCtaText}>Shop Now</Text>
                            </View>
                        </View>
                    ))}
                </ScrollView>

                {/* Today's Fresh Picks */}
                {DEALS.length > 0 && (
                    <View style={styles.section}>
                        <SectionHeader title="Today's Fresh Picks" sub="Delivered before 7 AM" theme={theme} />
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
                            {DEALS.map((item) => (
                                <Link href={`/product/${item.id}`} asChild key={item.id}>
                                    <TouchableOpacity style={{ marginRight: 14 }}>
                                        <ProductCard item={item} theme={theme} />
                                    </TouchableOpacity>
                                </Link>
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* Recommended grid */}
                {RECOMMENDED.length > 0 && (
                    <View style={styles.section}>
                        <SectionHeader title="Recommended for you" theme={theme} />
                        <View style={styles.grid}>
                            {RECOMMENDED.map((item) => (
                                <Link href={`/product/${item.id}`} asChild key={item.id}>
                                    <TouchableOpacity>
                                        <ProductCard item={item} theme={theme} cardWidth={(width - 44) / 2} />
                                    </TouchableOpacity>
                                </Link>
                            ))}
                        </View>
                    </View>
                )}

                {products.length === 0 && (
                    <View style={styles.loadingContainer}>
                        <Text style={{ color: theme.subtitle }}>No products available right now.</Text>
                    </View>
                )}

                <View style={styles.footerLinks}>
                    <Link href="/about" style={[styles.link, { color: Colors.primary }]}>About Us</Link>
                    <Link href="/contact" style={[styles.link, { color: Colors.primary }]}>Contact Us</Link>
                </View>

            </ScrollView>
        </ThemeView>
    )
}
export default Home

const styles = StyleSheet.create({
    loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, padding: 30 },

    hero: {
        paddingTop: 14,
        paddingHorizontal: 20,
        paddingBottom: 46,
        borderBottomLeftRadius: 36,
        borderBottomRightRadius: 36,
    },
    heroTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 18,
    },
    heroGreeting: { color: '#C9E3F5', fontSize: 12 },
    heroLocationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
    heroLocation: { color: '#fff', fontSize: 13, fontWeight: '700' },
    heroHeadline: { color: '#fff', fontSize: 24, fontWeight: '800', lineHeight: 30 },

    cartBtn: { position: 'relative' },
    cartBadge: {
        position: 'absolute', top: -6, right: -8,
        borderRadius: 8, width: 16, height: 16,
        alignItems: 'center', justifyContent: 'center',
    },
    cartBadgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },

    searchCapsule: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginHorizontal: 20,
        marginTop: -28,
        borderRadius: 18,
        paddingHorizontal: 16,
        height: 54,
        elevation: 6,
        shadowOpacity: 0.15,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
    },
    searchDivider: { width: 1, height: 22 },

    categoryRow: { paddingHorizontal: 20, paddingVertical: 20, gap: 10 },
    categoryPill: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        borderWidth: 1, borderRadius: 20,
        paddingVertical: 8, paddingHorizontal: 14,
        marginRight: 4,
    },

    banner: {
        height: 140,
        borderRadius: 22,
        borderWidth: 1,
        padding: 20,
        justifyContent: 'center',
        overflow: 'hidden',
    },
    bannerAccent: {
        position: 'absolute', width: 90, height: 90, borderRadius: 45,
        top: -30, right: -20, opacity: 0.18,
    },
    bannerAccent2: {
        position: 'absolute', width: 60, height: 60, borderRadius: 30,
        bottom: -20, right: 40, opacity: 0.15,
    },
    bannerTitle: { fontSize: 19, fontWeight: '800', marginBottom: 4 },
    bannerSubtitle: { fontSize: 13, marginBottom: 12 },
    bannerCta: { alignSelf: 'flex-start', paddingVertical: 6, paddingHorizontal: 14, borderRadius: 14 },
    bannerCtaText: { color: '#fff', fontSize: 12, fontWeight: '700' },

    section: { marginTop: 14 },
    sectionHeader: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 20, marginBottom: 14,
    },
    sectionHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    sectionDot: { width: 8, height: 8, borderRadius: 4 },
    sectionTitle: { fontSize: 16, fontWeight: '800' },
    sectionSub: { fontSize: 11, marginTop: 1 },
    seeAllBtn: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },

    grid: {
        flexDirection: 'row', flexWrap: 'wrap',
        paddingHorizontal: 16, justifyContent: 'space-between', rowGap: 22,
    },
    footerLinks: { flexDirection: 'row', justifyContent: 'center', gap: 24, paddingVertical: 26 },
    link: { textDecorationLine: 'underline' },
})