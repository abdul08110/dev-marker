import { useState } from 'react';
import axiosInstance from '../axios';
import { handleApiResponse } from '@/utils/handlers';
import { ApiResponse } from '@/types';

interface UseLoginProps {
    email: string;
    password: string;
}

interface LoginResponse {
    tokens: {
        accessToken: string;
        refreshToken: string;
    }
    name: string;
}

const useLogin = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const login = async ({ email, password }: UseLoginProps): Promise<LoginResponse | null> => {
        setLoading(true);
        setError(null);

        try {
            const data = await handleApiResponse(
                axiosInstance.post<ApiResponse<LoginResponse>>('auth/marker/login', {
                    email,
                    password,
                })
            );

            localStorage.setItem('access_token', data.tokens.accessToken);
            localStorage.setItem('refresh_token', data.tokens.refreshToken);
            localStorage.setItem('name', data.name);

            return data;
        } catch (err: any) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { login, loading, error };
};

export default useLogin;