import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import apiClient from '@/utils/apiClient';
import { useToast } from 'vue-toastification';  // Import Toast

export function useLogin() {
    const { t } = useI18n();
    const router = useRouter();
    const email = ref('');
    const password = ref('');
    const isLoading = ref(false);
    const store = useStore();
    const visible = ref(false);
    const toast = useToast();  // Initialize Toast
    const showForgotPassword = ref(false);
    const forgotPasswordEmail = ref('');

    // Define validation rules
    const emailRules = [
        (value) => !!value || t("validation.emailRequired"),
        (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || t("validation.invalidEmailFormat"),
    ];

    const passwordRules = [
        (value) => !!value || t("validation.passwordRequired"),
    ];

    const loginUser = async () => {
        if (!email.value || !password.value) {
            toast.error(t("login.toasts.missingFields"));
            return;
        }

        isLoading.value = true;
        showForgotPassword.value = false; // Reset before making the request

        try {
            const response = await apiClient.post(
                "http://localhost:5000/api/auth/login",
                {
                    email: email.value,
                    password: password.value,
                },
                { withCredentials: true } // 🔹 Szükséges a refresh tokenhez
            );

            console.log("Server response:", response.data);

            // Ellenőrizzük, hogy a token és a szerepkör érkezett-e
            if (response.data.accessToken && response.data.role) {
                sessionStorage.setItem("accessToken", response.data.accessToken);
                sessionStorage.setItem("role", response.data.role);

                console.log("Received accessToken:", response.data.accessToken);
                console.log("Received role:", response.data.role);

                store.dispatch("login", { token: response.data.accessToken, role: response.data.role });
                toast.success(t("login.toasts.success"));

                // Szerepkör alapú átirányítás
                if (response.data.role === "admin") {
                    router.push("/dashboard");
                } else if (response.data.role === "user") {
                    router.push("/");
                } else {
                    router.push("/login");
                    toast.error("Unexpected role error");
                }
            } else {
                throw new Error("No accessToken or role received");
            }
        } catch (error) {
            console.error("Login failed:", error.response ? error.response.data : error.message || "No response");

            if (error.response) {
                showForgotPassword.value = true;
                switch (error.response.status) {
                    case 401:
                        toast.error(t("login.toasts.invalidCredentials"));
                        break;
                    case 603:
                        toast.error(t("login.toasts.verifyEmail"));
                        break;
                    case 604:
                        toast.error(t("login.toasts.bannedUser"));
                        break;
                    case 404:
                        toast.error(t("login.toasts.userNotFound"));
                        break;
                    case 500:
                        toast.error(t("login.toasts.serverError"));
                        break;
                    default:
                        toast.error(t("login.toasts.genericError"));
                }
            } else {
                toast.error(t("login.toasts.networkError"));
            }
        } finally {
            isLoading.value = false;
        }
    };

    // Forgot Password Function
    const forgotPassword = async () => {
        if (!forgotPasswordEmail.value) {
            toast.error(t("validation.emailRequired"));
            return;
        }

        isLoading.value = true;

        try {
            const response = await apiClient.post('http://localhost:5000/api/auth/forgot-password', {
                email: forgotPasswordEmail.value,
            });
            toast.success(t("login.toasts.passwordResetEmailSent"));
        } catch (error) {
            if (error.response) {
                // Server responded with a status code other than 2xx
                const status = error.response.status;
                const errorMessage = error.response.data;

                switch (status) {
                    case 404:
                        toast.error(t("login.toasts.userNotFound")); // User not found
                        break;
                    case 603:
                        toast.error(errorMessage); // Display the backend error message directly
                        break;
                    case 500:
                        toast.error(t("login.toasts.serverError")); // Database or server error
                        break;
                    default:
                        toast.error(t("login.toasts.unknownError")); // Generic unknown error
                }
            } else if (error.request) {
                // Request was made but no response received
                toast.error(t("login.toasts.networkError")); // Network error or server unreachable
            } else {
                // Something happened while setting up the request
                toast.error(t("login.toasts.passwordResetError"));
            }
        } finally {
            isLoading.value = false;
        }
    };

    return { email, password, emailRules, passwordRules, isLoading, loginUser, t, visible, showForgotPassword, forgotPasswordEmail, forgotPassword };
}
