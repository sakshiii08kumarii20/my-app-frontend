
// ============================================================
// API CONFIGURATION
// ============================================================

export const API_BASE_URL =
    'http://192.168.0.131:4000/api'

// If your PC's IP changes, update the IP above.
// You can find it with:
// ipconfig
// ============================================================


// ============================================================
// FETCH ALL PRODUCTS
// ============================================================

export const fetchProducts = async () => {
    try {
        console.log('=================================')
        console.log('FETCHING PRODUCTS')
        console.log('=================================')

        const res = await fetch(`${API_BASE_URL}/products`)

        const responseText = await res.text()

        if (!res.ok) {
            console.error(
                'Products API failed:',
                res.status,
                responseText
            )

            throw new Error(
                `Failed to fetch products (${res.status})`
            )
        }

        let data

        try {
            data = JSON.parse(responseText)
        } catch (error) {
            console.error(
                'Invalid JSON from products API:',
                responseText
            )

            throw new Error(
                'Products API returned invalid JSON'
            )
        }

        // ----------------------------------------------------
        // Backend may return either:
        //   [...]
        // or
        //   { products: [...] }
        // ----------------------------------------------------

        const products = Array.isArray(data)
            ? data
            : data.products ?? []

        console.log(
            `PRODUCTS RECEIVED: ${products.length}`
        )

        // ----------------------------------------------------
        // Convert Zoho POS product structure into
        // the structure used by the React Native app.
        // ----------------------------------------------------

        return products.map((p) => {

            // ------------------------------------------------
// IMAGE
// ------------------------------------------------

let imageUrl = null

if (p.storefront_image_url) {
    // Backend returns a relative URL.
    // Convert it to the full backend URL for React Native.
    imageUrl =
        `${API_BASE_URL.replace('/api', '')}${p.storefront_image_url}`
} else {
    // Fallbacks
    imageUrl =
        p.image_url ??
        p.image ??
        null
}

// Empty string should behave like null
if (
    typeof imageUrl === 'string' &&
    imageUrl.trim() === ''
) {
    imageUrl = null
}

console.log('PRODUCT IMAGE:', {
    name: p.name,
    backendImage: p.storefront_image_url,
    appImage: imageUrl,
})

            // Empty string should behave like null
            if (
                typeof imageUrl === 'string' &&
                imageUrl.trim() === ''
            ) {
                imageUrl = null
            }

            // ------------------------------------------------
            // PRICE
            // ------------------------------------------------

            const price =
                Number(p.rate ?? p.selling_price ?? 0)

            const mrp =
                Number(
                    p.label_rate ??
                    p.label_price ??
                    p.rate ??
                    p.selling_price ??
                    0
                )

            // ------------------------------------------------
            // STOCK
            // ------------------------------------------------

            const stockCount =
                Number(
                    p.stock_count ??
                    p.stock_on_hand ??
                    p.available_stock ??
                    p.overall_stock ??
                    0
                )

            const trackInventory =
                Boolean(p.track_inventory)

            // If backend gives an explicit stock number,
            // use it.
            //
            // If inventory is not being tracked, assume
            // the product is available.
            const inStock =
                !trackInventory ||
                stockCount > 0

            // ------------------------------------------------
            // RETURN APP PRODUCT
            // ------------------------------------------------

            return {
                // POS item ID
                id: p.item_id,

                // Keep original POS ID as well
                posItemId: p.item_id,

                // Product information
                name:
                    p.name ??
                    'Unnamed Product',

                unit:
                    p.unit ??
                    '',

                // Price
                price,

                // MRP / label price
                mrp,

                // Image
                imageUrl,

                // Fashion app accent color
                color:
                    p.color ??
                    '#C98F8F',

                // Category
                category:
                    p.category_name ??
                    p.category ??
                    'Other',

                // Description
                description:
                    p.description ??
                    '',

                // Stock
                inStock,

                stockCount,

                // SKU
                sku:
                    p.sku ??
                    '',
            }
        })

    } catch (error) {

        console.error(
            'fetchProducts API error:',
            error
        )

        throw error
    }
}


// ============================================================
// FETCH SINGLE PRODUCT
// ============================================================

export const fetchProductById = async (id) => {
    try {
        const products = await fetchProducts()

        return products.find(
            (p) =>
                String(p.id) === String(id)
        ) ?? null

    } catch (error) {

        console.error(
            'fetchProductById API error:',
            error
        )

        throw error
    }
}


// ============================================================
// FETCH CUSTOMERS
// ============================================================

