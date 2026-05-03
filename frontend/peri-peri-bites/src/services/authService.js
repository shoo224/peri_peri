// Prefer a runtime-injected `window.__API_BASE_URL` when available (useful for hosted builds),
// otherwise fall back to Vite env `VITE_API_BASE_URL`, then localhost.
const API_ROOT = (typeof window !== 'undefined' && window.__API_BASE_URL)
  || import.meta.env.VITE_API_BASE_URL
  || 'http://localhost:5000';
// Normalize root: remove trailing slash and strip a trailing '/api' if present
let normalizedRoot = API_ROOT.replace(/\/$/, '');
normalizedRoot = normalizedRoot.replace(/\/api$/i, '');
const API_BASE_URL = `${normalizedRoot}/api/auth`;

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    return data;
  } catch (error) {
    // Provide clearer network error message so UI shows actionable info
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Network error: could not reach authentication server. Check API URL and CORS.');
    }
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Network error: could not reach authentication server. Check API URL and CORS.');
    }
    throw error;
  }
};

export const createOrder = async (orderPayload) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderPayload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create order');
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Network error: could not reach authentication server. Check API URL and CORS.');
    }
    throw error;
  }
};
