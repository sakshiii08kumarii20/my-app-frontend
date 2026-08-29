import { View, StatusBar } from 'react-native'
import { useAppTheme } from '../context/ThemeContext'
import Colors from '../constans/Colors'

const ThemeView = ({ children, style, ...props }) => {
    const { colorScheme } = useAppTheme()

    const theme = Colors[colorScheme] ?? Colors.light

    return (
        <View
            {...props}
            style={[
                {
                    flex: 1,
                    backgroundColor: theme.background,
                },
                style,
            ]}
        >
            <StatusBar
                barStyle={
                    colorScheme === 'dark'
                        ? 'light-content'
                        : 'dark-content'
                }
                backgroundColor={theme.background}
            />

            {children}
        </View>
    )
}

export default ThemeView