import { StyleSheet ,View,Text,useColorScheme} from 'react-native'
import{Link} from'expo-router'
import {Colors} from '../constans/Colors'


const About =() =>{

    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light

    return(
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.title, { color: theme.title }]}>About Us</Text>
        
        <Link href="/" style={styles.link}>
            Back to Home
        </Link>
        <Link href="/contact" style={styles.link}>
            Contact Us
        </Link>
        </View>

    )
 
}
export default About;
const styles = StyleSheet.create({

container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },

    link: {
        color: 'blue',
        textDecorationLine: 'underline',
    },
})