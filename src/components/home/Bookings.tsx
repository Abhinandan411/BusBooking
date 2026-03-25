import { View, Text, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native'
import React, { useCallback } from 'react'
import { tabs } from '../../utils/dummyData';
import Search from './Search';
import { useQueries, useQuery } from '@tanstack/react-query';
import { fetchUserTickets } from '../../service/requests/bus';
import { useFocusEffect } from '@react-navigation/native';
import BookItem from './BookItem';

const Bookings = () => {

  const [seletedTab, setSeletedTab] = React.useState('All')
  const [refreshing, setRefreshing] = React.useState(false);

  const { data: tickets, isLoading, isError, refetch } = useQuery({
    queryKey: ['userTickets'],
    queryFn: () => fetchUserTickets(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true
  })


  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // const filteredBooking = seletedTab === 'All' ? tickets : tickets.filter((ticket: any) => ticket.status === seletedTab);
  const filteredBooking =
    seletedTab === 'All'
      ? (tickets ?? [])
      : (tickets ?? []).filter((ticket: any) => ticket.status === seletedTab);

  if (isLoading) {
    return (
      <View className='flex-1 items-center justify-center bg-white'>
        <ActivityIndicator size='large' color='teal' />
        <Text className='text-gray-500 mt-2'>Fetching Bookings...</Text>
      </View>
    )
  }

  if (isError) {
    // console.log('Error Fetching Bookings', isError);
    return (
      <View className='flex-1 items-center justify-center bg-white '>
        <Text className='text-red-500'>Error Fetching Bookings</Text>
        <TouchableOpacity onPress={() => refetch()} className='mt-4 px-4 py-2 bg-blue-500 rounded'>
          <Text className='text-white font-semibold'>Retry</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View className='flex-1 p-2 bg-white'>
      <FlatList ListHeaderComponent={
        <>
          <Search />
          <Text className='text-2xl font-bold my-4'>Past Booking</Text>
          <View className='flex-row mb-4'>
            {tabs?.map((tab, index) => (
              <TouchableOpacity onPress={() => setSeletedTab(tab)} key={tab} className={`px-4 py-2 rounded-lg mx-1 ${seletedTab == tab ? 'bg-red-400' : 'bg-gray-300'} `}>
                <Text className={`text-sm font-bold ${seletedTab == tab ? 'text-white' : 'text-gray-800'}`}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      }
        showsVerticalScrollIndicator={false}
        data={filteredBooking}
        keyExtractor={item => item._id}
        nestedScrollEnabled
        contentContainerStyle={{ flexGrow: 1 }}
        ListEmptyComponent={
          <View className='items-center mt-6'>
            <Text className='text-gray-500'> No Booking Found </Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }

        renderItem={({ item }) => <BookItem item={item} />}

      />
    </View>
  )
}

export default Bookings