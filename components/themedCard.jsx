import {View, StyleSheet, useColorScheme} from 'react-native'  // StyleSheet was missing
import {Colors} from '../constans/Colors'

const ThemedCard = ({style, children, ...props}) => {
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light

    return(
        <View style={[{ backgroundColor: theme.uiBackground }, styles.card, style]} {...props}>
            {children}
        </View>
    )
}
export default ThemedCard

const styles = StyleSheet.create({
    card: { borderRadius: 10, padding: 20 }
})