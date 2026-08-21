import { useState } from 'react'
import { TextInput, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native'
import { Link } from 'expo-router'
import { Colors } from '../constans/Colors'
import ThemeView from '../components/ThemeView'

const Signup = () => {
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')

    const handleSignup = () => {
        setError('')
        if (!name || !email || !password || !confirmPassword) {
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
        // auth/signup API call goes here
    }

    const inputStyle = [styles.input, { backgroundColor: theme.uiBackground, borderColor: theme.border, color: theme.text }]

    return (
        <ThemeView style={styles.container}>
            <Text style={[styles.title, { color: theme.title }]}>Create Account</Text>

            {error ? <Text style={[styles.error, { color: Colors.danger }]}>{error}</Text> : null}

            <TextInput placeholder="Full Name" placeholderTextColor={theme.subtitle} value={name} onChangeText={setName} style={inputStyle} />
            <TextInput placeholder="Email" placeholderTextColor={theme.subtitle} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" style={inputStyle} />
            <TextInput placeholder="Password" placeholderTextColor={theme.subtitle} value={password} onChangeText={setPassword} secureTextEntry style={inputStyle} />
            <TextInput placeholder="Confirm Password" placeholderTextColor={theme.subtitle} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry style={inputStyle} />

            <TouchableOpacity style={[styles.button, { backgroundColor: Colors.primary }]} onPress={handleSignup}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <Link href="/login" style={[styles.link, { color: Colors.primary }]}>
                Already have an account? Log in
            </Link>
        </ThemeView>
    )
}
export default Signup

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
    input: { width: '100%', borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 12 },
    button: { padding: 14, borderRadius: 8, width: '100%', alignItems: 'center', marginTop: 8 },
    buttonText: { color: '#fff', fontWeight: 'bold' },
    error: { marginBottom: 10 },
    link: { marginTop: 16, textDecorationLine: 'underline' },
})