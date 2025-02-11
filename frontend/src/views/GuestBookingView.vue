<script setup>
import Services from "@/components/Services.vue";
import GuestCalendar from "@/components/GuestCalendar.vue";
import { useDisplay } from "vuetify";
import { useI18n } from "vue-i18n";

const {t}=useI18n();
const { smAndDown } = useDisplay();
</script>

<template>
  <div class="">
   <div>
    <h1 class="text-center title-garrisons"> {{ t("guestBooking.title") }}</h1>
    <p class="text-center subtitle-garrisons">
      {{ t("guestBooking.subtitle") }}
    </p>
    <v-divider></v-divider>
   </div>
    <div class="d-lg-flex">
      <v-col cols="12" lg="4">
        <Services></Services>
      </v-col>
      <v-col cols="12" lg="8" class="pa-5">
        <GuestCalendar></GuestCalendar>
      </v-col>
    </div>
  </div>
</template>

<style>
</style>