import { API_BASE_URL } from "@/config";

const getToken = () => {
    return localStorage.getItem('token');
};

export interface Subject {
    id?: number;
    title: string;
    description: string;
    userId?: string;
}

export const fetchSubjects = async (): Promise<Subject[]> => {
    const response = await fetch(`${API_BASE_URL}/subjects`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
    if (!response.ok) {
        throw new Error('Failed to fetch subjects');
    }
    return await response.json();
};

export const createSubject = async (subject: Subject): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/subjects`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(subject),
    });

    if (!response.ok) {
        throw new Error('Failed to create subject');
    }
};
