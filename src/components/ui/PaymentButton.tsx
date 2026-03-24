import { View, Text } from 'react-native'
import React from 'react'
import { seats } from '../../utils/dummyData'
interface PaymentButtonProps {
    price: number
    seat: number
    onPay:any
}

const PaymentButton:React.FC<PaymentButtonProps> = ({price,seat,onPay}) => {
  return (
    <View>
      <Text>PaymentButton</Text>
    </View>
  )
}

export default PaymentButton