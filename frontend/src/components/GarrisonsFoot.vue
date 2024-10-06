<script setup>
import { ref, onMounted } from "vue";
import apiClient from "@/utils/apiClient";
import { useToast } from "vue-toastification";

const businessHours = ref([]);
const toast = useToast();

const fetchBusinessHours = async () => {
  try {
    const response = await apiClient.get("/api/business-hours");
    businessHours.value = response.data;
  } catch (error) {
    toast.error("Error fetching business hours.");
    console.error("Error fetching business hours:", error);
  }
};

// Fetch business hours on mount
onMounted(fetchBusinessHours);

// Map numbers to day names
const dayOfWeekMap = {
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
  7: "Sunday",
};
</script>

<template>
  <v-footer class="bg-dark-garrisons footer-elevation my-0 py-0">
    <v-container class="w-75">
      <v-row>
        <!-- Left side for Business Hours -->
   

      

        <!-- Right side for Links -->
        <v-col cols="5" class="text-left">
          <h2 class="subtitle-garrisons text-decoration-underline">Important</h2>
          <ul class="bg-dark-garrisons line-height-footer">
            <li class="text-garrisons line-height-item">
              <span>Bíró Dominik, E.V. - <br> Garrisons Haircraft & Barbershop</span>
            </li>
            <li class="text-garrisons line-height-item">
              <span>info@garrisons.hu</span>
            </li>
            <li class="text-garrisons line-height-item">
              <span>06 (30) 512 3213</span>
            </li>
          </ul>
        </v-col>

        <v-col cols="2" class="text-center">
          <h1 class="title-garrisons text-decoration-underline">
            Opening Hours
          </h1>
          <ul class="bg-dark-garrisons line-height-footer">
            <li
              v-for="(hour, index) in businessHours"
              :key="index"
              class="text-garrisons line-height-item"
            >
              {{ dayOfWeekMap[hour.daysOfWeek] }}:
              <span
                class="text-red"
                v-if="hour.startTime === '00:00' && hour.endTime === '00:00'"
              >
                CLOSED
              </span>
              <span class="text-green-lighten-1" v-else>
                {{ hour.startTime }} - {{ hour.endTime }}
              </span>
            </li>
          </ul>
        </v-col>

        <v-col cols="5" class="text-right"
          ><h2 class="subtitle-garrisons text-decoration-underline">Socials</h2>
          <ul class="bg-dark-garrisons line-height-footer">
            <li class="text-garrisons line-height-item">
             Facebook<span class="mdi mdi-facebook ps-1"></span>
            </li>
            <li class="text-garrisons line-height-item">
              Instagram <span class="mdi mdi-instagram"></span>
            </li>
            <li class="text-garrisons line-height-item">
              Twitter <span class="mdi mdi-twitter"></span>
            </li>
          </ul></v-col
        >
      </v-row>
      <v-divider class="mt-5"></v-divider>
      <v-row class="justify-center mt-3 text-caption text-white">
        <p class="text-center mt-1">
          Nagy Róbert, {{ new Date().getFullYear() }} — garrisons.hu, All rights
          reserved.
        </p>
      </v-row>
    </v-container>
  </v-footer>
</template>

<style scoped>
.footer-elevation {
  box-shadow: 0px -8px 10px rgba(0, 0, 0, 0.1);
  border-top: 2px solid #6a4e35;
}

.line-height-footer {
  min-height: auto !important;
  list-style-type: none;
}

.line-height-item {
  line-height: 1.5; /* Adjust line height as needed */
  font-size: large;
  text-decoration: none;
}
</style>
