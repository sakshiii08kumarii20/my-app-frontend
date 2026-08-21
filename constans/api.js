const API_BASE_URL = 'http://192.168.0.131:4000/api' // replace with your PC's actual local IP from ipconfig

export const fetchProducts = async () => {
    const res = await fetch(`${API_BASE_URL}/products`)
    if (!res.ok) throw new Error('Failed to fetch products')
    const data = await res.json()

    return data.map((p) => {
        const variant = p.variants?.[0] ?? {}
        const image = p.documents?.[0]
        const imageUrl = image ? `${API_BASE_URL}/product-image/${image.document_id}` : null

        return {
            id: p.product_id,
            name: p.name,
            unit: p.unit ?? '',
            price: variant.rate ?? p.min_rate ?? 0,
            mrp: variant.label_rate ?? variant.rate ?? p.min_rate ?? 0,
            imageUrl,
            color: '#023E8A',
            category: p.category_name ?? 'Other',
            description: p.product_short_description || p.product_description || '',
            inStock: (variant.available_stock ?? p.overall_stock ?? 0) > 0,
            stockCount: variant.available_stock ?? p.overall_stock ?? 0,
        }
    })
}

export const fetchProductById = async (id) => {
    const products = await fetchProducts()
    return products.find((p) => p.id === id)
}
// Fetch customers
export const fetchCustomers = async () => {
    const res = await fetch(`${API_BASE_URL}/customers`)

    if (!res.ok) {
        throw new Error('Failed to fetch customers')
    }

    const data = await res.json()

    return data.customers ?? data
}