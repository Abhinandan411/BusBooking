import { createMMKV  } from 'react-native-mmkv'

export const storage =  createMMKV();

export const setAccessToken = (token: string) => {
    storage.set('accessToken', token);
};

export const getAccessToken = () => {
    return storage.getString('accessToken');
};

export const removeAccessToken = () => {
    storage.remove('accessToken');
};

export const setRefreshToken = (token: string) => {
    storage.set('refreshToken', token);
};

export const getRefreshToken = () => {
    return storage.getString('refreshToken');
};

export const removeRefreshToken = () => {
    storage.remove('refreshToken');
};