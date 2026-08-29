import { createContext, useContext, useEffect, useState } from 'react'
import { useColorScheme as useSystemColorScheme } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

const THEME_STORAGE_KEY = 'appThemeMode'

const ThemeContext = createContext({
    mode: 'system',
    colorScheme: 'light',
    setMode: async () => {},
})

export const ThemeProvider = ({ children }) => {
    const systemScheme = useSystemColorScheme()

    const [mode, setModeState] = useState('system')
    const [loaded, setLoaded] = useState(false)

    // =========================================================
    // LOAD SAVED THEME
    // =========================================================

    useEffect(() => {
        const loadMode = async () => {
            try {
                const stored = await AsyncStorage.getItem(
                    THEME_STORAGE_KEY
                )

                if (
                    stored === 'light' ||
                    stored === 'dark' ||
                    stored === 'system'
                ) {
                    setModeState(stored)
                }
            } catch (error) {
                console.log('Error loading theme:', error)
            } finally {
                setLoaded(true)
            }
        }

        loadMode()
    }, [])

    // =========================================================
    // CHANGE THEME
    // =========================================================

    const setMode = async (newMode) => {
        if (
            newMode !== 'light' &&
            newMode !== 'dark' &&
            newMode !== 'system'
        ) {
            return
        }

        try {
            setModeState(newMode)

            await AsyncStorage.setItem(
                THEME_STORAGE_KEY,
                newMode
            )
        } catch (error) {
            console.log('Error saving theme:', error)
        }
    }

    // =========================================================
    // DETERMINE ACTIVE COLOR SCHEME
    // =========================================================

    const colorScheme =
        mode === 'system'
            ? systemScheme === 'dark'
                ? 'dark'
                : 'light'
            : mode

    // =========================================================
    // WAIT UNTIL SAVED THEME IS LOADED
    // =========================================================

    if (!loaded) {
        return null
    }

    return (
        <ThemeContext.Provider
            value={{
                mode,
                colorScheme,
                setMode,
            }}
        >
            {children}
        </ThemeContext.Provider>
    )
}

// =============================================================
// HOOK
// =============================================================

export const useAppTheme = () => {
    return useContext(ThemeContext)
}