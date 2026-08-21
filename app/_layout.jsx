import { StatusBar, TouchableOpacity } from 'react-native'
import { Stack, Link } from 'expo-router'
import { useColorScheme } from 'react-native'
import { Colors } from '../constans/Colors'
import { Ionicons } from '@expo/vector-icons'
import { CartProvider } from '../context/CartContext'

const RootLayout = () => {
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light

    return (
        <CartProvider>
        <>
        <StatusBar value="auto" />
        <Stack screenOptions={{
            headerStyle: { backgroundColor: theme.navBackground },
            headerTintColor: theme.title,
        }}>
           <Stack.Screen
             name="index"
             options={{
               title: 'Home',
               headerRight: () => (
                 <Link href="/profile" asChild>
                   <TouchableOpacity style={{ marginRight: 15 }}>
                     <Ionicons name="person-circle-outline" size={26} color={theme.title} />
                   </TouchableOpacity>
                 </Link>
               ),
             }}
           />
           <Stack.Screen name="about" options={{ title: 'About' }} />
           <Stack.Screen name="contact" options={{ title: 'Contact' }} />
           <Stack.Screen name="profile" options={{ title: 'Profile' }} />
           <Stack.Screen name="login" options={{ title: 'Login' }} />
           <Stack.Screen name="signup" options={{ title: 'Sign Up' }} />
           <Stack.Screen name="product/[id]" options={{ title: 'Product Details' }} />
           <Stack.Screen name="cart" options={{ title: 'Your Cart' }} />
           <Stack.Screen name="search" options={{ title: 'Search' }} />
           <Stack.Screen name="checkout" options={{ title: 'Checkout' }} />
           <Stack.Screen name="order-confirmation" options={{ title: 'Order Confirmation', headerBackVisible: false }} />
        </Stack>
        </>
        </CartProvider>
    )
}
export default RootLayout