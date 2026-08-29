const API_BASE_URL = 'http://192.168.0.131:4000/api' // replace with your PC's actual local IP from ipconfig

export const fetchProducts = async () => {
    const res = await fetch(`${API_BASE_URL}/products`)

    if (!res.ok) {
        throw new Error('Failed to fetch products')
    }

    const data = await res.json()

    return data.map((p) => ({
        // POS item ID
        id: p.item_id,

        // Product information
        name: p.name,
        unit: p.unit ?? '',

        // Selling price
        price: p.rate ?? 0,

        // MRP / label price
        mrp: p.label_rate ?? p.rate ?? 0,

        // POS image for now
        imageUrl: null,

        color: '#023E8A',

        category: p.category_name ?? 'Other',

        description: p.description ?? '',

        // Stock
        inStock: p.track_inventory
            ? true
            : true,

        stockCount: 0,

        // Keep important POS information
        posItemId: p.item_id,
        sku: p.sku ?? '',
    }))
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



export const createSalesOrder = async (orderData) => {
    try {
        console.log('=================================')
        console.log('SENDING ORDER TO BACKEND')
        console.log('=================================')

        console.log(
            JSON.stringify(orderData, null, 2)
        )

        const res = await fetch(
            `${API_BASE_URL}/orders`,
            {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },

                body: JSON.stringify(orderData),
            }
        )

        const responseText = await res.text()

        console.log('=================================')
        console.log('BACKEND ORDER RESPONSE')
        console.log('=================================')

        console.log('STATUS:', res.status)
        console.log('RESPONSE:', responseText)

        let data

        try {
            data = JSON.parse(responseText)
        } catch {
            data = {
                error: responseText,
            }
        }

        if (!res.ok) {
            throw new Error(
                data.zoho_response ||
                data.error ||
                `Order creation failed (${res.status})`
            )
        }

        return data

    } catch (error) {
        console.error(
            'createSalesOrder API error:',
            error
        )

        throw error
    }
}


export const signupUser = async (payload) => {
    const res = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Signup failed')
    return data.customer
}

export const loginUser = async (payload) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Login failed')
    return data.customer
}


export const fetchMyOrders = async (phone) => {
    const res = await fetch(`${API_BASE_URL}/orders/customer/${encodeURIComponent(phone)}`)
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Failed to fetch your orders')
    return data.orders
}