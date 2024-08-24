import { useState } from 'react';
import axiosInstance from '../axios';
import { handleApiResponse } from '@/utils/handlers';
import { ApiResponse } from '@/types';


interface MarkerClubsResponse {
    club: {
        id: string;
        imageUrl: string;
        name: string;
    }
    id: string;
    venue: {
        id: string;
        name: string;
        no: number
    }
}

const useMarkerClubs = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<MarkerClubsResponse[] | null>(null);

    const getMarkerClubs = async (): Promise<MarkerClubsResponse[] | null> => {
        setLoading(true);
        setError(null);

        try {
            const data = await handleApiResponse(
                axiosInstance.get<ApiResponse<MarkerClubsResponse[]>>('club/marker/clubs')
            );

            setData(data);

            return data;
        } catch (err: any) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { getMarkerClubs, loading, error, data };
};

export default useMarkerClubs;