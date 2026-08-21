import {Image, useColorScheme} from 'react-native'
import DarkLogo from '../assets/img/logo.png'
import LightLogo from '../assets/img/logo.png'

const ThemedLogo = (props) => {
  const colorScheme = useColorScheme()
  const logoSource = colorScheme === 'dark' ? DarkLogo : LightLogo

  return (
  <Image source={logoSource} {...props} />
)}
export default ThemedLogo