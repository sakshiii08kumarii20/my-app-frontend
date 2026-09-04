import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react'

import AsyncStorage from '@react-native-async-storage/async-storage'

import { fetchProducts } from '../constans/api'


// ============================================================
// CACHE
// ============================================================

const PRODUCTS_CACHE_KEY = '@gazeit_products_cache'

const CACHE_TIME_KEY = '@gazeit_products_cache_time'

// Cache is considered fresh for 10 minutes
const CACHE_DURATION = 10 * 60 * 1000


// ============================================================
// CONTEXT
// ============================================================

const ProductContext = createContext(null)


// ============================================================
// PROVIDER
// ============================================================

export const ProductProvider = ({ children }) => {

    const [products, setProducts] = useState([])

    const [loading, setLoading] = useState(true)

    const [error, setError] = useState(false)


    // ========================================================
    // FETCH FROM BACKEND
    // ========================================================

    const fetchLatestProducts = async () => {

        try {

            console.log(
                'PRODUCTS: Fetching latest products...'
            )

            const data = await fetchProducts()

            const latestProducts =
                Array.isArray(data)
                    ? data
                    : []


            // Update memory
            setProducts(latestProducts)


            // Save products
            await AsyncStorage.setItem(
                PRODUCTS_CACHE_KEY,
                JSON.stringify(latestProducts)
            )


            // Save cache timestamp
            await AsyncStorage.setItem(
                CACHE_TIME_KEY,
                Date.now().toString()
            )


            console.log(
                `PRODUCTS: ${latestProducts.length} products cached`
            )

            return latestProducts

        } catch (err) {

            console.log(
                'PRODUCTS FETCH ERROR:',
                err
            )

            throw err
        }
    }


    // ========================================================
    // LOAD CACHE + BACKGROUND REFRESH
    // ========================================================

    const loadProducts = async () => {

        try {

            setError(false)


            // ==================================================
            // READ CACHE
            // ==================================================

            const cachedProducts =
                await AsyncStorage.getItem(
                    PRODUCTS_CACHE_KEY
                )

            const cachedTime =
                await AsyncStorage.getItem(
                    CACHE_TIME_KEY
                )


            const cacheAge =
                cachedTime
                    ? Date.now() -
                      Number(cachedTime)
                    : Infinity


            const hasCache =
                cachedProducts &&
                Array.isArray(
                    JSON.parse(cachedProducts)
                )


            // ==================================================
            // CACHE EXISTS
            // ==================================================

            if (hasCache) {

                const parsedProducts =
                    JSON.parse(cachedProducts)


                // Show cached products immediately
                setProducts(parsedProducts)

                // IMPORTANT:
                // Don't show the loading screen
                // when cached products exist.
                setLoading(false)


                console.log(
                    `PRODUCTS: Loaded ${parsedProducts.length} products from cache`
                )


                // ==================================================
                // CACHE FRESH
                // ==================================================

                if (cacheAge < CACHE_DURATION) {

                    console.log(
                        'PRODUCTS: Cache is fresh'
                    )

                    return
                }


                // ==================================================
                // CACHE STALE
                // ==================================================

                console.log(
                    'PRODUCTS: Cache is stale, refreshing in background...'
                )


                // Background refresh
                try {

                    await fetchLatestProducts()

                } catch (err) {

                    console.log(
                        'PRODUCTS BACKGROUND REFRESH ERROR:',
                        err
                    )

                    // Cached products are still usable.
                    // Don't show an error screen.
                }

                return
            }


            // ==================================================
            // NO CACHE
            // ==================================================

            console.log(
                'PRODUCTS: No cache found'
            )

            setLoading(true)

            await fetchLatestProducts()

            setLoading(false)

        } catch (err) {

            console.log(
                'PRODUCT CONTEXT ERROR:',
                err
            )

            setError(true)

            setLoading(false)
        }
    }


    // ========================================================
    // FIRST LOAD
    // ========================================================

    useEffect(() => {

        loadProducts()

    }, [])


    // ========================================================
    // MANUAL REFRESH
    // ========================================================

    const refreshProducts = async () => {

        try {

            setError(false)

            setLoading(true)

            await fetchLatestProducts()

            setLoading(false)

        } catch (err) {

            setError(true)

            setLoading(false)
        }
    }


    // ========================================================
    // PROVIDER
    // ========================================================

    return (
        <ProductContext.Provider
            value={{
                products,
                loading,
                error,
                refreshProducts,
            }}
        >
            {children}
        </ProductContext.Provider>
    )
}


// ============================================================
// HOOK
// ============================================================

export const useProducts = () => {

    const context =
        useContext(ProductContext)

    if (!context) {

        throw new Error(
            'useProducts must be used inside ProductProvider'
        )

    }

    return context
}