import { useState } from 'react';
import axiosInstance from '../axios';
import { handleApiResponse } from '@/utils/handlers';
import { ApiResponse } from '@/types';
import { Player } from '@/stores/types';


interface GetPlayersProps {
    id: string;
    search?: string;
}

interface GetPlayersResponse {
    results: Player[]
}

const useGetPlayers = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);

    const getPlayers = async ({ id, search }: GetPlayersProps): Promise<GetPlayersResponse | null> => {
        setLoading(true);
        setError(null);

        try {
            if (id) {
                let url = `user/marker/club-players/${id}`;
                if (search) url = url + `?q=${search}`;
    
                const data = await handleApiResponse(
                    axiosInstance.get<ApiResponse<GetPlayersResponse>>(url)
                );
                setPlayers(data.results);
    
                return data;
            } else return null;
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