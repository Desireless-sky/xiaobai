const API_BASE_URL = 'http://localhost:8000';

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/login/`,
  REGISTER: `${API_BASE_URL}/users/`,
  CHAT: `${API_BASE_URL}/chat/`,
  PROFILE: `${API_BASE_URL}/users/me`,
};

export const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}; 