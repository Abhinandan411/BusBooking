import apiClient from "../apiClient";

export const fetchBuses = async(from: string , to: string , date: string)=>{
    const {data} = await apiClient.get('/bus/search', {
        params: {
            from,
            to,
            date
        }
    });
    return data?.data?.buses || [];
}

export const fetchBusDetails = async(busId: string)=>{
    const {data} = await apiClient.get(`/bus/${busId}`);
    return data?.data || [];
}

export const fetchUserTickets = async()=>{
    const {data} = await apiClient.get('/ticket/my-tickets');
    return data?.tickets || [];
}

export const bookTicket = async({busId, date , seatNumber}:{busId: string , date: string , seatNumber: number[] })=>{
    const {data} = await apiClient.post('/ticket/book' , {busId , date , seatNumber});
    return data?.ticket;
}

