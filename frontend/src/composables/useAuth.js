import { ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';
import { useStore } from 'vuex';
import apiClient from '@/utils/apiClient';

export function useAuth() {
    const { t } = useI18n();
    const token = ref(sessionStorage.getItem('accessToken'));
    const toast = useToast();
    const isLoggedIn = ref(!!token.value);
    const router = useRouter();
    const store = useStore();

    // **🔹 Figyeljük a sessionStorage változásait**
    watchEffect(() => {
        token.value = sessionStorage.getItem('accessToken');
        isLoggedIn.value = !!token.value;
    });

    // **🔹 Kijelentkezési funkció**
    const logout = async () => {
        try {
            // **🔹 Kérés küldése a szervernek a refresh token törléséhez**
            await apiClient.post('/api/auth/logout');

            // **🔹 Tokenek eltávolítása**
            sessionStorage.removeItem('accessToken');
            sessionStorage.removeItem('role');
            store.dispatch("logout");
            
            token.value = null;
            isLoggedIn.value = false;

            // **🔹 Átirányítás a bejelentkezési oldalra**
            router.push('/login');
            toast.success(t('logout.toasts.success'));
        } catch (error) {
            console.error("Logout failed:", error);
            toast.error(t('logout.toasts.error'));
        }
    };

    return { isLoggedIn, logout };
}
