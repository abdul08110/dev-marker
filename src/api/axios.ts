import axios from 'axios';
import { toast } from '@/components/ui/use-toast';
import { getToken } from '@/utils/auth';



const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    config => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    response => {
        return response;
    },
    async error => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshTokenResponse = await axiosInstance.post('/auth/refresh-token', {
                    token: localStorage.getItem('refresh-token'),
                });

                if (refreshTokenResponse.status === 200) {
                    const { accessToken, refreshToken } = refreshTokenResponse.data;
                    localStorage.setItem('access-token', accessToken);
                    localStorage.setItem('refresh-token', refreshToken);
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return axiosInstance(originalRequest);
                } else {
                    toast({
                        title: "Error",
                        description: "Failed to refresh token",
                        variant: "destructive",
                    });
                    localStorage.removeItem('access-token');
                    localStorage.removeItem('refresh-token');
                    window.location.href = '/login';
                }
            } catch (err: any) {
                toast({
                    title: "Error",
                    description: err.message || 'An error occurred',
                    variant: "destructive",
                });
                localStorage.removeItem('access-token');
                localStorage.removeItem('refresh-token');
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);


export default axiosInstance;