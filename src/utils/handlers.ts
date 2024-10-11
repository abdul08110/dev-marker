import { toast } from '@/components/ui/use-toast';
import { AxiosResponse } from 'axios';

interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}

export const handleApiResponse = async <T>(
  apiCall: Promise<AxiosResponse<ApiResponse<T>>>,
  showErrorToast: boolean = true,
): Promise<T> => {
  try {
    const response = await apiCall;

    if (response.status >= 400 || response.data.statusCode >= 400) {
      throw new Error(response.data.message || response.statusText);
    }

    const responseData = response.data.data;

    // toast({
    //     title: "Success",
    //     description: response.data.message || "Operation successful",
    //     className: 'bg-white'
    // });

    return responseData;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'An error occurred';
    if (showErrorToast) {
      toast({
        title: 'Uh oh! Something went wrong',
        description: errorMessage,
        variant: 'destructive',
      });
    }

    throw new Error(errorMessage);
  }
};
