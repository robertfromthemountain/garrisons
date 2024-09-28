<template>
  <v-app>
    <v-navigation-drawer app>
      <v-list>
        <v-list-item class="title-garrisons" :title="t('dashboard.title')" />
        <v-divider></v-divider>

        <!-- Admin-only links -->
        <v-list-item
          v-if="isLoggedIn && userRole === 'admin'"
          :title="t('dashboard.manageEvents.title')"
          :to="{ name: 'dashboard-events' }"
        ></v-list-item>
        <v-list-item
          v-if="isLoggedIn && userRole === 'admin'"
          title="Pending Events"
          :to="{ name: 'dashboard-pendings' }"
        ></v-list-item>
        <v-list-item
          v-if="isLoggedIn && userRole === 'admin'"
          title="Services"
          :to="{ name: 'dashboard-services' }"
        ></v-list-item>
        <v-list-item
          v-if="isLoggedIn && userRole === 'admin'"
          title="Users"
          :to="{ name: 'dashboard-users' }"
        ></v-list-item>
        <v-list-item
          v-if="isLoggedIn && userRole === 'admin'"
          title="Modified Events"
          :to="{ name: 'dashboard-modified' }"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- The main content where your child routes will be displayed -->
    <v-main class="bg-garrisons">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { computed, onMounted } from "vue"; // Import onMounted for lifecycle hook
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router"; // Import router and route

// Setup composition API functions
const { t } = useI18n();
const store = useStore();
const router = useRouter(); // Router instance
const route = useRoute(); // Current route

// Computed properties for checking login and user role
const isLoggedIn = computed(() => store.getters.isLoggedIn);
const userRole = computed(() => store.getters.userRole);

// Lifecycle hook for redirection logic
onMounted(() => {
  // Redirect only if the user is not already on a dashboard child route
  if (route.name !== "dashboard-events") {
    router.push("/dashboard/manageEvents");
  }
});
</script>

<style scoped>
.v-navigation-drawer {
  background-color: #201b18;
  border-right: 4px solid #6a4e35;
}
</style>
