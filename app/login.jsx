import { useState } from 'react'
import {
    TextInput,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from 'react-native'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

import Colors from '../constans/Colors'
import ThemeView from '../components/ThemeView'
import { useAppTheme } from '../context/ThemeContext'
import { loginUser } from '../constans/api'

const Login = () => {
    const { colorScheme } = useAppTheme()
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

            const customer = await loginUser({
                email: email.trim(),
                password,
            })

            await AsyncStorage.multiSet([
                ['customerId', String(customer.id)],
                ['customerEmail', customer.email || ''],
                ['customerPhone', customer.phone || ''],
                ['customerName', customer.name || ''],
            ])

            router.replace('/profile')

        } catch (error) {
            Alert.alert(
                'Login Failed',
                error.message || 'Invalid email or password'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <ThemeView style={styles.container}>

            {/* Header */}
            <Text
                style={[
                    styles.title,
                    { color: theme.heading },
                ]}
            >
                Welcome Back
            </Text>

            <Text
                style={[
                    styles.subtitle,
                    { color: theme.textSecondary },
                ]}
            >
                Log in to continue shopping
            </Text>

            {/* Email */}
            <TextInput
                placeholder="Email"
                placeholderTextColor={theme.inputPlaceholder}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                style={[
                    styles.input,
                    {
                        backgroundColor: theme.inputBackground,
                        borderColor: theme.inputBorder,
                        color: theme.inputText,
                    },
                ]}
            />

            {/* Password */}
            <TextInput
                placeholder="Password"
                placeholderTextColor={theme.inputPlaceholder}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={[
                    styles.input,
                    {
                        backgroundColor: theme.inputBackground,
                        borderColor: theme.inputBorder,
                        color: theme.inputText,
                    },
                ]}
            />

            {/* Login Button */}
            <TouchableOpacity
                style={[
                    styles.button,
                    {
                        backgroundColor: theme.buttonPrimary,
                    },
                ]}
                onPress={handleLogin}
                disabled={loading}
            >
                <Text
                    style={[
                        styles.buttonText,
                        {
                            color: theme.buttonPrimaryText,
                        },
                    ]}
                >
                    {loading ? 'Logging in...' : 'Log In'}
                </Text>
            </TouchableOpacity>

            {/* Signup */}
            <TouchableOpacity
                onPress={() => router.push('/signup')}
                style={styles.signupContainer}
            >
                <Text
                    style={[
                        styles.signupText,
                        { color: theme.textSecondary },
                    ]}
                >
                    Don't have an account?{' '}
                </Text>

                <Text
                    style={[
                        styles.signupLink,
                        { color: theme.primary },
                    ]}
                >
                    Sign Up
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
        padding: 24,
    },

    title: {
        fontSize: 28,
        fontWeight: '800',
        marginBottom: 6,
    },

    subtitle: {
        fontSize: 14,
        marginBottom: 28,
    },

    input: {
        width: '100%',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 14,
        marginBottom: 14,
        fontSize: 15,
    },

    button: {
        width: '100%',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 6,
    },

    buttonText: {
        fontSize: 15,
        fontWeight: '700',
    },

    signupContainer: {
        flexDirection: 'row',
        marginTop: 22,
        alignItems: 'center',
    },

    signupText: {
        fontSize: 14,
    },

    signupLink: {
        fontSize: 14,
        fontWeight: '700',
    },
})