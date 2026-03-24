import axios from 'axios';
import {getAccessToken , getRefreshToken , setAccessToken} from '../service/storage'; 
import {BASE_URL} from './config.ts'


const apiClient = axios.create({
    baseURL:BASE_URL,
});

// Request Intercepotor
apiClient.interceptors.request.use(
    async config =>{
        const token = await getAccessToken();
        console.log(token , "TOKEN ");
        
        if(token){
            config.headers.Authorization =`Bearer ${token}`; 
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
    
);

// Response Interceptor
apiClient.interceptors.response.use(
    response => response,
    async error => {
        if(error.response.status === 403){
            const refreshToken = await getRefreshToken();
            if(!refreshToken){
                return Promise.reject(error);
            }
            try{
                const {data}  = await axios.post(`${BASE_URL}/user/refresh` , {refreshToken});
                setAccessToken(data?.accessToken);
                error.config.headers.Authorization = `Bearer${data?.accessToken}`;
                return axios(error.config);
            }
            catch(refreshErr){
                return Promise.reject(refreshErr);
            }

        }

        return Promise.reject(error);
    }
);

export default apiClient;

