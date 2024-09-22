import { API_BASE_URL } from '../config';

export const login = async (email: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Login failed. Please check your credentials.');
  }

  return await response.json();
};

export const signupUser = async (name: string, email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });
  
    if (!response.ok) {
      throw new Error('Signup failed');
    }
  
    return await response.json();
  };
