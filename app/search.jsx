import { useState, useMemo } from 'react'
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, useColorScheme, Modal } from 'react-native'
import { useLocalSearchParams, Link, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '../constans/Colors'
import { PRODUCTS } from '../constans/Products'
import ThemeView from '../components/ThemeView'
import ProductCard from '../components/ProductCard'

const CATEGORIES = ['All', ...new Set(PRODUCTS.map((p) => p.category))]

const SORT_OPTIONS = [
    { key: 'relevance', label: 'Relevance' },
    { key: 'price_low', label: 'Price: Low to High' },
    { key: 'price_high', label: 'Price: High to Low' },
    { key: 'rating', label: 'Rating' },
]

const PRICE_RANGES = [
    { key: 'all', label: 'Any Price', min: 0, max: Infinity },
    { key: 'under50', label: 'Under ₹50', min: 0, max: 50 },
    { key: '50to100', label: '₹50–100', min: 50, max: 100 },
    { key: '100to250', label: '₹100–250', min: 100, max: 250 },
    { key: 'above250', label: 'Above ₹250', min: 250, max: Infinity },
]

const Search = () => {
    const params = useLocalSearchParams()
    const router = useRouter()
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light

    const [query, setQuery] = useState(params.q ?? '')
    const [category, setCategory] = useState('All')
    const [priceRange, setPriceRange] = useState('all')
    const [sort, setSort] = useState('relevance')
    const [sortModalOpen, setSortModalOpen] = useState(false)

    const results = useMemo(() => {
        const range = PRICE_RANGES.find((r) => r.key === priceRange)
        let list = PRODUCTS.filter((p) => {
            const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase())
            const matchesCategory = category === 'All' || p.category === category
            const matchesPrice = p.price >= range.min && p.price <= range.max
            return matchesQuery && matchesCategory && matchesPrice
        })
        if (sort === 'price_low') list = [...list].sort((a, b) => a.price - b.price)
        if (sort === 'price_high') list = [...list].sort((a, b) => b.price - a.price)
        if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating)
        return list
    }, [query, category, priceRange, sort])

    const activeSortLabel = SORT_OPTIONS.find((s) => s.key === sort).label

    return (
        <ThemeView style={{ flex: 1 }}>

            {/* Search bar */}
            <View style={styles.topRow}>
                <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 4 }}>
                    <Ionicons name="arrow-back" size={22} color={theme.title} />
                </TouchableOpacity>
                <View style={[styles.searchBar, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <Ionicons name="search" size={18} color={theme.subtitle} />
                    <TextInput
                        placeholder="Search milk, curd, ghee and more"
                        placeholderTextColor={theme.subtitle}
                        value={query}
                        onChangeText={setQuery}
                        autoFocus={!params.q}
                        style={[styles.searchInput, { color: theme.text }]}
                    />
                    {query.length > 0 && (
                        <TouchableOpacity onPress={() => setQuery('')}>
                            <Ionicons name="close-circle" size={18} color={theme.subtitle} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Category chips */}
            <Text style={[styles.filterLabel, { color: theme.subtitle }]}>Category</Text>
            <View style={styles.chipWrap}>
                {CATEGORIES.map((cat) => {
                    const active = cat === category
                    return (
                        <TouchableOpacity
                            key={cat}
                            onPress={() => setCategory(cat)}
                            style={[styles.chip, { backgroundColor: active ? Colors.primary : theme.card, borderColor: active ? Colors.primary : theme.border }]}
                        >
                            <Text style={{ color: active ? '#fff' : theme.text, fontSize: 12, fontWeight: '600' }}>{cat}</Text>
                        </TouchableOpacity>
                    )
                })}
            </View>

            {/* Price chips */}
            <Text style={[styles.filterLabel, { color: theme.subtitle }]}>Price</Text>
            <View style={styles.chipWrap}>
                {PRICE_RANGES.map((r) => {
                    const active = r.key === priceRange
                    return (
                        <TouchableOpacity
                            key={r.key}
                            onPress={() => setPriceRange(r.key)}
                            style={[styles.chip, { backgroundColor: active ? Colors.teal : theme.card, borderColor: active ? Colors.teal : theme.border }]}
                        >
                            <Text style={{ color: active ? '#fff' : theme.text, fontSize: 12, fontWeight: '600' }}>{r.label}</Text>
                        </TouchableOpacity>
                    )
                })}
            </View>

            {/* Sort */}
            <View style={styles.sortRow}>
                <Text style={[styles.resultCount, { color: theme.subtitle }]}>{results.length} results</Text>
                <TouchableOpacity
                    style={[styles.sortBtn, { borderColor: theme.border, backgroundColor: theme.card }]}
                    onPress={() => setSortModalOpen(true)}
                >
                    <Ionicons name="swap-vertical" size={14} color={Colors.primary} />
                    <Text style={{ color: theme.text, fontSize: 12, fontWeight: '600' }}>{activeSortLabel}</Text>
                </TouchableOpacity>
            </View>

            {/* Results */}
            {results.length === 0 ? (
                <View style={styles.emptyState}>
                    <Ionicons name="search-outline" size={48} color={theme.subtitle} />
                    <Text style={[styles.emptyText, { color: theme.text }]}>No products found</Text>
                    <Text style={[styles.emptySubtext, { color: theme.subtitle }]}>Try adjusting your filters</Text>
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.grid}>
                    {results.map((item) => (
                        <Link href={`/product/${item.id}`} asChild key={item.id}>
                            <TouchableOpacity>
                                <ProductCard item={item} theme={theme} cardWidth={165} />
                            </TouchableOpacity>
                        </Link>
                    ))}
                </ScrollView>
            )}

            {/* Sort modal */}
            <Modal visible={sortModalOpen} transparent animationType="fade" onRequestClose={() => setSortModalOpen(false)}>
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setSortModalOpen(false)}>
                    <View style={[styles.modalSheet, { backgroundColor: theme.card }]}>
                        <Text style={[styles.modalTitle, { color: theme.title }]}>Sort by</Text>
                        {SORT_OPTIONS.map((s) => (
                            <TouchableOpacity
                                key={s.key}
                                style={styles.modalOption}
                                onPress={() => { setSort(s.key); setSortModalOpen(false) }}
                            >
                                <Text style={{ color: s.key === sort ? Colors.primary : theme.text, fontSize: 14, fontWeight: s.key === sort ? '700' : '400' }}>
                                    {s.label}
                                </Text>
                                {s.key === sort && <Ionicons name="checkmark" size={18} color={Colors.primary} />}
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>
        </ThemeView>
    )
}
export default Search

const styles = StyleSheet.create({
    topRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 12, gap: 10 },
    searchBar: {
        flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10,
        borderWidth: 1, borderRadius: 14, paddingHorizontal: 14, height: 46,
    },
    searchInput: { flex: 1, fontSize: 14 },

    filterLabel: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, paddingHorizontal: 16, marginTop: 14, marginBottom: 8 },
    chipWrap: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 8 },
    chip: { borderWidth: 1, borderRadius: 16, paddingVertical: 7, paddingHorizontal: 14 },

    sortRow: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 16, marginTop: 16, marginBottom: 8,
    },
    resultCount: { fontSize: 12 },
    sortBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        borderWidth: 1, borderRadius: 10, paddingVertical: 6, paddingHorizontal: 12,
    },

    grid: {
        flexDirection: 'row', flexWrap: 'wrap',
        paddingHorizontal: 12, justifyContent: 'space-between', rowGap: 22, paddingBottom: 30,
    },

    emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, paddingBottom: 80 },
    emptyText: { fontSize: 16, fontWeight: '700' },
    emptySubtext: { fontSize: 13 },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
    modalSheet: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 34 },
    modalTitle: { fontSize: 16, fontWeight: '800', marginBottom: 12 },
    modalOption: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingVertical: 12,
    },
})