// app/order-again.jsx

import { View, Text, StyleSheet } from 'react-native'
import { useAppTheme } from '../context/ThemeContext'
import Colors from '../constans/Colors'
import ThemeView from '../components/ThemeView'
import BottomNavBar from '../components/BottomNavBar'

const OrderAgain = () => {
    // =====================================================
    // THEME
    // =====================================================

    const { colorScheme } = useAppTheme()

    const theme =
        Colors[colorScheme] || Colors.light

    // =====================================================
    // UI
    // =====================================================

    return (
        <ThemeView style={styles.screen}>

            <View style={styles.container}>

                {/* =================================================
                    EYEBROW
                ================================================= */}

                <Text
                    style={[
                        styles.eyebrow,
                        {
                            color: theme.primary,
                        },
                    ]}
                >
                    QUICK REORDER
                </Text>


                {/* =================================================
                    TITLE
                ================================================= */}

                <Text
                    style={[
                        styles.title,
                        {
                            color: theme.title,
                        },
                    ]}
                >
                    Order Again
                </Text>


                {/* =================================================
                    SUBTITLE
                ================================================= */}

                <Text
                    style={[
                        styles.subtitle,
                        {
                            color: theme.subtitle,
                        },
                    ]}
                >
                    Quickly reorder your favourite products from your
                    previous purchases.
                </Text>


                {/* =================================================
                    PAST ORDERS CARD
                ================================================= */}

                <View
                    style={[
                        styles.card,
                        {
                            backgroundColor:
                                theme.card,

                            borderColor:
                                theme.border,
                        },
                    ]}
                >

                    <Text
                        style={[
                            styles.cardTitle,
                            {
                                color:
                                    theme.title,
                            },
                        ]}
                    >
                        Your past orders
                    </Text>

                    <Text
                        style={[
                            styles.cardText,
                            {
                                color:
                                    theme.text,
                            },
                        ]}
                    >
                        Your previous orders will appear here so you can
                        reorder them quickly.
                    </Text>

                </View>

            </View>


            {/* =================================================
                BOTTOM NAVIGATION
            ================================================= */}

            <BottomNavBar />

        </ThemeView>
    )
}

export default OrderAgain


// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({

    screen: {
        flex: 1,
    },

    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 24,
    },

    // =================================================
    // EYEBROW
    // =================================================

    eyebrow: {
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 1.5,
        marginBottom: 5,
    },

    // =================================================
    // TITLE
    // =================================================

    title: {
        fontSize: 30,
        fontWeight: '800',
        marginBottom: 8,
    },

    // =================================================
    // SUBTITLE
    // =================================================

    subtitle: {
        fontSize: 14,
        lineHeight: 21,
        marginBottom: 24,
    },

    // =================================================
    // CARD
    // =================================================

    card: {
        borderWidth: 1,
        borderRadius: 18,
        padding: 20,
    },

    cardTitle: {
        fontSize: 17,
        fontWeight: '800',
        marginBottom: 7,
    },

    cardText: {
        fontSize: 13,
        lineHeight: 20,
    },

})