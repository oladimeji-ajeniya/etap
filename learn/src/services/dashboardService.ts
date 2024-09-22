import { API_BASE_URL } from "@/config";

const getToken = () => {
    return localStorage.getItem('token');
};

export interface UserWatachedTime {
    userId?: number;
    name: string;
    email: string;
    totalWatchTime: number;
}

export const fetchUserTotalVideoWatchedList = async (): Promise<UserWatachedTime[]> => {
    const response = await fetch(`${API_BASE_URL}/video-progress`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
    if (!response.ok) {
        throw new Error('Failed to fetch subjects');
    }
    return await response.json();
};