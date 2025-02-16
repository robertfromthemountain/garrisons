import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();

const apiClient = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true, // 🔹 Engedélyezi a cookie-k küldését
});

// **✅ Axios Response Interceptor**
apiClient.interceptors.response.use(
    response => {
        console.log("✅ API response received:", response);
        return response;
    },
    async error => {
        console.log("❌ API request error:", error);

        const originalRequest = error.config;

        // **🔹 Ha a válasz 403 Forbidden és még nem próbálkoztunk újratöltéssel**
        if (error.response?.status === 403 && !originalRequest._retry) {
            console.warn("🔄 Token expired, attempting to refresh token...");
            originalRequest._retry = true;

            try {
                // **🔹 Küldünk egy kérést a refresh token endpoint-ra**
                console.log("🟡 Sending refresh token request to /api/auth/refresh-token...");
                const response = await axios.post(
                    "http://localhost:5000/api/auth/refresh-token",
                    {},
                    { withCredentials: true } // **Szükséges a cookie-k küldéséhez**
                );

                console.log("✅ Refresh token request successful:", response.data);

                const newAccessToken = response.data.accessToken;
                console.log("🟢 New access token received:", newAccessToken);

                // **🔹 Új access token elmentése**
                sessionStorage.setItem("accessToken", newAccessToken);

                // **🔹 Az eredeti kérés frissítése az új access tokennel**
                originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

                console.log("🔄 Retrying the failed request with the new access token...");
                return apiClient(originalRequest); // **🔹 Újraküldjük az eredeti kérést**
            } catch (err) {
                console.error("❌ Refresh token request failed:", err);

                console.warn("🚨 Logging out user due to failed token refresh...");
                sessionStorage.removeItem("accessToken");
                sessionStorage.removeItem("role");

                router.push("/login");

                return Promise.reject(err);
            }
        }

        console.warn("❌ Request failed without token expiration, rejecting...");
        return Promise.reject(error);
    }
);

export default apiClient;
