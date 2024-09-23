<script setup>
import Calendar from "@/components/Calendar.vue";
import Services from "@/components/Services.vue";
</script>

<template>
  <div class="">
    <div class="d-flex justify-center">
      <v-col cols="12" lg="4">
        <Services></Services>
      </v-col>
      <v-col cols="12" lg="6">
        <Calendar></Calendar>
      </v-col>
    </div>
  </div>
</template>

<style>
</style>