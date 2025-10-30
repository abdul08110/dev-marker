import { useState } from 'react';
import axiosInstance from '../axios';
import { handleApiResponse } from '@/utils/handlers';
import { ApiResponse } from '@/types';
import { Player } from '@/stores/types';

interface GetPlayerByIdResponse {
    result: Player;
}

const useGetPlayerById = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [player, setPlayer] = useState<Player | null>(null);

    const getPlayerById = async (playerId: string): Promise<GetPlayerByIdResponse | null> => {
        setLoading(true);
        setError(null);

        try {
            const data = await handleApiResponse(
                axiosInstance.get<ApiResponse<GetPlayerByIdResponse>>(`user/marker/get-player/${playerId}`)
            );
            setPlayer(data.result);
            return data;
        } catch (err: any) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { getPlayerById, loading, error, player };
};

export default useGetPlayerById; 