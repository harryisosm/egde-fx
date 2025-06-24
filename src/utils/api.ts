import config from '@/config';

export const API_URL = config.apiUrl;

const handleResponse = async (response: Response) => {
  console.log('Response status:', response.status);
  console.log('Response headers:', Object.fromEntries(response.headers.entries()));
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    console.error('API Error:', {
      status: response.status,
      statusText: response.statusText,
      error,
      url: response.url
    });
    throw new Error(error.message || 'An error occurred');
  }
  return response.json();
};

export const api = {
  async post(endpoint: string, data: any) {
    const url = `${API_URL}${endpoint}`;
    console.log('Making POST request to:', url);
    console.log('Request data:', data);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('POST request failed:', error);
      throw error;
    }
  },

  async get(endpoint: string) {
    const url = `${API_URL}${endpoint}`;
    console.log('Making GET request to:', url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        mode: 'cors',
      });
      return handleResponse(response);
    } catch (error) {
      console.error('GET request failed:', error);
      throw error;
    }
  },

  async patch(endpoint: string, data: any) {
    const url = `${API_URL}${endpoint}`;
    console.log('Making PATCH request to:', url);
    console.log('Request data:', data);
    
    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('PATCH request failed:', error);
      throw error;
    }
  },
}; 