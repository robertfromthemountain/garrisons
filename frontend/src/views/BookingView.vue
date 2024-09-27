<script setup>
import Services from "@/components/Services.vue";
import UserCalendar from "@/components/UserCalendar.vue";
</script>

<template>
  <div class="py-12 bg-garrisons">
    <div class="d-flex justify-center">
      <v-col cols="12" lg="4">
        <Services></Services>
      </v-col>
      <v-col cols="12" lg="5">
        <UserCalendar></UserCalendar>
      </v-col>
    </div>
  </div>
</template>

<style>
</style>