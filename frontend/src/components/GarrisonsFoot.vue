<script setup>
import { ref, onMounted } from "vue";
import apiClient from "@/utils/apiClient";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const businessHours = ref([]);
const toast = useToast();

const fetchBusinessHours = async () => {
  try {
    const response = await apiClient.get("/api/business-hours");
    businessHours.value = response.data;
  } catch (error) {
    toast.error(t("footer.toasts.error"));
    console.error("Error fetching business hours:", error);
  }
};

// Fetch business hours on mount
onMounted(fetchBusinessHours);

// Map numbers to day names
const dayOfWeekMap = {
  1: t("footer.openingHours.days.monday"),
  2: t("footer.openingHours.days.tuesday"),
  3: t("footer.openingHours.days.wednesday"),
  4: t("footer.openingHours.days.thursday"),
  5: t("footer.openingHours.days.firday"),
  6: t("footer.openingHours.days.saturday"),
  7: t("footer.openingHours.days.sunday"),
};
</script>

<template>
  <v-footer class="bg-dark-garrisons footer-elevation my-0 py-0">
    <v-container class="w-75">
      <v-row>
        <v-col cols="12" md="4" class="text-center text-md-left">
          <h2 class="subtitle-garrisons text-decoration-underline">
            {{ t("footer.important.title") }}
          </h2>
          <ul class="bg-dark-garrisons line-height-footer">
            <li class="text-garrisons line-height-item">
              <span
                >{{ t("global.owner") }} - <br />{{ t("global.shop") }}</span
              >
            </li>
            <li class="text-garrisons line-height-item">
              <span>{{ t("global.email") }}</span>
            </li>
            <li class="text-garrisons line-height-item">
              <span>{{ t("global.tel") }}</span>
            </li>
          </ul>
        </v-col>

        <v-col cols="12" md="3" class="text-center">
          <h1 class="title-garrisons text-decoration-underline">
            {{ t("footer.openingHours.title") }}
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
                {{ t("footer.openingHours.closed") }}
              </span>
              <span class="text-green-lighten-1" v-else>
                {{ hour.startTime }} - {{ hour.endTime }}
              </span>
            </li>
          </ul>
        </v-col>

        <v-col cols="12" md="4" class="text-center text-md-right"
          ><h2 class="subtitle-garrisons text-decoration-underline">{{ t("footer.socials.title") }}</h2>
          <ul class="bg-dark-garrisons line-height-footer">
            <li class="text-garrisons line-height-item">
              Facebook<span class="mdi mdi-facebook ps-1"></span>
            </li>
            <li class="text-garrisons line-height-item">
              Instagram <span class="mdi mdi-instagram"></span>
            </li>
            <li class="text-garrisons line-height-item">
              Twitter <span class="mdi mdi-twitter"></span>
            </li></ul
        ></v-col>
      </v-row>
      <v-divider class="mt-5"></v-divider>
      <v-row class="justify-center mt-3 text-caption text-white">
        <p class="text-center mt-1">
          {{ t("global.developer") }}, {{ new Date().getFullYear() }} —
          garrisons.hu, {{ t("footer.rights") }}
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
