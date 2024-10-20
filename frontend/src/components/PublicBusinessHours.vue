<template>
  <v-container fluid class="my-12">
    <!-- Title Section -->
    <v-row v-if="loading" class="d-flex justify-center">
      <v-skeleton-loader
        type="text"
        class="title-skeleton-loader"
      ></v-skeleton-loader>
    </v-row>

    <v-row v-else class="d-flex justify-center">
      <h2 class="services-title">{{ t("intro.businessHours") }}</h2>
    </v-row>

    <!-- Business Hours Cards Section -->
    <v-row v-if="loading" class="d-flex justify-center">
      <!-- Display skeleton loaders when loading is true -->
      <v-col
        v-for="index in 6"
        :key="index"
        cols="4"
        sm="3"
        md="2"
        lg="1"
        xl="1"
        class="d-flex justify-center mx-1"
      >
        <v-skeleton-loader
          type="paragraph"
          class="skeleton-loader"
        ></v-skeleton-loader>
      </v-col>
    </v-row>
    <!-- Display the actual business hours cards when loading is false -->
    <v-row v-else class="d-flex justify-center">
      <v-col
        v-for="(hour, index) in businessHours"
        :key="index"
        cols="4"
        sm="3"
        md="2"
        lg="1"
        xl="1"
        :class="`d-flex justify-center mx-1 fade-in-animation delay-${index}`"
      >
        <v-card variant="tonal" class="business-card pa-3">
          <div class="text-center business-title">
            {{ dayOfWeekMap[hour.daysOfWeek] }}
          </div>
          <v-divider></v-divider>
          <div class="text-center">
            <span
              class="text-red"
              v-if="hour.startTime === '00:00' && hour.endTime === '00:00'"
            >
              {{ t("footer.openingHours.closed") }}
            </span>
            <span class="text-green-lighten-1" v-else>
              {{ hour.startTime }} - {{ hour.endTime }}
            </span>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import apiClient from "@/utils/apiClient";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const businessHours = ref([]);
const toast = useToast();
const loading = ref(false);

const fetchBusinessHours = async () => {
  loading.value = true;
  try {
    const response = await apiClient.get("/api/business-hours");
    businessHours.value = response.data;
  } catch (error) {
    toast.error(t("footer.toasts.error"));
    console.error("Error fetching business hours:", error);
  } finally {
    loading.value = false;
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

<style scoped>
.business-border {
  border-right: 2px solid #8f6a48;
}

.services-title {
  font-size: xx-large;
  color: #8f6a48;
  text-shadow: 6px 6px 12px rgba(0, 0, 0, 0.8);
  text-align: center;
}

.business-card {
  background-color: #26211e; /* Matches the theme */
  color: #d3d2cd;
  border-radius: 8px;
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.6);
  padding: 0px;
  font-size: large;
  min-height: 65px;
  min-width: 110px;
  transition: transform 0.3s ease-in-out; /* Smooth transition */
  cursor: default; /* Prevent the cursor from changing */
}

/* Zoom-in effect on hover */
.business-card:hover {
  transform: scale(1.05); /* Slight zoom-in */
}

/* Optional: Additional hover shadow for more emphasis */
.business-card:hover {
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.8);
}

.text-red {
  color: #f44336; /* Red for closed days */
}

.text-green-lighten-1 {
  color: #4caf50; /* Green for open hours */
}

/* Skeleton Loader Style */
.skeleton-loader {
  width: 100%;
  height: 100px;
  background-color: #26211e;
}

.title-skeleton-loader {
  width: 11vw;
  height: 40px;
  background-color: #26211e;
}

/* Fade-in animation */
.fade-in-animation {
  opacity: 0;
  transform: translateY(-20px);
  animation: fadeIn 1s forwards;
}

/* Staggered animation for each card based on index */
.delay-0 {
  animation-delay: 0.1s;
}
.delay-1 {
  animation-delay: 0.2s;
}
.delay-2 {
  animation-delay: 0.3s;
}
.delay-3 {
  animation-delay: 0.4s;
}
.delay-4 {
  animation-delay: 0.5s;
}
.delay-5 {
  animation-delay: 0.6s;
}
.delay-6 {
  animation-delay: 0.7s;
}

@keyframes fadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
