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
        // Check if email and password are not empty before making the request
        if (!email.value || !password.value) {
            toast.error(t("login.toasts.missingFields"));
            return;
        }

        isLoading.value = true;
        showForgotPassword.value = false; // Reset before making the request

        try {
            const response = await apiClient.post('http://localhost:5000/login', {
                email: email.value,
                password: password.value,
            });

            console.log('Server response:', response.data);

            // Check if token and role are received
            if (response.data.token && response.data.role) {

                sessionStorage.setItem('accessToken', response.data.token);
                console.log("Received token:", response.data.token);
                sessionStorage.setItem('role', response.data.role);
                console.log("Received role:", response.data.role);

                store.dispatch('login', { token: response.data.token, role: response.data.role });
                toast.success(t("login.toasts.success"));
                // Role-based redirection
                if (response.data.role === 'admin') {
                    router.push('/dashboard'); // Redirect admin to dashboard
                } else if (response.data.role === 'user') {
                    router.push('/'); // Redirect user to homepage or wherever it is now
                } else {
                    router.push('/login'); // Fallback for any unexpected roles
                    toast.error("Unexpected role error");
                }
            } else {
                throw new Error('No token or role received');
            }
        } catch (error) {
            console.error('Login failed:', error.response ? error.response.data : error.message || "No response");

            if (error.response) {
                switch (error.response.status) {
                    case 401:
                        toast.error(t("login.toasts.invalidCredentials"));
                        showForgotPassword.value = true;
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
            const response = await apiClient.post('http://localhost:5000/forgot-password', {
                email: forgotPasswordEmail.value,
            });
            toast.success(t("login.toasts.passwordResetEmailSent"));
        } catch (error) {
            toast.error(t("login.toasts.passwordResetError"));
        } finally {
            isLoading.value = false;
        }
    };

    return { email, password, emailRules, passwordRules, isLoading, loginUser, t, visible, showForgotPassword, forgotPasswordEmail, forgotPassword };
}
