<script setup>
import { RouterLink } from "vue-router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const navLinks = [
  { name: t("link.home"), path: "/" },
  { name: t("link.booking"), path: "/booking" },
  { name: t("link.references"), path: "/references" },
  { name: t("link.rules"), path: "/rules" },
];

const navButtons = [
  { name: t("button.login"), path: "/login", icon: "mdi-login" },
  { name: t("button.register"), path: "/register", icon: "mdi-account-plus" },
  {
    name: t("button.dashboard"),
    path: "/dashboard",
    icon: "mdi-view-dashboard-edit-outline",
  },
];
</script>

<template>
  <v-toolbar :elevation="8" density="compact" class="position-relative">
    <nav>
      <div class="d-flex justify-center">
        <RouterLink
          v-for="navLink in navLinks"
          :key="navLink.path"
          :to="navLink.path"
          custom
          v-slot="{ navigate, isActive }"
          class="clear"
          ><v-btn
            variant="text"
            density="compact"
            :class="{ 'active-link': isActive }"
            @click="navigate"
            >{{ navLink.name }}</v-btn
          ></RouterLink
        >
      </div>
      <div class="nav-buttons">
        <RouterLink
          v-for="navButton in navButtons"
          :key="navButton.path"
          :to="navButton.path"
          class="clear"
          ><v-btn
            :prepend-icon="navButton.icon"
            density="compact"
            variant="tonal"
            class="mx-1"
            rounded="xl"
            >{{ navButton.name }}</v-btn
          ></RouterLink
        >
        
      </div>
    </nav>
  </v-toolbar>
</template>

<style src="@/assets/styles/appBar.css" scoped>
</style>