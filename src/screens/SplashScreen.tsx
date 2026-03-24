import { View, Text, Image, Alert } from 'react-native'
import React, { use, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import { get } from 'react-native/Libraries/NativeComponent/NativeComponentRegistry'
import { getAccessToken, getRefreshToken } from '../service/storage.tsx'
import { resetAndNavigate } from '../utils/NavigationUtils'
import { refresh_tokens } from '../service/requests/auth'

interface DecoadedToken {
    exp: number
}
const SplashScreen = ({ navigation }: any) => {

    const tokenCheck = async () => {
        const accessToken = getAccessToken();
        const refreshToken = getRefreshToken() as string;

        if (accessToken) {
            const decodedAccessToken = jwtDecode<DecoadedToken>(accessToken);
            const decodedRefreshToken = jwtDecode<DecoadedToken>(refreshToken);

            const currentTime = Date.now() / 1000;

            if (decodedRefreshToken?.exp < currentTime) {
                resetAndNavigate('LoginScreen')
                Alert.alert('Session Expired, Please Login again');
                return;
            }

            if (decodedAccessToken?.exp < currentTime) {
                const refreshed = await refresh_tokens();
                if (!refreshed) {
                    Alert.alert('There was an error, Please Login again');
                    return;
                }
            }

            resetAndNavigate('HomeScreen')
            return;
        }

        resetAndNavigate('LoginScreen')

    }

    useEffect(() => {
        // setTimeout(() => {
        //     navigation.navigate('LoginScreen')
        // }, 3000)
        const timeOut = setTimeout(() => {
            tokenCheck()
        }, 1500)

        return () => {
            clearTimeout(timeOut)
        }
    })
    return (
        <View className='flex-1 justify-center items-center bg-white '>
            <Image
                source={require('../assets/images/logo_t.png')}
                className='h-[30%] w-[60%] '
                resizeMode='contain'
            />
        </View>
    )
}

export default SplashScreen