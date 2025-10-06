import { ApiResponse } from "@/types";
import axiosInstance from "../axios";
import { handleApiResponse } from "@/utils/handlers";
import { useState } from "react";

interface GetCameraRtspUrlAndWebsocketUrlProps {
    matchId: string;
}

export interface GetCameraRtspUrlAndWebsocketUrlResponse {
    cameraRtspUrl: string;
    websocketUrl: string;
}

const useGetCameraRtspUrlAndWebsocketUrl = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getCameraRtspUrlAndWebsocketUrl = async (props: GetCameraRtspUrlAndWebsocketUrlProps) => {

    try {
        const data = await handleApiResponse(
            axiosInstance.get<ApiResponse<GetCameraRtspUrlAndWebsocketUrlResponse>>(
                `match/marker/get-camera-rtsp-url-and-websocket-url/${props.matchId}`,
            ),
        );
        return data;
    } catch (err: any) {
        setError(err.message);
        return null;
    } finally {
        setLoading(false);
    }
  };                

  return { getCameraRtspUrlAndWebsocketUrl, loading, error };
};

export default useGetCameraRtspUrlAndWebsocketUrl;