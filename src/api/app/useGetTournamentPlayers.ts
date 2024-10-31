import { useState } from 'react';
import axiosInstance from '../axios';
import { handleApiResponse } from '@/utils/handlers';
import { ApiResponse } from '@/types';
import { Player } from '@/stores/types';


interface GetTournamentPlayersProps {
    id: string;
    search?: string;
}

interface GetTournamentPlayersResponse {
    results: Player[]
}

const useGetTournamentPlayers = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);

    const getPlayers = async ({ id, search }: GetTournamentPlayersProps): Promise<GetTournamentPlayersResponse | null> => {
        setLoading(true);
        setError(null);

        try {
            let url = `tournament/marker/get-tournament-players/${id}`;
            if (search) url = url + `?q=${search}`;

            const data = await handleApiResponse(
                axiosInstance.get<ApiResponse<GetTournamentPlayersResponse>>(url)
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

export default useGetTournamentPlayers;