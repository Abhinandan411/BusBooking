import { View, Text, Modal, TextInput, TouchableOpacity, FlatList } from 'react-native'
import React from 'react'
import { locations } from '../../utils/dummyData';
import { SafeAreaView } from 'react-native-safe-area-context';
interface LocationPickerModalProps {
    visible: boolean
    onClose: () => void
    onSelect: (location: string, type: 'from' | 'to') => void;
    type: 'from' | 'to'
    fromLocation?: string
    // toLocation?: string
}
const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
    visible,
    onClose,
    onSelect,
    type,
    fromLocation
}) => {

    const [search, setSearch] = React.useState('')

    const filteredLocations = locations.filter((loc) => loc.toLowerCase().includes(search.toLowerCase()))
    return (
        <Modal transparent={false} visible={visible} animationType='slide'>
            <View className='flex-1 bg-white p-4 '>
                {/* <SafeAreaView className='flex-1 ' /> */}
                <Text className='text-lg font-bold text-center mb-4'>
                    Select {type === 'from' ? 'Departure' : 'Destination'} City
                </Text>

                <TextInput
                    className='p-3 border border-gray-400 rounded-md mb-4 '
                    placeholder='Search City...'
                    value={search}
                    onChangeText={(text) => setSearch(text)}
                />

                <FlatList
                    data={filteredLocations}
                    keyExtractor={(item)=>item}
                    renderItem={({item})=>(
                        <TouchableOpacity className='p-3 border-b border-gray-300' onPress={() =>{
                            if(type === 'to' && item === fromLocation){
                               return
                            }
                            onSelect(item, type);
                            onClose();
                        }}>
                            <Text className={`text-md ${item === fromLocation ? "text-gray-400 " : "text-black"}`}>
                                {item}
                            </Text>
                        </TouchableOpacity>
                    )}

                >

                </FlatList>
                <TouchableOpacity className='p-3 bg-gray-300 rounded-lg mt-4 ' onPress={() => onClose()} >
                    <Text className='text-center text-black font-bold'>
                        Cancel
                    </Text>
                </TouchableOpacity>
            </View>
        </Modal>
    )
}

export default LocationPickerModal