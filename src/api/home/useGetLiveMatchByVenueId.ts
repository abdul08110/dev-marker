import { useState } from 'react';
import axiosInstance from '../axios';
import { handleApiResponse } from '@/utils/handlers';
import { ApiResponse } from '@/types';


interface MarkerMatchByVenueResponse {
    matchId: string | null;
}

const useMarkerGetLiveMatchByVenue = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<MarkerMatchByVenueResponse | null>(null);

    const getMarkerLiveMatchesByVenue = async (id: string): Promise<MarkerMatchByVenueResponse | null> => {
        setLoading(true);
        setError(null);

        try {
            const data = await handleApiResponse(
                axiosInstance.get<ApiResponse<MarkerMatchByVenueResponse>>(`match/marker/get-active-matches-by-venue-id/${id}`)
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

    return { getMarkerLiveMatchesByVenue, loading, error, data };
};

export default useMarkerGetLiveMatchByVenue;