<script setup>
import AppBar from "@/components/AppBar.vue";
import GarrisonsFoot from "@/components/GarrisonsFoot.vue";
import { computed } from 'vue';
import { watchEffect } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const currentTheme = computed(() => store.getters['theme/currentTheme']);

watchEffect(() => {
  console.log("Current theme has changed to:", currentTheme.value);
});
</script>

<template>
  <main>
    <header>
      <AppBar></AppBar>
    </header>
    <div class="container">
      <RouterView />
    </div>
  </main>
</template>

<style scoped>
.container {
  margin-left: 100px;
  margin-right: 100px;
}
</style>
