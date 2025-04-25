import { client, setHeaderToken } from './client';

export const fetchNewToken = async () => {
  try {
    const token: string = await client
      .post('/auth/refresh', {}, { withCredentials: true })
      .then((res) => res.data.accessToken);

    return token;
  } catch (error) {
    return null;
  }
};

export const useAuthRefresh = async (failedRequest: any) => {
  const newToken = await fetchNewToken();

  if (newToken) {
    failedRequest.response.config.headers.Authorization = 'Bearer ' + newToken;
    setHeaderToken(newToken);
    // you can set your token in storage too
    // setToken({ token: newToken });
    return Promise.resolve(newToken);
  } else {
    // redirect to login page without polluting history
    if (typeof window !== 'undefined') {
      // only redirect if not already on login to avoid loops
      if (window.location.pathname !== '/login') {
        window.location.replace('/login');
      }
    }
    return Promise.reject();
  }
};
