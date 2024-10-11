import { useState } from 'react';
import axiosInstance from '../axios';
import { handleApiResponse } from '@/utils/handlers';
import { ApiResponse } from '@/types';
import { Set } from '@/stores/types';

interface MatchGetLiveDataProps {
    matchId: string,
}

export interface MatchStartResponse {
    activePlayerId: string | null;
    actualStartTimeDate: string;
    clubId: string;
    createdAt: string;
    currentSetTeamOneScore: number;
    currentSetTeamTwoScore: number;
    expectedEndTimeDate: string;
    id: string;
    noOfSets: number;
    handicap: number;
    sideOnePlayerOne: {
        id: string;
        name: string;
        profilePhoto: string;
    },
    sideOnePlayerTwo: {
        id: string;
        name: string;
        profilePhoto: string;
    } | null,
    sideTwoPlayerTwo: {
        id: string;
        name: string;
        profilePhoto: string;
    } | null,
    sideTwoPlayerOne: {
        id: string;
        name: string;
        profilePhoto: string;
    },
    sport: 'SNOOKER' | 'BILLIARDS',
    sportType: 'SNOOKER_15_RED' | 'SNOOKER_10_RED' | 'SNOOKER_6_RED',
    teamOneScore: number,
    teamTwoScore: number,
    venueId: string,
    sets: Set[],
    streamingType: 'PUBLIC' | 'PRIVATE'
}

const useGetMatchLiveData = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getLiveMatchData = async (props: MatchGetLiveDataProps) => {
        setLoading(true);
        setError(null);

        try {
            const data = await handleApiResponse(
                axiosInstance.get<ApiResponse<MatchStartResponse>>(`match/marker/get-live-match-data/${props.matchId}`)
            );

            return data;
        } catch (err: any) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { getLiveMatchData, loading, error };
};

export default useGetMatchLiveData;

