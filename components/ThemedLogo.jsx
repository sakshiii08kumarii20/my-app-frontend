import { Image } from 'react-native'
import { useAppTheme } from '../context/ThemeContext'

import Logo from '../assets/img/logo.png'

const ThemedLogo = (props) => {
    const { colorScheme } = useAppTheme()

    return (
        <Image
            source={Logo}
            resizeMode="contain"
            {...props}
        />
    )
}

export default ThemedLogo