export const fetchCustomers = async () => {
    try {
        console.log('=================================')
        console.log('FETCHING CUSTOMERS')
        console.log('=================================')

        const res = await fetch(
            `${API_BASE_URL}/customers`
        )

        const responseText =
            await res.text()

        if (!res.ok) {
            console.error(
                'Customers API failed:',
                res.status,
                responseText
            )

            throw new Error(
                `Failed to fetch customers (${res.status})`
            )
        }

        let data

        try {
            data = JSON.parse(responseText)
        } catch {
            throw new Error(
                'Customers API returned invalid JSON'
            )
        }

        return (
            data.customers ??
            data
        )

    } catch (error) {

        console.error(
            'fetchCustomers API error:',
            error
        )

        throw error
    }
}


// ============================================================
// CREATE SALES ORDER
// ============================================================

export const createSalesOrder = async (
    orderData
) => {

    try {

        console.log('=================================')
        console.log('SENDING ORDER TO BACKEND')
        console.log('=================================')

        console.log(
            JSON.stringify(
                orderData,
                null,
                
            )
        )

        const res = await fetch(
            `${API_BASE_URL}/orders`,
            {
                method: 'POST',

                headers: {
                    'Content-Type':
                        'application/json',

                    'Accept':
                        'application/json',
                },

                body:
                    JSON.stringify(
                        orderData
                    ),
            }
        )

        const responseText =
            await res.text()

        console.log('=================================')
        console.log('BACKEND ORDER RESPONSE')
        console.log('=================================')

        console.log(
            'STATUS:',
            res.status
        )

        console.log(
            'RESPONSE:',
            responseText
        )

        let data

        try {
            data =
                JSON.parse(
                    responseText
                )
        } catch {
            data = {
                error:
                    responseText,
            }
        }

        if (!res.ok) {

            throw new Error(
                data.zoho_response ||
                data.error ||
                data.message ||
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


// ============================================================
// SIGN UP
// ============================================================

export const signupUser = async (
    payload
) => {

    try {

        const res = await fetch(
            `${API_BASE_URL}/auth/signup`,
            {
                method: 'POST',

                headers: {
                    'Content-Type':
                        'application/json',

                    'Accept':
                        'application/json',
                },

                body:
                    JSON.stringify(
                        payload
                    ),
            }
        )

        const responseText =
            await res.text()

        let data

        try {
            data =
                JSON.parse(
                    responseText
                )
        } catch {
            data = {
                error:
                    responseText,
            }
        }

        if (!res.ok) {

            throw new Error(
                data.error ||
                data.message ||
                'Signup failed'
            )
        }

        return data.customer

    } catch (error) {

        console.error(
            'signupUser API error:',
            error
        )

        throw error
    }
}


// ============================================================
// LOGIN
// ============================================================

export const loginUser = async (
    payload
) => {

    try {

        const res = await fetch(
            `${API_BASE_URL}/auth/login`,
            {
                method: 'POST',

                headers: {
                    'Content-Type':
                        'application/json',

                    'Accept':
                        'application/json',
                },

                body:
                    JSON.stringify(
                        payload
                    ),
            }
        )

        const responseText =
            await res.text()

        let data

        try {
            data =
                JSON.parse(
                    responseText
                )
        } catch {
            data = {
                error:
                    responseText,
            }
        }

        if (!res.ok) {

            throw new Error(
                data.error ||
                data.message ||
                'Login failed'
            )
        }

        return data.customer

    } catch (error) {

        console.error(
            'loginUser API error:',
            error
        )

        throw error
    }
}


// ============================================================
// FETCH MY ORDERS
// ============================================================

export const fetchMyOrders = async (
    phone
) => {

    try {

        const res = await fetch(
            `${API_BASE_URL}/orders/customer/${encodeURIComponent(phone)}`
        )

        const responseText =
            await res.text()

        let data

        try {
            data =
                JSON.parse(
                    responseText
                )
        } catch {
            data = {
                error:
                    responseText,
            }
        }

        if (!res.ok) {

            throw new Error(
                data.error ||
                data.message ||
                'Failed to fetch your orders'
            )
        }

        return (
            data.orders ??
            []
        )

    } catch (error) {

        console.error(
            'fetchMyOrders API error:',
            error
        )

        throw error
    }
}


// ============================================================
// OPTIONAL: FETCH CHECKOUT
// ============================================================

export const createCheckout = async (
    checkoutData
) => {

    try {

        const res = await fetch(
            `${API_BASE_URL}/checkout`,
            {
                method: 'POST',

                headers: {
                    'Content-Type':
                        'application/json',

                    'Accept':
                        'application/json',
                },

                body:
                    JSON.stringify(
                        checkoutData
                    ),
            }
        )

        const responseText =
            await res.text()

        let data

        try {
            data =
                JSON.parse(
                    responseText
                )
        } catch {
            data = {
                error:
                    responseText,
            }
        }

        if (!res.ok) {

            throw new Error(
                data.error ||
                data.message ||
                'Checkout creation failed'
            )
        }

        return data

    } catch (error) {

        console.error(
            'createCheckout API error:',
            error
        )

        throw error
    }
}












