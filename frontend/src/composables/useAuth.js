import { ref } from 'vue';
import router from '@/router';

const token = ref(sessionStorage.getItem('token'));

export function useAuth() {
    const isLoggedIn = ref(!!token.value);

    const logout = () => {
        sessionStorage.removeItem('token');
        localStorage.removeItem('token');
        token.value = null;
        isLoggedIn.value = false;
        router.push('/login');
    };

    return { isLoggedIn, logout };
}
