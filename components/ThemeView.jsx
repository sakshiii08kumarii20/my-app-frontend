import {View,useColorScheme} from 'react-native'
import {Colors} from '../constans/Colors'
const ThemeView =({style,children, ...props})=>{

    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light
    return(
        <View style={[{ 
            
            backgroundColor: theme.background },style]}
            {...props}>
            {children}
            </View>
            
    )
}

export default ThemeView
