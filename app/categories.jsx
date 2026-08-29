// app/categories.jsx

import {
    View,
    Text,
    StyleSheet,
} from 'react-native'

import { useAppTheme } from '../context/ThemeContext'
import Colors from '../constans/Colors'

import ThemeView from '../components/ThemeView'
import BottomNavBar from '../components/BottomNavBar'


const Categories = () => {

    // =========================================================
    // THEME
    // =========================================================

    const { colorScheme } = useAppTheme()

    const currentScheme =
        colorScheme === 'dark'
            ? 'dark'
            : 'light'

    const theme =
        Colors[currentScheme] || Colors.light


    // =========================================================
    // UI
    // =========================================================

    return (
        <ThemeView
            style={[
                styles.screen,
                {
                    backgroundColor: theme.background,
                },
            ]}
        >

            {/* =================================================
                CONTENT
            ================================================= */}

            <View
                style={[
                    styles.container,
                    {
                        backgroundColor:
                            theme.background,
                    },
                ]}
            >

                <Text
                    style={[
                        styles.title,
                        {
                            color: theme.title,
                        },
                    ]}
                >
                    Categories
                </Text>


                <Text
                    style={[
                        styles.subtitle,
                        {
                            color: theme.subtitle,
                        },
                    ]}
                >
                    Coming soon — browse products by category.
                </Text>

            </View>


            {/* =================================================
                BOTTOM NAVIGATION
            ================================================= */}

            <BottomNavBar />

        </ThemeView>
    )
}


export default Categories


// =============================================================
// STYLES
// =============================================================

const styles = StyleSheet.create({

    screen: {
        flex: 1,
    },

    container: {
        flex: 1,
        padding: 20,
    },

    title: {
        fontSize: 22,
        fontWeight: '800',
        marginBottom: 12,
    },

    subtitle: {
        fontSize: 14,
        lineHeight: 20,
    },

})