import { StyleSheet, View, Text, useColorScheme } from 'react-native'
import { Link } from 'expo-router'
import { Colors } from '../constans/Colors'
import ThemeView from '../components/ThemeView'

const Contact = () => {
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light

    return (
        <ThemeView style={styles.container}>
            <Text style={[styles.title, { color: theme.title }]}>Contact Us</Text>

            <Link href="/" style={[styles.link, { color: Colors.primary }]}>
                Back to Home
            </Link>
        </ThemeView>
    )
}
export default Contact

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    title: { fontSize: 20, fontWeight: 'bold' },
    link: { textDecorationLine: 'underline' },
})