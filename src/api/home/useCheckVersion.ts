import { useState } from 'react';
import axiosInstance from '../axios';
import { handleApiResponse } from '@/utils/handlers';
import { ApiResponse } from '@/types';

interface GetVersionUpdateRequiredResponse {
  isUpdatedRequired: boolean;
  version: string | null;
  changes: string | null;
}

const useCheckVersionOfPwa = () => {
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState<string | null>(null);

  const checkVersion = async (): Promise<Boolean | null> => {
    setError(null);

    try {
      const versionResponse = await fetch('/version.json');
      const { version: currentVersion } = await versionResponse.json();

      setVersion(currentVersion);

      let url = `app-version/app/check-version`;

      const res = await handleApiResponse(
        axiosInstance.post<ApiResponse<GetVersionUpdateRequiredResponse>>(url, {
          version: currentVersion,
          platform: 'MARKER',
        }),
      );

      if (res.isUpdatedRequired) {
        return true;
      } else {
        return false;
      }
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  return { checkVersion, version, error };
};

export default useCheckVersionOfPwa;
