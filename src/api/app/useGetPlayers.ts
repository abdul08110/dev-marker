import { useState } from 'react';
import axiosInstance from '../axios';
import { handleApiResponse } from '@/utils/handlers';
import { ApiResponse } from '@/types';
import { Player } from '@/stores/types';


interface GetPlayersProps {
    id: string;
}

interface GetPlayersResponse {
    results: Player[]
}

const useGetPlayers = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [players, setPlayers] = useState<Player[] | null>(null);

    const getPlayers = async ({ id }: GetPlayersProps): Promise<GetPlayersResponse | null> => {
        setLoading(true);
        setError(null);

        try {
            const data = await handleApiResponse(
                axiosInstance.get<ApiResponse<GetPlayersResponse>>(`user/marker/club-players/${id}`)
            );
            setPlayers(data.results);
            return data;
        } catch (err: any) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { getPlayers, loading, error, players };
};

export default useGetPlayers;