import { View, Text, Image, TextInput, Touchable, TouchableOpacity } from 'react-native'
import React from 'react'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { loginWithGoogle } from '../service/requests/auth'
import { resetAndNavigate } from '../utils/NavigationUtils'
import { useMutation } from '@tanstack/react-query'

GoogleSignin.configure({
  webClientId: '621828914638-h0u0cdo2jeo044otq5ojvpn6smq9k79c.apps.googleusercontent.com'
})
const LoginScreen = () => {

  const [phone, setPhone] = React.useState('')

  const loginMutation = useMutation({
    mutationFn: loginWithGoogle,
    onSuccess: () => {
      resetAndNavigate('HomeScreen')
    },
    onError: (error) => {
      console.error('Login Failed', error)
    }
  })

  const handleGoogleSignin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      loginMutation.mutate(response.data?.idToken as string);
    }
    catch (error) {
      console.log("Goofle Signin Error", error)
    }
  }


  return (
    <View>
      <Image
        source={require('../assets/images/cover.jpeg')}
        className='w-full h-64 bg-cover'
      />
      <View className='p-4'>
        <Text className='font-okra font-semibold text-xl text-center'>
          Create Account or Sign in
        </Text>
        <View className='my-4 mt-12 border-1 gap-2 border border-black px-2 flex-row items-center'>
          <Text className='font-okra w-[10%] font-bold text-base'>
            +91
          </Text>

          <TextInput
            value={phone}
            maxLength={10}
            keyboardType='number-pad'
            placeholder='Enter your phone number'
            className='font-okra h-11 w-[90%]'
            onChangeText={(text) => setPhone(text)}
          />
        </View>
        <TouchableOpacity onPress={handleGoogleSignin} className='bg-tertiary justify-center items-center p-3'>
          <Text className='text-white font-semibold font-okra'>
            LETS GO
          </Text>
        </TouchableOpacity>

        <Text className='text-center my-8 text-sm font-okra text-gray-600'>
          -------------- OR --------------
        </Text>

        <View className='flex items-center justify-center flex-row gap-4 '>
           <TouchableOpacity onPress={handleGoogleSignin} className='border border-1 border-gray-300 p-2'>
              <Image source={require('../assets/images/google.png')} className='w-5 h-5' />
           </TouchableOpacity>
            <TouchableOpacity  className='border border-1 border-gray-300 p-2'>
              <Image source={require('../assets/images/apple.png')} className='w-5 h-5' />
           </TouchableOpacity>
        </View>

        <Text className='font-okra text-sm text-gray-500 font-medium text-center mt-10 w-72 self-center'>By Sigining up, you agree to our Terms of Service and Privacy Policy</Text>

      </View>


    </View>
  )
}

export default LoginScreen