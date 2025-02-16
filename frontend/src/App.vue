<script setup>
import AppBar from "@/components/AppBar.vue";
import GarrisonsFoot from "@/components/GarrisonsFoot.vue";
import { ref, computed, watchEffect, onMounted } from "vue";
import apiClient from "@/utils/apiClient"; // 🔹 Axios interceptor használata

const isAuthenticated = ref(false);
const userRole = ref("guest");

// **🔹 Ellenőrizzük az access token érvényességét és a szerepkört**
</script>

<template>
  <v-app class="bg-garrisons">
    <header>
      <AppBar></AppBar>
    </header>
    <v-main style="min-height: 80vh">
      <RouterView />
    </v-main>
    <footer>
      <GarrisonsFoot></GarrisonsFoot>
    </footer>
  </v-app>
</template>

<style src="@/assets/styles/main.css"></style>
