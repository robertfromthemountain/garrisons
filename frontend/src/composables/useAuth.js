import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';
import { useStore } from 'vuex';


export function useAuth() {
    const { t } = useI18n();
    const token = ref(sessionStorage.getItem('accessToken'));
    const toast = useToast();
    const isLoggedIn = ref(!!token.value);
    const router = useRouter();
    const store = useStore();

    const logout = () => {
        sessionStorage.removeItem('accessToken');
        localStorage.removeItem('accessToken');
        sessionStorage.removeItem('role');
        localStorage.removeItem('role');
        store.dispatch("logout")
        token.value = null;
        router.push('/login');
        toast.success(t('logout.toasts.success'));
    };

    return { isLoggedIn, logout };
}
