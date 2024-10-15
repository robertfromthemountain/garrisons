<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import { RouterLink, useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import { useDisplay } from "vuetify";

const { lgAndUp, mdAndDown } = useDisplay();
const store = useStore();
const { t } = useI18n();
const router = useRouter();
const { logout } = useAuth();

const isLoggedIn = computed(() => store.getters.isLoggedIn);
const userRole = computed(() => store.getters.userRole);
const drawer = ref(null);

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

// Additional admin links for admin role
const adminLinks = [
  {
    name: "Events",
    path: "/dashboard/manageEvents",
    icon: "mdi-calendar-check",
  },
  {
    name: "Pending Events",
    path: "/dashboard/pendingEvents",
    icon: "mdi-calendar-alert",
  },
  {
    name: "Services",
    path: "/dashboard/manageServices",
    icon: "mdi-content-cut",
  },
  {
    name: "Business H.",
    path: "/dashboard/businessHours",
    icon: "mdi-calendar-clock-outline",
  },
  {
    name: "users",
    path: "/dashboard/manageUsers",
    icon: "mdi-account-group",
  },
  {
    name: "Pics",
    path: "/dashboard/managePictures",
    icon: "mdi-camera-plus-outline",
  },
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
  <section>
    <v-app-bar v-if="lgAndUp" density="compact" class="nav-color">
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

    <!-- Hamburger icon visible on small screens -->
    <v-app-bar v-if="mdAndDown" density="compact" class="nav-color">
      <v-btn icon @click.stop="drawer = !drawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Drawer component -->
    <v-navigation-drawer v-if="mdAndDown" v-model="drawer" temporary>
      <!-- General Links for all users -->
      <v-list>
        <RouterLink
          v-for="link in visibleNavLinks"
          :key="link.path"
          :to="link.path"
          custom
          v-slot="{ navigate }"
        >
          <v-list-item @click="navigate">
            <v-list-item-title
              ><span class="text-garrisons">{{
                link.name
              }}</span></v-list-item-title
            >
          </v-list-item>
        </RouterLink>

        <!-- Admin Links (shown only for admins) -->
        <template v-if="userRole === 'admin'">
          <v-divider></v-divider>
          <RouterLink
            v-for="link in adminLinks"
            :key="link.path"
            :to="link.path"
            custom
            v-slot="{ navigate }"
          >
            <v-list-item @click="navigate">
              <v-list-item-title
                ><v-icon class="me-1 text-garrisons-2">{{ link.icon }}</v-icon
                ><span class="text-garrisons">{{
                  link.name
                }}</span></v-list-item-title
              >
            </v-list-item>
          </RouterLink>
        </template>
      </v-list>

      <v-divider></v-divider>

      <!-- Logout Button -->
      <v-list-item @click="handleLogout" v-if="isLoggedIn">
        <v-list-item-title>{{ t("button.logout") }}</v-list-item-title>
      </v-list-item>
    </v-navigation-drawer>
  </section>
</template>

<style src="@/assets/styles/appBar.css" scoped>
</style>