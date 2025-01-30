import { useState } from 'react';
import axiosInstance from '../axios';
import { handleApiResponse } from '@/utils/handlers';
import { ApiResponse } from '@/types';

interface MatchStartDataProps {
    expectedEndTimeDate?: Date,
    clubId: string,
    sport: 'BILLIARDS' | 'SNOOKER',
    sportType: 'SNOOKER_15_RED' | 'SNOOKER_10_RED' | 'SNOOKER_6_RED' | 'BILLIARDS_RACE_TO' | 'BILLIARDS_TIME_BASED',
    venueId: string,
    sideOnePlayerOneId: string,
    sideOnePlayerTwoId?: string,
    sideTwoPlayerOneId: string,
    sideTwoPlayerTwoId?: string,
    streamingType: 'PUBLIC' | 'PRIVATE',
    handicap: number;
    maxScorePerSet: number | null,
    noOfSets: number | null,
    cumulativeScoring?: boolean,
    tournamentTeamOneId?: string,
    tournamentTeamTwoId?: string,
    tournamentId?: string,
    tournamentTeamOneScore?: number,
    tournamentTeamTwoScore?: number,
    teamOneHandicap?: number,
    teamTwoHandicap?: number,
    format?: string,
    tournamentSubItemId?: string,
    switchType?: 'FRAME' | 'VISIT' | null,
}

interface MatchStartResponse {
    matchId: string
}

const useStartMatch = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [matchId, setMatchId] = useState<string | null>(null);

    const startMatch = async (props: MatchStartDataProps): Promise<string | null> => {
        setLoading(true);
        setError(null);

        try {
            const data = await handleApiResponse(
                axiosInstance.post<ApiResponse<MatchStartResponse>>(`match/marker/start-match/`, props)
            );

            setMatchId(data.matchId);
            return data.matchId;
        } catch (err: any) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { startMatch, loading, error, matchId };
};

export default useStartMatch;