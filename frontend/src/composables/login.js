import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import axios from 'axios';
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
        try {
            const response = await axios.post('http://localhost:5000/login', {
                email: email.value,
                password: password.value,
            });

            console.log('Server response:', response.data);

            // Check if token is received
            if (response.data.token) {
                store.dispatch('login', response.data.token);
                toast.success(t("login.toasts.success"));
                router.push('/');
            } else {
                throw new Error('No token received');
            }
        } catch (error) {
            console.error('Login failed:', error.response ? error.response.data : error.message || "No response");

            if (error.response) {
                switch (error.response.status) {
                    case 401:
                        toast.error(t("login.toasts.invalidCredentials"));
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

    return { email, password, emailRules, passwordRules, isLoading, loginUser, t, visible };
}