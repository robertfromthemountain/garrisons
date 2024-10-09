<template>
  <v-app>
    <v-navigation-drawer app>
      <v-list>
        <v-list-item class="list-title-dashboard">
          <v-icon left>mdi-view-dashboard-outline</v-icon>Admin Dashboard
        </v-list-item>
        <v-divider></v-divider>

        <!-- Admin-only links -->
        <v-list-item
          v-if="isLoggedIn && userRole === 'admin'"
          class="list-item-custom"
          :to="{ name: 'dashboard-events' }"
        >
          <v-icon left>mdi-calendar-check</v-icon>
          {{ t("dashboard.manageEvents.title") }}
        </v-list-item>

        <v-list-item
          v-if="isLoggedIn && userRole === 'admin'"
          class="list-item-custom"
          :to="{ name: 'dashboard-pendings' }"
        >
          <v-icon left>mdi-calendar-alert</v-icon>
          Pending Events
        </v-list-item>

        <v-list-item
          v-if="isLoggedIn && userRole === 'admin'"
          class="list-item-custom"
          :to="{ name: 'dashboard-services' }"
        >
          <v-icon left>mdi-content-cut</v-icon>
          Services
        </v-list-item>

        <v-list-item
          v-if="isLoggedIn && userRole === 'admin'"
          class="list-item-custom"
          :to="{ name: 'dashboard-businessHours' }"
        >
          <v-icon left>mdi-calendar-clock-outline</v-icon>
          Business Hours
        </v-list-item>

        <v-list-item
          v-if="isLoggedIn && userRole === 'admin'"
          class="list-item-custom"
          :to="{ name: 'dashboard-users' }"
        >
          <v-icon left>mdi-account-group</v-icon>
          Users
        </v-list-item>

        <v-list-item
          v-if="isLoggedIn && userRole === 'admin'"
          class="list-item-custom"
          :to="{ name: 'dashboard-managePictures' }"
        >
          <v-icon left>mdi-account-group</v-icon>
          Manage Pictures
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main class="bg-garrisons">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

// Computed properties for checking login and user role from sessionStorage
const isLoggedIn = computed(() => !!sessionStorage.getItem("accessToken"));
const userRole = computed(() => sessionStorage.getItem("role"));

// Lifecycle hook for redirection logic
onMounted(() => {
  // Redirect only if the user is not already on a dashboard child route
  if (route.name !== "dashboard-events" && userRole.value === "admin") {
    router.push("/dashboard/manageEvents");
  }
});
</script>

<style scoped>
.v-navigation-drawer {
  background-color: #201b18;
  border-right: 2px solid #6a4e35;
}

.list-title-dashboard {
  font-size: 1.2rem;
  font-weight: 500;
  color: #6a4e35;
  padding-left: 16px;
}

.list-item-custom {
  font-size: 1.2rem;
  font-weight: 300;
  color: #d3d2cd;
  padding-left: 16px;
}

.list-item-custom:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
