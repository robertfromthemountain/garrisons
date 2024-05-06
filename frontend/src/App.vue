<script setup>
import AppBar from "@/components/AppBar.vue";
import GarrisonsFoot from "@/components/GarrisonsFoot.vue";
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
