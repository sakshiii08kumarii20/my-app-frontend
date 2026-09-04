// components/BottomNavBar.jsx

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native'
import { useRouter, usePathname } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import Colors from '../constans/Colors'
import { useAppTheme } from '../context/ThemeContext'

const TABS = [
    {
        key: 'home',
        label: 'Home',
        icon: 'home-outline',
        activeIcon: 'home',
        path: '/',
    },
    {
        key: 'order-again',
        label: 'Order Again',
        icon: 'repeat-outline',
        activeIcon: 'repeat',
        path: '/order-again',
    },
    {
        key: 'categories',
        label: 'Categories',
        icon: 'grid-outline',
        activeIcon: 'grid',
        path: '/categories',
    },
    {
        key: 'orders',
        label: 'Your Orders',
        icon: 'receipt-outline',
        activeIcon: 'receipt',
        path: '/orders',
    },
]

const BottomNavBar = () => {
    const { colorScheme } = useAppTheme()
    const insets = useSafeAreaInsets()

    const theme =
        Colors[colorScheme] || Colors.light

    const router = useRouter()
    const pathname = usePathname()

    // =====================================================
    // THEME COLORS
    // =====================================================

    const activeColor =
        theme.tabBarActive ||
        theme.primary

    const inactiveColor =
        theme.tabBarInactive ||
        theme.textMuted ||
        theme.subtitle

    const barBackground =
        theme.tabBarBackground ||
        theme.card ||
        theme.background

    const borderColor =
        theme.border

    const activeBackground =
        theme.accentLight ||
        theme.uiBackground

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <View
            style={[
                styles.bar,
                {
                    backgroundColor:
                        barBackground,

                    borderTopColor:
                        borderColor,

                    // Add the device's real bottom inset (home
                    // indicator / gesture nav) on top of the base
                    // padding, instead of a fixed value that only
                    // worked on some phones.
                    paddingBottom: 12 + insets.bottom,
                },
            ]}
        >

            {TABS.map((tab) => {

                const active =
                    tab.path === '/'
                        ? pathname === '/'
                        : pathname === tab.path

                return (
                    <TouchableOpacity
                        key={tab.key}
                        style={styles.tab}
                        onPress={() => {

                            if (tab.path === '/') {
                                router.replace('/')
                            } else {
                                router.push(tab.path)
                            }

                        }}
                        activeOpacity={0.75}
                    >

                        {/* =================================================
                            ICON
                        ================================================= */}

                        <View
                            style={[
                                styles.iconContainer,

                                active && {
                                    backgroundColor:
                                        activeBackground,
                                },
                            ]}
                        >

                            <Ionicons
                                name={
                                    active
                                        ? tab.activeIcon
                                        : tab.icon
                                }
                                size={21}
                                color={
                                    active
                                        ? activeColor
                                        : inactiveColor
                                }
                            />

                        </View>


                        {/* =================================================
                            LABEL
                        ================================================= */}

                        <Text
                            style={[
                                styles.label,
                                {
                                    color:
                                        active
                                            ? activeColor
                                            : inactiveColor,
                                },

                                active &&
                                    styles.activeLabel,
                            ]}
                            numberOfLines={1}
                        >
                            {tab.label}
                        </Text>

                    </TouchableOpacity>
                )
            })}

        </View>
    )
}

export default BottomNavBar


// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({

    // =================================================
    // BOTTOM BAR
    // =================================================

    bar: {
        flexDirection: 'row',

        alignItems: 'center',

        borderTopWidth: 1,

        paddingTop: 7,
        // paddingBottom is now set dynamically above using
        // safe-area insets — do not hardcode it here.

        minHeight: 70,

        elevation: 8,

        shadowOpacity: 0.06,

        shadowRadius: 8,

        shadowOffset: {
            width: 0,
            height: -3,
        },
    },


    // =================================================
    // TAB
    // =================================================

    tab: {
        flex: 1,

        alignItems: 'center',

        justifyContent: 'center',

        minHeight: 54,
    },


    // =================================================
    // ICON
    // =================================================

    iconContainer: {
        width: 40,

        height: 30,

        borderRadius: 15,

        alignItems: 'center',

        justifyContent: 'center',

        marginBottom: 2,
    },


    // =================================================
    // LABEL
    // =================================================

    label: {
        fontSize: 10,

        fontWeight: '500',

        textAlign: 'center',

        lineHeight: 14,
    },

    activeLabel: {
        fontWeight: '800',
    },

})