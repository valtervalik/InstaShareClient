import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { useAuthRefresh } from './auth-refresh';

export const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const setHeaderToken = (token: string) => {
  client.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const removeHeaderToken = () => {
  //client.defaults.headers.common.Authorization = null;
  delete client.defaults.headers.common.Authorization;
};

createAuthRefreshInterceptor(client, useAuthRefresh, {
  statusCodes: [401], // default: [ 401 ]
  pauseInstanceWhileRefreshing: true,
});
