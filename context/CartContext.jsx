import { createContext, useContext, useState } from 'react'

const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
    const [items, setItems] = useState([]) // { product, qty }

    const addItem = (product, qty = 1) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.product.id === product.id)
            if (existing) {
                return prev.map((i) =>
                    i.product.id === product.id ? { ...i, qty: i.qty + qty } : i
                )
            }
            return [...prev, { product, qty }]
        })
    }

    const removeItem = (productId) => {
        setItems((prev) => prev.filter((i) => i.product.id !== productId))
    }

    const updateQty = (productId, qty) => {
        if (qty < 1) return
        setItems((prev) => prev.map((i) => (i.product.id === productId ? { ...i, qty } : i)))
    }

    const clearCart = () => setItems([])

    const cartCount = items.reduce((sum, i) => sum + i.qty, 0)
    const cartTotal = items.reduce((sum, i) => sum + i.qty * i.product.price, 0)

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, cartCount, cartTotal }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => {
    const ctx = useContext(CartContext)
    if (!ctx) throw new Error('useCart must be used within a CartProvider')
    return ctx
}