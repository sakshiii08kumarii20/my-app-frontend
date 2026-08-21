import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { Link } from 'expo-router'
import { Colors } from '../constans/Colors'
import { useColorScheme } from 'react-native'
import ThemeView from '../components/ThemeView'
import { fetchCustomers } from '../constans/api'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Profile = () => {
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light

    const [customer, setCustomer] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const loadCustomer = async () => {
            try {
                const customers = await fetchCustomers()

                console.log('Customers:', customers)

                const customerId = await AsyncStorage.getItem('customerId')

const loggedInCustomer = customers.find(
    (item) => item.id === customerId
)

if (loggedInCustomer) {
    setCustomer(loggedInCustomer)
}
            } catch (err) {
                console.error('Customer fetch error:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        loadCustomer()
    }, [])

    return (
        <ThemeView style={styles.container}>

            <Text style={[styles.title, { color: theme.title }]}>
                Your Account
            </Text>

            {loading && (
                <ActivityIndicator size="large" />
            )}

            {error && (
                <Text style={styles.error}>
                    {error}
                </Text>
            )}

            {!loading && !error && customer && (
                <View style={styles.customerBox}>

                    <Text style={[styles.name, { color: theme.title }]}>
                        {customer.name}
                    </Text>

                    <Text style={[styles.info, { color: theme.subtitle }]}>
                        Email: {customer.email || 'Not available'}
                    </Text>

                    <Text style={[styles.info, { color: theme.subtitle }]}>
                        Customer ID: {customer.id}
                    </Text>
                     
                     <Text style={[styles.info, { color: theme.subtitle }]}>
    Mobile: {customer.mobile || customer.phone || 'Not available'}
</Text>
                </View>
            )}

            {!loading && !error && !customer && (
                <Text style={{ color: theme.subtitle }}>
                    No customer found
                </Text>
            )}

            <Link
                href="/login"
                style={[styles.link, { color: theme.subtitle }]}
            >
                Login
            </Link>

            <Link
                href="/signup"
                style={[styles.link, { color: theme.subtitle }]}
            >
                Sign Up
            </Link>

        </ThemeView>
    )
}

export default Profile

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

    customerBox: {
        width: '100%',
        padding: 20,
        marginBottom: 20,
        borderRadius: 10,
    },

    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },

    info: {
        fontSize: 15,
        marginVertical: 4,
    },

    link: {
        fontSize: 16,
        marginVertical: 10,
        textDecorationLine: 'underline',
    },

    error: {
        color: 'red',
        marginBottom: 15,
    },
})