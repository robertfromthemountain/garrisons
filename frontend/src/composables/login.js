import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import axios from 'axios';  // Import axios

export function useLogin() {
    const { t } = useI18n();
    const router = useRouter();
    const email = ref('');
    const password = ref('');
    const isLoading = ref(false);
    const store = useStore();

    const loginUser = async () => {
        isLoading.value = true;
        try {
            const response = await axios.post('http://localhost:5000/login', {
                email: email.value,
                password: password.value,
            });
            console.log('Server response:', response.data);
            if (response.data.token) {
                store.dispatch('login', response.data.token);
                alert('Login successful!');
                router.push('/');
            } else {
                throw new Error('No token received');
            }
        } catch (error) {
            console.error('Login failed:', error.response ? error.response.data : error.message || "No response");
            alert('Login failed!');
        } finally {
            isLoading.value = false;
        }
    };

    return { email, password, isLoading, loginUser, t };
}
