import { useRouter } from 'next/navigation';
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
  const router = useRouter();

  if (newToken) {
    failedRequest.response.config.headers.Authorization = 'Bearer ' + newToken;
    setHeaderToken(newToken);
    // you can set your token in storage too
    // setToken({ token: newToken });
    return Promise.resolve(newToken);
  } else {
    // you can redirect to login page here
    router.push('/login');
    return Promise.reject();
  }
};
