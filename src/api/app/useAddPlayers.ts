import { useState } from 'react';
import axiosInstance from '../axios';
import { handleApiResponse } from '@/utils/handlers';
import { ApiResponse } from '@/types';
import { Player } from '@/stores/types';

interface AddPlayerProps {
  phoneNumber: string;
  name: string;
  type: 'MEMBER' | 'GUEST';
  clubId: string;
}

interface playerAddResonse {
  result: Player;
}

const useAddPlayers = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const addPlayer = async ({ phoneNumber, name, type, clubId }: AddPlayerProps): Promise<playerAddResonse | null> => {
    setLoading(true);
    setError(null);

    try {
      const data = await handleApiResponse(
        axiosInstance.post<ApiResponse<playerAddResonse>>(`user/marker/add-player`, {
          phoneNumber,
          name,
          type,
          clubId
        }),
      );

      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { addPlayer, loading, error };
};

export default useAddPlayers;
