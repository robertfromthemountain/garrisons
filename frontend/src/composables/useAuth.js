import { ref } from 'vue';
import router from '@/router';

const token = ref(localStorage.getItem('token'));

export function useAuth() {
    const isLoggedIn = ref(!!token.value);

    const logout = () => {
        localStorage.removeItem('token');
        token.value = null;
        isLoggedIn.value = false;
        router.push('/login');
    };

    return { isLoggedIn, logout };
}
