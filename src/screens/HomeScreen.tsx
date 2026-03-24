import { View, Text, SafeAreaViewBase,} from 'react-native'
import React from 'react'
import { UserCircleIcon } from 'react-native-heroicons/outline'
import { logout } from '../service/requests/auth'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import Bookings from '../components/home/Bookings'


const HomeScreen = () => {
  return (
    <View className='flex-1 bg-white'>
      <SafeAreaView className='flex-1'>
        <View className='flex-row justify-between items-center px-4 py-2'>
          <Text className='font-okra font-semibold text-3xl'>
             Bus Tickets
          </Text>
          <UserCircleIcon color='red' size={38} onPress={logout} />
        </View>
        <Bookings/>
      </SafeAreaView>
    </View>
  )
}

export default HomeScreen