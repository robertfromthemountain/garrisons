import { createRouter, createWebHistory } from 'vue-router';
import routes from '@/router/routes'; // Importáljuk a külön fájlban lévő route-okat

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// **🔹 Navigációs őr a védett route-okhoz**
router.beforeEach(async (to, from, next) => {
  const token = sessionStorage.getItem('accessToken');
  const role = sessionStorage.getItem('role'); // 🔹 Csak sessionStorage-ból olvassuk ki a szerepkört

  // **🔹 Ha az útvonal hitelesítést igényel, és nincs token, átirányítás a bejelentkezési oldalra**
  if (to.meta.requiresAuth && !token) {
    return next({ name: 'login' });
  }

  // **🔹 Ha az útvonalhoz adott szerepkör kell, ellenőrizzük a `role` értékét**
  if (to.meta.role) {
    if (!role || (Array.isArray(to.meta.role) && !to.meta.role.includes(role)) || (to.meta.role !== role)) {
      return next({ name: 'home' }); // 🔹 Ha a felhasználó nem jogosult, visszairányítjuk a főoldalra
    }
  }

  next(); // 🔹 Ha minden feltétel teljesül, engedjük a navigációt
});

export default router;
