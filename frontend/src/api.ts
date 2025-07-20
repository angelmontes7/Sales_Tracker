import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";

// This code is run during any API request


// Sets baseURL to server url to reduce the need to continously retyping full url
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

// Request Interceptor: Adds Authorization header
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN); // Retrieves token

        // If token and headers are defined then token is added to Authorization header
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
);

// Response Interceptor: Handles token refresh on 401 errors
api.interceptors.response.use(
    (response) => response, // If response is successful return original respone

    // For failed responses
    async (error) => {
        const originalRequest = error.config; // Stores original API request that failed

        // Checks if response is a unauthorized error and if we have already retried (preventing infinite looping)
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Sets retry to true
            const refreshToken = localStorage.getItem(REFRESH_TOKEN); // gets refresh token

            // If refresh token exists
            if (refreshToken) {
                // Send api request to get a new access token
                try {
                    const response = await axios.post(
                        `${import.meta.env.VITE_API_URL}/api/token/refresh/`,
                        { refresh: refreshToken }
                    );
                    
                    const newAccessToken = response.data.access; // Gets the new token
                    localStorage.setItem(ACCESS_TOKEN, newAccessToken); // Stores token

                    // Update Authorization header and retry original request
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                // If refreshing fails:
                } catch (refreshError) {
                    console.error("Refresh token expired or invalid:", refreshError);
                    // Clean up
                    localStorage.removeItem(ACCESS_TOKEN);
                    localStorage.removeItem(REFRESH_TOKEN);
                    window.location.href = "/login"; // Forces user to log back in
                }
            // Clean up
            } else {
                localStorage.removeItem(ACCESS_TOKEN);
                localStorage.removeItem(REFRESH_TOKEN);
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default api