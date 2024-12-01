import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

// Create Axios instance with base settings
const apiClient = axios.create({
  baseURL: 'http://localhost:5000', // Your backend API URL
  withCredentials: true, // Include cookies for refresh token
});

// Intercept response errors
apiClient.interceptors.response.use(
  response => response, // Pass through successful responses
  async error => {
    const originalRequest = error.config;

    // If the error is a 403 (Forbidden) and the request hasn't been retried
    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark the request to prevent an infinite loop

      try {
        // Attempt to refresh the access token
        const response = await axios.post('http://localhost:5000/api/auth/refresh-token');

        // Store the new access token in session storage
        sessionStorage.setItem('accessToken', response.data.accessToken);

        // Update the original request Authorization header with the new token
        originalRequest.headers['Authorization'] = `Bearer ${response.data.accessToken}`;

        // Retry the original request with the updated token
        return apiClient(originalRequest);
      } catch (err) {
        console.error('Token refresh failed:', err);

        // Clear stored tokens and redirect to the login page if refresh fails
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('role');

        // Redirect to the login page using Vue Router
        router.push('/login');

        return Promise.reject(err);
      }
    }

    return Promise.reject(error); // Reject other errors
  }
);

export default apiClient;
