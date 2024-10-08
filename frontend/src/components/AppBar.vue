<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import { RouterLink, useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";

const store = useStore();
const { t } = useI18n();
const router = useRouter();
const { logout } = useAuth();

const isLoggedIn = computed(() => store.getters.isLoggedIn);
const userRole = computed(() => store.getters.userRole);

const currentTheme = computed(() => store.state.theme.theme);

function toggleTheme() {
  store.commit("theme/toggleTheme");
  console.log("elkuldtem storeba");
}

// Optional: Computed property to dynamically change the icon based on the theme
const themeIcon = computed(() =>
  currentTheme.value === "light"
    ? "mdi-weather-night"
    : "mdi-white-balance-sunny"
);

const navLinks = [
  { name: t("link.home"), path: "/", requiresAuth: false },
  {
    name: t("link.booking"),
    path: "/booking",
    requiresAuth: true,
    role: "user",
  },
  {
    name: "GuestBooking",
    path: "/guestBooking",
    requiresAuth: false,
    guestOnly: true,
  },
  {
    name: t("link.references"),
    path: "/references",
    requiresAuth: false,
  },
  { name: t("link.rules"), path: "/rules", requiresAuth: false },
];

const visibleNavLinks = computed(() => {
  return navLinks.filter(
    (link) =>
      (link.requiresAuth === false || isLoggedIn.value) &&
      !(isLoggedIn.value && link.guestOnly)
  );
});

function handleLogout() {
  logout();
}
</script>

<template>
  <v-app-bar density="compact" class="nav-color">
    <nav class="align-center">
      <div class="d-flex justify-center">
        <RouterLink
          v-for="link in visibleNavLinks"
          :key="link.path"
          :to="link.path"
          custom
          v-slot="{ navigate, isActive }"
          class="clear"
          ><v-btn
            variant=""
            density="compact"
            :class="{ 'active-link': isActive }"
            class="btn-color clear"
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
            class="mx-1 sing-in-btn text-h6 text-button"
            rounded="xl"
            >{{ t("button.login") }}</v-btn
          ></RouterLink
        >
        <RouterLink v-if="!isLoggedIn" to="/register" class="clear"
          ><v-btn
            prepend-icon="mdi-account-plus"
            density="compact"
            variant="tonal"
            class="mx-1 sing-up-btn text-h6 text-button"
            rounded="xl"
            >{{ t("button.register") }}</v-btn
          ></RouterLink
        >

        <v-btn
          v-if="isLoggedIn"
          @click="handleLogout"
          prepend-icon="mdi-logout"
          density="compact"
          variant="tonal"
          class="mx-1"
          rounded="xl"
          >{{ t("button.logout") }}</v-btn
        >

        <RouterLink
          v-if="isLoggedIn && userRole === 'admin'"
          to="/dashboard"
          class="clear"
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
  </v-app-bar>
</template>

<style src="@/assets/styles/appBar.css" scoped>
</style>