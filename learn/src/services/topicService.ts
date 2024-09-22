import { API_BASE_URL } from "@/config";

const getToken = () => {
    return localStorage.getItem('token');
};

export interface Subject {
  id: number;
  title: string;
}

export interface Topic {
  id: number;
  title: string;
  description: string;
  video_url: string;
}

interface FetchTopicsResponse {
  topics: Topic[];
  total: number;
}

export const fetchAllTopic = async (): Promise<Topic[]> => {
    const response = await fetch(`${API_BASE_URL}/topics`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
    
    if (!response.ok) {
        throw new Error('Failed to fetch topics');
    }
    return await response.json();
};

export const createTopic = async (formData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/topics`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Failed to create topic');
    }

    return await response.json();
};

export const fetchTopicsBySubject = async (
  subjectId: any,
  page: number,
  limit: number,
  token: string
): Promise<FetchTopicsResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/topics/subject/${subjectId}?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch topics');
  }
  const data = await response.json();
  if (!Array.isArray(data.topics) || typeof data.total !== 'number') {
    throw new Error('Invalid response format');
  }

  return data;
};


export const sendVideoProgress = async (userId: number, topicId: number, watchTimePercentage: number, token: string) => {
  const response = await fetch(`${API_BASE_URL}/v1/video-progress/${userId}/${topicId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ watchTimePercentage }),
  });

  if (!response.ok) {
    throw new Error('Failed to send video progress');
  }

  return await response.json();
};

