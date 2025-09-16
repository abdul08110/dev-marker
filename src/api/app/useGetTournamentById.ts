import { useState } from 'react';
import axiosInstance from '../axios';
import { handleApiResponse } from '@/utils/handlers';
import { ApiResponse } from '@/types';
import { Tournament } from '@/stores/types';


interface GetTournamentResponse {
    data: Tournament
}

const useGetTournament = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [tournament, setTournament] = useState<Tournament | null>(null);

    const getTournament = async ({ id }: { id: string }): Promise<GetTournamentResponse | null> => {
        setLoading(true);
        setError(null);

        try {
            if (id) {
                let url = `tournament/marker/get-tournament/${id}`;
    
                const data = await handleApiResponse(
                    axiosInstance.get<ApiResponse<GetTournamentResponse>>(url)
                );
    
                setTournament(data.data);
                return data;
            } else return null;
        } catch (err: any) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { getTournament, loading, error, tournament: tournament };
};

export default useGetTournament;