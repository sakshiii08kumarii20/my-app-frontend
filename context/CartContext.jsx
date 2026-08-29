import {
    createContext,
    useContext,
    useState,
} from 'react'

const CartContext = createContext(null)

/* =========================================================
   CART PROVIDER
========================================================= */

export const CartProvider = ({ children }) => {
    const [items, setItems] = useState([])

    /* =====================================================
       ADD ITEM
    ===================================================== */

    const addItem = (product, qty = 1) => {
        if (!product || qty < 1) return

        setItems((prev) => {
            const existing = prev.find(
                (item) =>
                    item.product.id === product.id
            )

            if (existing) {
                return prev.map((item) =>
                    item.product.id === product.id
                        ? {
                            ...item,
                            qty: item.qty + qty,
                        }
                        : item
                )
            }

            return [
                ...prev,
                {
                    product,
                    qty,
                },
            ]
        })
    }

    /* =====================================================
       REMOVE ITEM
    ===================================================== */

    const removeItem = (productId) => {
        setItems((prev) =>
            prev.filter(
                (item) =>
                    item.product.id !== productId
            )
        )
    }

    /* =====================================================
       UPDATE QUANTITY
    ===================================================== */

    const updateQty = (productId, qty) => {
        if (qty < 1) {
            removeItem(productId)
            return
        }

        setItems((prev) =>
            prev.map((item) =>
                item.product.id === productId
                    ? {
                        ...item,
                        qty,
                    }
                    : item
            )
        )
    }

    /* =====================================================
       CLEAR CART
    ===================================================== */

    const clearCart = () => {
        setItems([])
    }

    /* =====================================================
       CART COUNT
    ===================================================== */

    const cartCount = items.reduce(
        (total, item) =>
            total + item.qty,
        0
    )

    /* =====================================================
       CART TOTAL
    ===================================================== */

    const cartTotal = items.reduce(
        (total, item) =>
            total +
            item.qty *
                Number(item.product.price || 0),
        0
    )

    /* =====================================================
       CONTEXT VALUE
    ===================================================== */

    const value = {
        items,

        addItem,
        removeItem,
        updateQty,
        clearCart,

        cartCount,
        cartTotal,
    }

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    )
}

/* =========================================================
   USE CART
========================================================= */

export const useCart = () => {
    const context = useContext(CartContext)

    if (!context) {
        throw new Error(
            'useCart must be used within a CartProvider'
        )
    }

    return context
}