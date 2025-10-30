import { useState } from 'react';
import axiosInstance from '../axios';
import { handleApiResponse } from '@/utils/handlers';
import { ApiResponse } from '@/types';
import { Player } from '@/stores/types';

interface AddPlayerToTournamentProps {
    playerId: string;
    tournamentId: string;
    teamId?: string;
}

interface AddPlayerToTournamentResponse {
    result: Player;
}

const useAddPlayerToTournament = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const addPlayerToTournament = async ({ playerId, tournamentId, teamId }: AddPlayerToTournamentProps): Promise<AddPlayerToTournamentResponse | null> => {
        setLoading(true);
        setError(null);

        try {
            const payload = {
                playerId,
                tournamentId,
                ...(teamId && { teamId })
            };

            const data = await handleApiResponse(
                axiosInstance.post<ApiResponse<AddPlayerToTournamentResponse>>('tournament/marker/add-player-to-tournament', payload)
            );
            
            return data;
        } catch (err: any) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { addPlayerToTournament, loading, error };
};

export default useAddPlayerToTournament; 