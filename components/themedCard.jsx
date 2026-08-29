import { View, StyleSheet } from 'react-native'
import { useAppTheme } from '../context/ThemeContext'
import Colors from '../constans/Colors'

const ThemedCard = ({
    children,
    style,
    ...props
}) => {
    const { colorScheme } = useAppTheme()

    const theme =
        Colors[colorScheme] || Colors.light

    return (
        <View
            style={[
                styles.card,
                {
                    backgroundColor:
                        theme.card,

                    borderColor:
                        theme.border,
                },
                style,
            ]}
            {...props}
        >
            {children}
        </View>
    )
}

export default ThemedCard

const styles = StyleSheet.create({
    card: {
        borderRadius: 18,
        borderWidth: 1,
        padding: 16,

        // Small elevation for Android
        elevation: 2,

        // Shadow for iOS
        shadowOpacity: 0.04,
        shadowRadius: 8,
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },
})