<script setup>
import AppBar from "@/components/AppBar.vue";
import GarrisonsFoot from "@/components/GarrisonsFoot.vue";
import { computed } from "vue";
import { watchEffect } from "vue";
import { useStore } from "vuex";

const store = useStore();
const currentTheme = computed(() => store.getters["theme/currentTheme"]);

watchEffect(() => {
  console.log("Current theme has changed to:", currentTheme.value);
});
</script>

<template>
  <v-app class="bg-garrisons">
    <header>
      <AppBar></AppBar>
    </header>
    <v-main>
      <RouterView />
    </v-main>
    <footer>
      <GarrisonsFoot></GarrisonsFoot>
    </footer>
  </v-app>
</template>

<style src="@/assets/styles/main.css">
</style>
