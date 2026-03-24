import { View, Text, ActivityIndicator, TouchableOpacity, Alert, ScrollView } from 'react-native'
import React, { useCallback } from 'react'
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { useMutation, useQuery } from '@tanstack/react-query';
import { bookTicket, fetchBusDetails } from '../service/requests/bus';
import { goBack, resetAndNavigate } from '../utils/NavigationUtils';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'react-native-heroicons/outline';
import TicketModal from '../components/ui/TicketModal';
import PaymentButton from '../components/ui/PaymentButton';

const SeatSelectionScreen = () => {
    const [ticketVisible, setTicketVisible] = React.useState(false);
    const [selectedSeats, setSelecttedSeats] = React.useState<number[]>([]);

    const route = useRoute();
    const { busId } = route.params as { busId: string };

    const { data: busInfo, isLoading, isError, refetch } = useQuery({
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
        setSelecttedSeats((prev) => (
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
        <View>
            <SafeAreaView className='flex-1 bg-white' />
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

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 200 }} className='pb-20 bg-teal-100 p-4'>
              

            </ScrollView>

            <PaymentButton price={busInfo?.total_fare || 0} seat={selectedSeats.length} onPay={handleOnPay} />

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
                        seats: busInfo?.seatNumbers,
                        ticketNumber: busInfo?._id || 'xxxxxxxx',
                        pnr: busInfo?.pnr || 'xxxxxxxx',
                        fare: busInfo?.total_fare
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