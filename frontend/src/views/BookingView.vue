<script setup>
import Calendar from "@/components/Calendar.vue";
import Events from "@/components/Events.vue";
</script>

<template>
  <div class="">
    <div class="d-flex justify-center">
      <v-col cols="12" lg="4">
        <Events></Events>
      </v-col>
      <v-col cols="12" lg="6">
        <Calendar></Calendar>
      </v-col>
    </div>
  </div>
</template>

<style>
</style>