import { View, Text, ActivityIndicator, TouchableOpacity, Alert, ScrollView } from 'react-native'
import React, { useCallback } from 'react'
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { useMutation, useQuery } from '@tanstack/react-query';
import { bookTicket, fetchBusDetails } from '../service/requests/bus';
import { goBack, resetAndNavigate } from '../utils/NavigationUtils';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon, StarIcon } from 'react-native-heroicons/outline';
import TicketModal from '../components/ui/TicketModal';
import PaymentButton from '../components/ui/PaymentButton';
import { seats } from '../utils/dummyData';
import Seat from '../components/ui/Seat';

const SeatSelectionScreen = () => {
    const [ticketVisible, setTicketVisible] = React.useState(false);
    const [selectedSeats, setSelectedSeats] = React.useState<number[]>([]);
    const route = useRoute();
    const { busId } = route.params as { busId: string };

    const { data:busInfo, isLoading, isError, refetch } = useQuery({
        queryKey: ['busDetails', busId],
        queryFn: () => fetchBusDetails(busId),
    });
    
    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [busId, refetch])
    );

    const bookTicketMutation = useMutation({
        mutationFn: (
            ticketData: { busId: string, date: string, seatNumber: number[] }
        ) => bookTicket(ticketData),
        onSuccess: (data) => {
            console.log('Ticket Booked Successfully', data);
            setTicketVisible(true);
        },
        onError: (error) => {
            console.error('Ticket Booking Failed', error);
            Alert.alert('Ticket Booking Failed', 'Please try again.');
        }
    })
    const handleSeatSelection = (seat_id: number) => {
        setSelectedSeats((prev) => (
            prev.includes(seat_id) ? prev.filter((id) => id !== seat_id) : [...prev, seat_id]
        ))
    }

    const handleOnPay = () => {
        if (selectedSeats.length === 0) {
            Alert.alert('No Seats Selected', 'Please select at least one seat.');
            return;
        }

        bookTicketMutation.mutate({
            busId,
            date: new Date(busInfo?.departureTime).toISOString(),
            seatNumber: selectedSeats
        })
    }




    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="teal" />
                <Text className='text-gray-500 mt-2'>Loading bus details...</Text>
            </View>
        )
    }

    if (isError) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text className='text-red-500 mt-2'>Faliled to load bus details.</Text>
                <TouchableOpacity onPress={() => { goBack() }}>
                    <Text className='text-teal-500 mt-2'>Go Back</Text>
                </TouchableOpacity>
            </View>
        )
    }




    

    return (
        <View className='flex-1 bg-white justify-center items-center'>
            <SafeAreaView />
            <View className='bg-white p-4 flex-row items-center border-b-[1px] border-teal-400 '>
                <TouchableOpacity onPress={() => goBack()}>
                    <ArrowLeftIcon size={20} color='#000' />
                </TouchableOpacity>
                <View className='ml-4'>
                    <Text className='text-lg font-bold'>
                        Seat Selection
                    </Text>
                    <Text >{busInfo?.from} → {busInfo?.to}</Text>
                    <Text className='text-sm text-gray-500'>
                        {new Date(busInfo?.departureTime).toLocaleString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}{'  '}
                        {new Date(busInfo?.departureTime).toLocaleDateString()}
                    </Text>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 200 }}
                className='pb-20 bg-teal-100 p-4'
            >    
   
               <Seat
                selectedSeats={selectedSeats}
                seat={busInfo?.seats}
                onSeatSelect={handleSeatSelection}
               />

                
                <View className='bg-white rounded-lg p-4 drop-shadow-sm'>
                    <View className='flex-row items-center justify-between mb-2' >
                        <Text className='text-lg font-semibold'>{busInfo?.company}</Text>
                        <View className='flex-row items-center'>
                            <StarIcon color='gold' size={18} />
                            <Text>{busInfo?.rating} ({busInfo?.totalReviews})</Text>
                        </View>
                    </View>
                    <Text className='text-sm text-gray-600 mb-1'>{busInfo?.busType}</Text>

                    <View className='flex-row justify-between mt-2'>
                        <View className='items-center'>
                            <Text className='text-lg font-bold'>
                                {new Date(busInfo?.departureTime).toLocaleString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </Text>
                            <Text className='text-sm text-gray-500'>Departure</Text>
                        </View>
                        <Text className='text-sm text-gray-500'>{busInfo?.duration}</Text>
                        <View className='items-center'>
                            <Text className='text-lg font-bold'>
                                {new Date(busInfo?.arrivalTime).toLocaleString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </Text>
                            <Text className='text-sm text-gray-500'>Arrival</Text>
                        </View>
                    </View>

                    <Text className='mt-3 text-green-600 text-md'>
                        {busInfo?.seats?.flat().filter((seat: any) => !seat.booked).length}{' '} Seats Available
                    </Text>

                    <View className='flex-row items-center mt-2'>
                        <Text className='text-gray-400 text-lg line-through'>
                            ₹{busInfo?.originalPrice}
                        </Text>
                        <Text className='text-xl font-bold text-black ml-2'>
                            ₹{busInfo?.price} (1/p)
                        </Text>
                    </View>

                    <View className='flex-row gap-2 mt-3'>
                        {busInfo?.badges?.map((badge: string, index: number) => (
                            <View key={index} className='bg-yellow-200 px-2 py-1 rounded-full'>
                                <Text className='text-xs text-yellow-800 font-semibold'>{badge}</Text>
                            </View>
                        ))}
                    </View>

                </View>
            </ScrollView>

            <PaymentButton price={busInfo?.price || 0} seat={selectedSeats.length} onPay={handleOnPay} />

            {ticketVisible && (
                
                <TicketModal
                    bookingInfo={{
                        from: busInfo?.from,
                        to: busInfo?.to,
                        departureTime: new Date(busInfo?.departureTime).toLocaleTimeString(
                            [],
                            { hour: '2-digit', minute: '2-digit' }
                        ),
                        arrivalTime: new Date(busInfo?.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        date: new Date(busInfo?.departureTime).toDateString(),
                        company: busInfo?.company,
                        busType: busInfo?.busType,
                        seats: bookTicketMutation.data?.seatNumber,
                        ticketNumber: bookTicketMutation.data?._id || 'xxxxxxxx',
                        pnr: bookTicketMutation.data?.pnr || 'xxxxxxxx',
                        fare: `${busInfo?.price * selectedSeats.length}`
                    }}
                    onClose={() => {
                        resetAndNavigate('HomeScreen')
                        setTicketVisible(false)
                    }}
                    visible={ticketVisible}
                />
            )}
        </View>
    )
}

export default SeatSelectionScreen