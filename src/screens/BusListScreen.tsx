import { View, Text, Touchable, TouchableOpacity, ActivityIndicator, FlatList, Image } from 'react-native'
import React from 'react'
import { useRoute } from '@react-navigation/native'
import { useQuery } from '@tanstack/react-query'
import { fetchBuses } from '../service/requests/bus'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowLeftIcon } from 'react-native-heroicons/outline'
import { goBack, navigate } from '../utils/NavigationUtils'

const BusListScreen = () => {

  const route = useRoute()
  const params = route?.params as any;
  const { from, to, date } = params?.item || {};

  const { data: buses, isLoading, isError } = useQuery({
    queryKey: ['buses', from, to, date],
    queryFn: () => fetchBuses(from, to, date),
    enabled: !!from && !!to && !!date
  })

  console.log(buses, "All Buses ")

  const renderItem = ({ item }: any) => (
    <TouchableOpacity className='bg-white mb-4 p-4 rounded-lg shadow-sm ' onPress={() => navigate('SeatSelectionScreen', { busId: item?.busId })}>
      <Image source={require('../assets/images/sidebus.png')} className='h-6 w-8' />
      <Text className='text-lg font-bold text-gray-900'>{item?.company}</Text>
      <Text className='text-gray-600'>{item?.busType}</Text>

      <View className='flex-row justify-between mt-2'>
        <Text className='text-lg font-semibold text-gray-700'>
          {new Intl.DateTimeFormat('default', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }).format(new Date(item?.departureTime))} {' '}
          - {new Intl.DateTimeFormat('default', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }).format(new Date(item?.arrivalTime))}
        </Text>
        <Text className='text-sm text-gray-500'>{item?.duration}</Text>
      </View>

      <View className='flex-row justify-between mt-2 items-center '>
        <Text className='text-md text-green-600 font-bold'>₹ {item?.price}</Text>
        <Text className='text-sm text-gray-500 line-through'>₹ {item?.originalPrice}</Text>
        <Text className='text-sm text-gray-600'>
          {item?.seats?.flat().filter((seat: any) => !seat?.booked)?.length} Seats Available
        </Text>
      </View>
    </TouchableOpacity>
  )

  return (
    <View>
      <SafeAreaView className='flex-1'/>
        <View className='bg-white p-4 flex-row items-center border-b-[1px]  border-teal-800'>
          <TouchableOpacity onPress={() => { goBack() }}>
            <ArrowLeftIcon size={24} color='black' />
          </TouchableOpacity>

          <View className='ml-4'>
            <Text className='text-lg font-bold items-center'>{from} → {to}</Text>
            <Text className='text-sm text-gray-500'>
              {date?.toDateString()}
            </Text>
          </View>
        </View>

        {isLoading && (
          <View className='flex-1 justify-center items-center'>
            <ActivityIndicator size='large' color='teal' />
            <Text>Loading Buses ...</Text>
          </View>
        )}

        {isError && (
          <View className='flex-1 justify-center items-center'>
            <Text className='text-red-500 font-bold'>Flailed to load buses</Text>
          </View>
        )}

        {!isError && !isLoading && buses?.length === 0 && (
          <View className='flex-1 justify-center items-center'>
            <Text className='text-red-500 font-bold'>No buses available</Text>
          </View>
        )}
        {!isLoading && !isError && buses?.length > 0 && (
          <FlatList
            data={buses}
            keyExtractor={(item) => item.busId.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 16 }}
          />
        )}
    </View>
  )
}

export default BusListScreen