import { useState, useCallback } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    LayoutAnimation,
    Platform,
    UIManager,
} from 'react-native'
import { Link, useRouter, useFocusEffect } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Ionicons } from '@expo/vector-icons'

import Colors from '../constans/Colors'
import ThemeView from '../components/ThemeView'
import { useAppTheme } from '../context/ThemeContext'

if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true)
}

const Profile = () => {
    const { colorScheme, mode, setMode } = useAppTheme()
    const theme = Colors[colorScheme] ?? Colors.light

    const router = useRouter()

    const [customer, setCustomer] = useState(null)
    const [checked, setChecked] = useState(false)
    const [appearanceOpen, setAppearanceOpen] = useState(false)

    useFocusEffect(
        useCallback(() => {
            const loadFromStorage = async () => {
                const [
                    [, customerId],
                    [, customerName],
                    [, customerEmail],
                    [, customerPhone],
                ] = await AsyncStorage.multiGet([
                    'customerId',
                    'customerName',
                    'customerEmail',
                    'customerPhone',
                ])

                setCustomer(
                    customerId
                        ? {
                              id: customerId,
                              name: customerName,
                              email: customerEmail,
                              phone: customerPhone,
                          }
                        : null
                )

                setChecked(true)
            }

            loadFromStorage()
        }, [])
    )

    const handleLogout = async () => {
        await AsyncStorage.multiRemove([
            'customerId',
            'customerName',
            'customerEmail',
            'customerPhone',
        ])

        setCustomer(null)
    }

    const toggleAppearance = () => {
        LayoutAnimation.configureNext(
            LayoutAnimation.Presets.easeInEaseOut
        )

        setAppearanceOpen(!appearanceOpen)
    }

    const selectMode = (selectedMode) => {
        LayoutAnimation.configureNext(
            LayoutAnimation.Presets.easeInEaseOut
        )

        setMode(selectedMode)
        setAppearanceOpen(false)
    }

    const initial = customer?.name
        ? customer.name.trim().charAt(0).toUpperCase()
        : 'G'

    const appearanceLabel =
        mode === 'light'
            ? 'Light'
            : mode === 'dark'
              ? 'Dark'
              : 'System'

    const appearanceIcon =
        mode === 'light'
            ? 'sunny-outline'
            : mode === 'dark'
              ? 'moon-outline'
              : 'phone-portrait-outline'

    const THEME_OPTIONS = [
        {
            key: 'light',
            label: 'Light',
            description: 'Clean & bright',
            icon: 'sunny-outline',
        },
        {
            key: 'dark',
            label: 'Dark',
            description: 'Easy on the eyes',
            icon: 'moon-outline',
        },
        {
            key: 'system',
            label: 'System',
            description: 'Follow device',
            icon: 'phone-portrait-outline',
        },
    ]

    if (!checked) {
        return <ThemeView style={{ flex: 1 }} />
    }

    return (
        <ThemeView style={{ flex: 1 }}>
            <View style={styles.container}>

                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}

                <View style={styles.header}>
                    <View>
                        <Text
                            style={[
                                styles.smallTitle,
                                { color: theme.textSecondary },
                            ]}
                        >
                            MY ACCOUNT
                        </Text>

                        <Text
                            style={[
                                styles.title,
                                { color: theme.heading },
                            ]}
                        >
                            Profile
                        </Text>
                    </View>

                    <View
                        style={[
                            styles.headerIcon,
                            {
                                backgroundColor: theme.primary,
                            },
                        ]}
                    >
                        <Ionicons
                            name="person-outline"
                            size={21}
                            color={theme.textWhite}
                        />
                    </View>
                </View>

                {/* ================================================= */}
                {/* PROFILE CARD */}
                {/* ================================================= */}

                {customer ? (
                    <View
                        style={[
                            styles.profileCard,
                            {
                                backgroundColor: theme.card,
                                borderColor: theme.border,
                            },
                        ]}
                    >
                        <View
                            style={[
                                styles.avatar,
                                {
                                    backgroundColor: theme.primary,
                                },
                            ]}
                        >
                            <Text style={styles.avatarText}>
                                {initial}
                            </Text>
                        </View>

                        <View style={styles.profileInfo}>
                            <Text
                                style={[
                                    styles.name,
                                    { color: theme.heading },
                                ]}
                            >
                                {customer.name || 'Customer'}
                            </Text>

                            <Text
                                style={[
                                    styles.info,
                                    { color: theme.textSecondary },
                                ]}
                            >
                                {customer.email || 'No email'}
                            </Text>

                            <Text
                                style={[
                                    styles.info,
                                    { color: theme.textSecondary },
                                ]}
                            >
                                {customer.phone || 'No phone'}
                            </Text>
                        </View>

                        <TouchableOpacity
                            onPress={handleLogout}
                            style={[
                                styles.logoutButton,
                                {
                                    backgroundColor: theme.errorLight,
                                },
                            ]}
                        >
                            <Ionicons
                                name="log-out-outline"
                                size={18}
                                color={theme.error}
                            />

                            <Text
                                style={[
                                    styles.logoutText,
                                    { color: theme.error },
                                ]}
                            >
                                Log Out
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View
                        style={[
                            styles.guestCard,
                            {
                                backgroundColor: theme.card,
                                borderColor: theme.border,
                            },
                        ]}
                    >
                        <View
                            style={[
                                styles.guestIcon,
                                {
                                    backgroundColor: theme.primaryLight,
                                },
                            ]}
                        >
                            <Ionicons
                                name="person-outline"
                                size={25}
                                color={theme.primary}
                            />
                        </View>

                        <Text
                            style={[
                                styles.guestTitle,
                                { color: theme.heading },
                            ]}
                        >
                            Welcome!
                        </Text>

                        <Text
                            style={[
                                styles.guestText,
                                { color: theme.textSecondary },
                            ]}
                        >
                            Log in to manage your account, orders and
                            preferences.
                        </Text>

                        <TouchableOpacity
                            style={[
                                styles.loginButton,
                                {
                                    backgroundColor:
                                        theme.buttonPrimary,
                                },
                            ]}
                            onPress={() => router.push('/login')}
                        >
                            <Text
                                style={[
                                    styles.loginButtonText,
                                    {
                                        color:
                                            theme.buttonPrimaryText,
                                    },
                                ]}
                            >
                                Log In
                            </Text>

                            <Ionicons
                                name="arrow-forward"
                                size={18}
                                color={theme.buttonPrimaryText}
                            />
                        </TouchableOpacity>

                        <Link
                            href="/signup"
                            style={[
                                styles.signupLink,
                                {
                                    color: theme.primary,
                                },
                            ]}
                        >
                            New here? Create an account
                        </Link>
                    </View>
                )}

                {/* ================================================= */}
                {/* QUICK ACTIONS */}
                {/* ================================================= */}

                {customer && (
                    <View style={styles.quickRow}>

                        <TouchableOpacity
                            style={[
                                styles.quickCard,
                                {
                                    backgroundColor: theme.card,
                                    borderColor: theme.border,
                                },
                            ]}
                        >
                            <View
                                style={[
                                    styles.quickIcon,
                                    {
                                        backgroundColor:
                                            theme.infoLight,
                                    },
                                ]}
                            >
                                <Ionicons
                                    name="bag-handle-outline"
                                    size={21}
                                    color={theme.info}
                                />
                            </View>

                            <Text
                                style={[
                                    styles.quickTitle,
                                    { color: theme.heading },
                                ]}
                            >
                                Orders
                            </Text>

                            <Text
                                style={[
                                    styles.quickSubtitle,
                                    {
                                        color:
                                            theme.textSecondary,
                                    },
                                ]}
                            >
                                View orders
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.quickCard,
                                {
                                    backgroundColor: theme.card,
                                    borderColor: theme.border,
                                },
                            ]}
                        >
                            <View
                                style={[
                                    styles.quickIcon,
                                    {
                                        backgroundColor:
                                            theme.accentLight,
                                    },
                                ]}
                            >
                                <Ionicons
                                    name="heart-outline"
                                    size={21}
                                    color={theme.accent}
                                />
                            </View>

                            <Text
                                style={[
                                    styles.quickTitle,
                                    { color: theme.heading },
                                ]}
                            >
                                Wishlist
                            </Text>

                            <Text
                                style={[
                                    styles.quickSubtitle,
                                    {
                                        color:
                                            theme.textSecondary,
                                    },
                                ]}
                            >
                                Saved items
                            </Text>
                        </TouchableOpacity>

                    </View>
                )}

                {/* ================================================= */}
                {/* SETTINGS */}
                {/* ================================================= */}

                <Text
                    style={[
                        styles.sectionTitle,
                        { color: theme.heading },
                    ]}
                >
                    Settings
                </Text>

                <View
                    style={[
                        styles.settingsCard,
                        {
                            backgroundColor: theme.card,
                            borderColor: theme.border,
                        },
                    ]}
                >

                    {/* Appearance */}
                    <TouchableOpacity
                        onPress={toggleAppearance}
                        style={styles.settingRow}
                    >
                        <View
                            style={[
                                styles.settingIcon,
                                {
                                    backgroundColor:
                                        theme.lavenderLight,
                                },
                            ]}
                        >
                            <Ionicons
                                name="color-palette-outline"
                                size={21}
                                color={theme.lavender}
                            />
                        </View>

                        <View style={styles.settingContent}>
                            <Text
                                style={[
                                    styles.settingTitle,
                                    { color: theme.heading },
                                ]}
                            >
                                Appearance
                            </Text>

                            <Text
                                style={[
                                    styles.settingSubtitle,
                                    {
                                        color:
                                            theme.textSecondary,
                                    },
                                ]}
                            >
                                Choose how the app looks
                            </Text>
                        </View>

                        <View style={styles.appearanceValue}>
                            <Ionicons
                                name={appearanceIcon}
                                size={16}
                                color={theme.primary}
                            />

                            <Text
                                style={[
                                    styles.appearanceText,
                                    { color: theme.primary },
                                ]}
                            >
                                {appearanceLabel}
                            </Text>

                            <Ionicons
                                name={
                                    appearanceOpen
                                        ? 'chevron-up'
                                        : 'chevron-down'
                                }
                                size={16}
                                color={theme.textMuted}
                            />
                        </View>
                    </TouchableOpacity>

                    {/* Dropdown */}
                    {appearanceOpen && (
                        <View
                            style={[
                                styles.dropdown,
                                {
                                    borderTopColor:
                                        theme.divider,
                                },
                            ]}
                        >
                            {THEME_OPTIONS.map((option) => {
                                const active =
                                    mode === option.key

                                return (
                                    <TouchableOpacity
                                        key={option.key}
                                        onPress={() =>
                                            selectMode(option.key)
                                        }
                                        style={[
                                            styles.themeOption,
                                            {
                                                backgroundColor:
                                                    active
                                                        ? theme.primary
                                                        : theme.surfaceSoft,
                                                borderColor:
                                                    active
                                                        ? theme.primary
                                                        : theme.border,
                                            },
                                        ]}
                                    >
                                        <View
                                            style={[
                                                styles.optionIcon,
                                                {
                                                    backgroundColor:
                                                        active
                                                            ? 'rgba(255,255,255,0.16)'
                                                            : theme.lavenderLight,
                                                },
                                            ]}
                                        >
                                            <Ionicons
                                                name={option.icon}
                                                size={19}
                                                color={
                                                    active
                                                        ? theme.textWhite
                                                        : theme.primary
                                                }
                                            />
                                        </View>

                                        <View style={styles.optionContent}>
                                            <Text
                                                style={[
                                                    styles.optionTitle,
                                                    {
                                                        color: active
                                                            ? theme.textWhite
                                                            : theme.heading,
                                                    },
                                                ]}
                                            >
                                                {option.label}
                                            </Text>

                                            <Text
                                                style={[
                                                    styles.optionDescription,
                                                    {
                                                        color: active
                                                            ? 'rgba(255,255,255,0.75)'
                                                            : theme.textSecondary,
                                                    },
                                                ]}
                                            >
                                                {option.description}
                                            </Text>
                                        </View>

                                        {active && (
                                            <Ionicons
                                                name="checkmark-circle"
                                                size={22}
                                                color={theme.textWhite}
                                            />
                                        )}
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    )}

                    {/* Divider */}
                    <View
                        style={[
                            styles.divider,
                            { backgroundColor: theme.divider },
                        ]}
                    />

                    {/* Notifications */}
                    <TouchableOpacity style={styles.settingRow}>
                        <View
                            style={[
                                styles.settingIcon,
                                {
                                    backgroundColor:
                                        theme.warningLight,
                                },
                            ]}
                        >
                            <Ionicons
                                name="notifications-outline"
                                size={21}
                                color={theme.warning}
                            />
                        </View>

                        <View style={styles.settingContent}>
                            <Text
                                style={[
                                    styles.settingTitle,
                                    { color: theme.heading },
                                ]}
                            >
                                Notifications
                            </Text>

                            <Text
                                style={[
                                    styles.settingSubtitle,
                                    {
                                        color:
                                            theme.textSecondary,
                                    },
                                ]}
                            >
                                Manage notifications
                            </Text>
                        </View>

                        <Ionicons
                            name="chevron-forward"
                            size={19}
                            color={theme.textMuted}
                        />
                    </TouchableOpacity>

                </View>

            </View>
        </ThemeView>
    )
}

export default Profile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 18,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 22,
    },

    smallTitle: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1.5,
        marginBottom: 3,
    },

    title: {
        fontSize: 30,
        fontWeight: '800',
    },

    headerIcon: {
        width: 44,
        height: 44,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },

    profileCard: {
        borderWidth: 1,
        borderRadius: 20,
        padding: 18,
        flexDirection: 'row',
        alignItems: 'center',
    },

    avatar: {
        width: 62,
        height: 62,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },

    avatarText: {
        color: '#FFFFFF',
        fontSize: 25,
        fontWeight: '800',
    },

    profileInfo: {
        flex: 1,
        marginLeft: 14,
    },

    name: {
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 5,
    },

    info: {
        fontSize: 13,
        marginTop: 2,
    },

    logoutButton: {
        paddingVertical: 9,
        paddingHorizontal: 11,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },

    logoutText: {
        fontSize: 10,
        fontWeight: '700',
        marginTop: 2,
    },

    guestCard: {
        borderWidth: 1,
        borderRadius: 20,
        padding: 22,
        alignItems: 'center',
    },

    guestIcon: {
        width: 58,
        height: 58,
        borderRadius: 19,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },

    guestTitle: {
        fontSize: 20,
        fontWeight: '800',
        marginBottom: 6,
    },

    guestText: {
        textAlign: 'center',
        fontSize: 13,
        lineHeight: 19,
        marginBottom: 18,
    },

    loginButton: {
        width: '100%',
        borderRadius: 12,
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },

    loginButtonText: {
        fontSize: 15,
        fontWeight: '800',
    },

    signupLink: {
        marginTop: 15,
        fontSize: 13,
        fontWeight: '700',
    },

    quickRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 14,
    },

    quickCard: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 16,
        padding: 14,
    },

    quickIcon: {
        width: 38,
        height: 38,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 9,
    },

    quickTitle: {
        fontSize: 14,
        fontWeight: '800',
    },

    quickSubtitle: {
        fontSize: 11,
        marginTop: 3,
    },

    sectionTitle: {
        fontSize: 17,
        fontWeight: '800',
        marginTop: 24,
        marginBottom: 10,
    },

    settingsCard: {
        borderWidth: 1,
        borderRadius: 18,
        overflow: 'hidden',
    },

    settingRow: {
        minHeight: 72,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
    },

    settingIcon: {
        width: 42,
        height: 42,
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'center',
    },

    settingContent: {
        flex: 1,
        marginLeft: 13,
    },

    settingTitle: {
        fontSize: 14,
        fontWeight: '700',
    },

    settingSubtitle: {
        fontSize: 11,
        marginTop: 3,
    },

    appearanceValue: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },

    appearanceText: {
        fontSize: 12,
        fontWeight: '700',
    },

    dropdown: {
        borderTopWidth: 1,
        padding: 12,
        gap: 8,
    },

    themeOption: {
        borderWidth: 1,
        borderRadius: 13,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },

    optionIcon: {
        width: 38,
        height: 38,
        borderRadius: 11,
        alignItems: 'center',
        justifyContent: 'center',
    },

    optionContent: {
        flex: 1,
        marginLeft: 11,
    },

    optionTitle: {
        fontSize: 14,
        fontWeight: '800',
    },

    optionDescription: {
        fontSize: 11,
        marginTop: 2,
    },

    divider: {
        height: 1,
        marginHorizontal: 15,
    },
})