import { useState } from 'react';
import axiosInstance from '../axios';
import { handleApiResponse } from '@/utils/handlers';
import { ApiResponse } from '@/types';


interface Player {
    name: string;
    profilePhoto?: string;
    id: string;
}

interface SearchPlayerProps {
    phoneNumber: string;
}

interface SearchPlayersResponse {
    result: Player | null
}

const useSearchPlayers = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [player, setPlayer] = useState<Player | null>(null);

    const getPlayers = async ({ phoneNumber }: SearchPlayerProps): Promise<SearchPlayersResponse | null> => {
        setLoading(true);
        setError(null);

        try {
            const data = await handleApiResponse(
                axiosInstance.get<ApiResponse<SearchPlayersResponse>>(`user/marker/search-by-phonenumber/${phoneNumber}`)
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

    return { getPlayers, loading, error, player };
};

export default useSearchPlayers;