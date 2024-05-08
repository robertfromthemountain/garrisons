<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import { RouterLink, useRouter } from "vue-router";

const store = useStore();
const { t } = useI18n();
const router = useRouter();

const isLoggedIn = computed(() => store.getters.isLoggedIn);

const currentTheme = computed(() => store.state.theme.theme);
console.log(currentTheme);

function toggleTheme() {
  store.commit("theme/toggleTheme");
}

// Optional: Computed property to dynamically change the icon based on the theme
const themeIcon = computed(() =>
  currentTheme.value === 'light' ? 'mdi-weather-night' : 'mdi-white-balance-sunny'
);


const navLinks = [
  { name: t("link.home"), path: "/", requiresAuth: false },
  { name: t("link.booking"), path: "/booking", requiresAuth: true },
  {
    name: t("link.references"),
    path: "/references",
    requiresAuth: false,
  },
  { name: t("link.rules"), path: "/rules", requiresAuth: false },
];

const visibleNavLinks = computed(() => {
  return navLinks.filter(
    (link) => link.requiresAuth === false || isLoggedIn.value
  );
});

function handleLogout() {
  store.dispatch("logout");
  router.push("/login");
}
</script>

<template>
  <v-toolbar :elevation="8" density="compact" class="position-relative">
    <nav>
      <div class="d-flex justify-center">
        <v-btn
          density="compact"
          class="mx-1"
          rounded="xl"
          icon
          @click="toggleTheme"
        >
          <v-icon>{{ themeIcon }}</v-icon>
        </v-btn>
        <RouterLink
          v-for="link in visibleNavLinks"
          :key="link.path"
          :to="link.path"
          custom
          v-slot="{ navigate, isActive }"
          class="clear"
          ><v-btn
            variant="text"
            density="compact"
            :class="{ 'active-link': isActive }"
            @click="navigate"
            >{{ link.name }}</v-btn
          ></RouterLink
        >
      </div>
      <div class="nav-buttons">
        <RouterLink v-if="!isLoggedIn" to="/login" class="clear"
          ><v-btn
            prepend-icon="mdi-login"
            density="compact"
            variant="tonal"
            class="mx-1"
            rounded="xl"
            >{{ t("button.login") }}</v-btn
          ></RouterLink
        >
        <RouterLink v-if="!isLoggedIn" to="/register" class="clear"
          ><v-btn
            prepend-icon="mdi-account-plus"
            density="compact"
            variant="tonal"
            class="mx-1"
            rounded="xl"
            >{{ t("button.register") }}</v-btn
          ></RouterLink
        >
        <RouterLink
          v-if="isLoggedIn"
          @click="handleLogout"
          to="/logout"
          class="clear"
          ><v-btn
            prepend-icon="mdi-logout"
            density="compact"
            variant="tonal"
            class="mx-1"
            rounded="xl"
            >{{ t("button.logout") }}</v-btn
          ></RouterLink
        >
        <RouterLink v-if="isLoggedIn" to="/dashboard" class="clear"
          ><v-btn
            prepend-icon="mdi-view-dashboard-edit-outline"
            density="compact"
            variant="tonal"
            class="mx-1"
            rounded="xl"
            >{{ t("button.dashboard") }}</v-btn
          ></RouterLink
        >
      </div>
    </nav>
  </v-toolbar>
</template>

<style src="@/assets/styles/appBar.css" scoped>
</style>