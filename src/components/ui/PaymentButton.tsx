import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { seats } from '../../utils/dummyData'
import { UserGroupIcon } from 'react-native-heroicons/outline'
interface PaymentButtonProps {
  price: number
  seat: number
  onPay: any
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ price, seat, onPay }) => {
  
  console.log(price , "Price ", seat  ,"Seat");
  
  return (
    <View className='absolute bottom-0 pb-5 shadow-md bg-white w-full rounded-t-xl p-4'>
      <View className='flex-row items-center justify-between'>
        <View>
          <Text className='font-semibold font-okra text-xl '>Amount</Text>
          <Text className='font font-okra font-medium text-gray-700 text-sm '>Tax Included</Text>
        </View>
        <View>
          <View className='flex-row items-center gap-x-3'>
            <Text className='text-gray-500 line-through font-okra font-medium text-sm'>
              ₹{(seat * price - (seat * price > 200 ? 100 : 0)).toFixed(0)}
            </Text>
            <Text className='font-okra font-medium text-lg'>
              ₹{(price * seat).toFixed(0)}
            </Text>
          </View>
          <View className='flex-row self-end items-center gap-1'>
            <UserGroupIcon color='gray' size={16} />
            <Text className='font-okra font-medium text-md '>{seat} P</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        onPress={onPay}
        className='bg-tertiary my-4 rounded-xl justify-center items-center p-3'
      >
       <Text className='text-white font-bold text-xl font-okra'>
          Pay now !
       </Text>
      </TouchableOpacity>
    </View>
  )
}

export default PaymentButton