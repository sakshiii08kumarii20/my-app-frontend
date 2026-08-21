import { useState } from 'react'
import {
    TextInput,
    Text,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    Alert,
} from 'react-native'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { Colors } from '../constans/Colors'
import ThemeView from '../components/ThemeView'
import { fetchCustomers } from '../constans/api'

const Login = () => {
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light

    const router = useRouter()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const handleLogin = async () => {
        if (!email.trim()) {
            Alert.alert('Error', 'Please enter your email')
            return
        }

        if (!password.trim()) {
            Alert.alert('Error', 'Please enter your password')
            return
        }

        try {
            setLoading(true)

            const customers = await fetchCustomers()

            const customer = customers.find(
                (item) =>
                    item.email?.toLowerCase() === email.trim().toLowerCase()
            )

            if (!customer) {
                Alert.alert(
                    'Login Failed',
                    'No customer found with this email.'
                )
                return
            }

            // Store the logged-in customer's ID
            await AsyncStorage.setItem(
                'customerId',
                customer.id
            )

            console.log('Logged in customer:', customer)

            router.replace('/profile')

        } catch (error) {
            console.error('Login error:', error)

            Alert.alert(
                'Error',
                'Something went wrong while logging in.'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <ThemeView style={styles.container}>

            <Text style={[styles.title, { color: theme.title }]}>
                Login
            </Text>

            <TextInput
                placeholder="Email"
                placeholderTextColor={theme.subtitle}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                style={[
                    styles.input,
                    {
                        backgroundColor: theme.uiBackground,
                        borderColor: theme.border,
                        color: theme.text,
                    },
                ]}
            />

            <TextInput
                placeholder="Password"
                placeholderTextColor={theme.subtitle}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={[
                    styles.input,
                    {
                        backgroundColor: theme.uiBackground,
                        borderColor: theme.border,
                        color: theme.text,
                    },
                ]}
            />

            <TouchableOpacity
                style={[
                    styles.button,
                    { backgroundColor: Colors.primary },
                ]}
                onPress={handleLogin}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? 'Logging in...' : 'Log In'}
                </Text>
            </TouchableOpacity>

        </ThemeView>
    )
}

export default Login

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },

    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },

    input: {
        width: '100%',
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },

    button: {
        padding: 14,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },

    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
})