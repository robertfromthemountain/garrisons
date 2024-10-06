<script setup>
import AppBar from "@/components/AppBar.vue";
import GarrisonsFoot from "@/components/GarrisonsFoot.vue";
import { computed } from "vue";
import { watchEffect } from "vue";
import { useStore } from "vuex";
import axios from "axios";

const store = useStore();
const currentTheme = computed(() => store.getters["theme/currentTheme"]);

async function validateUserRole() {
  const token = sessionStorage.getItem("accessToken");

  if (token) {
    try {
      const response = await axios.get("http://localhost:5000/verify-token", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const verifiedRole = response.data.role;

      // Set the validated role in Vuex
      store.commit("setRole", verifiedRole);
    } catch (error) {
      console.error("Failed to validate role:", error);
      store.commit("clearRole");
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("role");
    }
  }
}

watchEffect(() => {
  console.log("Current theme has changed to:", currentTheme.value);
});

validateUserRole();
</script>

<template>
  <v-app class="bg-garrisons">
    <header>
      <AppBar></AppBar>
    </header>
    <v-main style="min-height: 80vh;">
      <RouterView />
    </v-main>
    <footer>
      <GarrisonsFoot></GarrisonsFoot>
    </footer>
  </v-app>
</template>

<style src="@/assets/styles/main.css">
</style>
