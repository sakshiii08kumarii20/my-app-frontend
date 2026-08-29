import { useState } from 'react'
import {
    TextInput,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

import Colors from '../constans/Colors'
import ThemeView from '../components/ThemeView'
import { useAppTheme } from '../context/ThemeContext'
import { signupUser } from '../constans/api'

const Signup = () => {
    const { colorScheme } = useAppTheme()
    const theme = Colors[colorScheme] ?? Colors.light

    const router = useRouter()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSignup = async () => {
        setError('')

        if (
            !name.trim() ||
            !email.trim() ||
            !phone.trim() ||
            !password ||
            !confirmPassword
        ) {
            setError('Please fill in all fields')
            return
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }

        try {
            setLoading(true)

            const customer = await signupUser({
                name: name.trim(),
                email: email.trim(),
                phone: phone.trim(),
                password,
            })

            await AsyncStorage.multiSet([
                ['customerId', String(customer.id)],
                ['customerEmail', customer.email || ''],
                ['customerPhone', customer.phone || ''],
                ['customerName', customer.name || ''],
            ])

            router.replace('/profile')

        } catch (err) {
            setError(err.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    const inputStyle = [
        styles.input,
        {
            backgroundColor: theme.inputBackground,
            borderColor: theme.inputBorder,
            color: theme.inputText,
        },
    ]

    return (
        <ThemeView style={styles.container}>

            {/* Header */}
            <Text
                style={[
                    styles.title,
                    { color: theme.heading },
                ]}
            >
                Create Account
            </Text>

            <Text
                style={[
                    styles.subtitle,
                    { color: theme.textSecondary },
                ]}
            >
                Create your account to get started
            </Text>

            {/* Error */}
            {error ? (
                <Text
                    style={[
                        styles.error,
                        {
                            color: theme.error,
                            backgroundColor: theme.errorLight,
                        },
                    ]}
                >
                    {error}
                </Text>
            ) : null}

            {/* Name */}
            <TextInput
                placeholder="Full Name"
                placeholderTextColor={theme.inputPlaceholder}
                value={name}
                onChangeText={setName}
                style={inputStyle}
            />

            {/* Email */}
            <TextInput
                placeholder="Email"
                placeholderTextColor={theme.inputPlaceholder}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                style={inputStyle}
            />

            {/* Phone */}
            <TextInput
                placeholder="Phone Number"
                placeholderTextColor={theme.inputPlaceholder}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                maxLength={10}
                style={inputStyle}
            />

            {/* Password */}
            <TextInput
                placeholder="Password"
                placeholderTextColor={theme.inputPlaceholder}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={inputStyle}
            />

            {/* Confirm Password */}
            <TextInput
                placeholder="Confirm Password"
                placeholderTextColor={theme.inputPlaceholder}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                style={inputStyle}
            />

            {/* Signup Button */}
            <TouchableOpacity
                style={[
                    styles.button,
                    {
                        backgroundColor: theme.buttonPrimary,
                    },
                ]}
                onPress={handleSignup}
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
                    {loading
                        ? 'Creating account...'
                        : 'Sign Up'}
                </Text>
            </TouchableOpacity>

            {/* Login */}
            <TouchableOpacity
                onPress={() => router.push('/login')}
                style={styles.loginContainer}
            >
                <Text
                    style={[
                        styles.loginText,
                        { color: theme.textSecondary },
                    ]}
                >
                    Already have an account?{' '}
                </Text>

                <Text
                    style={[
                        styles.loginLink,
                        { color: theme.primary },
                    ]}
                >
                    Log In
                </Text>
            </TouchableOpacity>

        </ThemeView>
    )
}

export default Signup

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
        marginBottom: 24,
        textAlign: 'center',
    },

    input: {
        width: '100%',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 14,
        marginBottom: 12,
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

    error: {
        width: '100%',
        padding: 12,
        borderRadius: 10,
        marginBottom: 14,
        textAlign: 'center',
        fontSize: 13,
        fontWeight: '600',
    },

    loginContainer: {
        flexDirection: 'row',
        marginTop: 20,
        alignItems: 'center',
    },

    loginText: {
        fontSize: 14,
    },

    loginLink: {
        fontSize: 14,
        fontWeight: '700',
    },
})