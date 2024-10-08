<template>
  <section>
    <div class="d-block justify-center pa-8">
      <h1 class="text-center divider title-garrisons bigger-title">
        {{ t("guestBooking.services.title") }}
      </h1>
      <div v-if="!loading && services.length > 0">
        <ul class="services-content">
          <li
            class="bg-dark-garrisons ma-1 mb-5 text-center elevation-8 rounded-pill service-card-border d-flex justify-space-between px-5 align-center"
            v-for="service in services"
            :key="service.id"
          >
            <v-col
              cols="4"
              class="text-start pa-0 ma-0 text-garrisons bigger"
              no-gutters
              ><span class="mdi mdi-content-cut title-garrisons"></span>
              {{ service.title }}</v-col
            >
            <v-col
              cols="4"
              class="text-center pa-0 ma-0 text-garrisons bigger"
              no-gutters
              ><span class="mdi mdi-timer-sand title-garrisons"></span
              >{{ service.duration }}</v-col
            >
            <v-col cols="4" class="text-end pa-0 ma-0 text-garrisons bigger" no-gutters
              ><span class="mdi mdi-cash-multiple title-garrisons"></span>
              {{ service.price }} HUF</v-col
            >
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup>
import apiClient from "@/utils/apiClient";
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";

const {t} = useI18n();

const token = sessionStorage.getItem("accessToken");
const services = ref([]);
const loading = ref(false);

// Fetch services when the component is mounted
onMounted(async () => {
  await fetchServices();
});

// Fetch services method
const fetchServices = async () => {
  loading.value = true;
  try {
    const response = await apiClient.get("http://localhost:5000/api/services", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const allServices = response.data;

    // Filter breaks (no price) and show only for admins
    if (sessionStorage.role === "admin") {
      services.value = allServices;
    } else {
      services.value = allServices.filter((service) => service.price !== null);
    }
  } catch (error) {
    console.error("Error fetching services:", error);
  } finally {
    loading.value = false;
  }
};
</script>

<style>
.divider {
  border-bottom: 1px solid #6a4e35;
  margin-bottom: 30px;
}

.service-card-border{
  border: 1px solid #8f6a48;
}

.bigger{
  font-size: x-large;
}

.bigger-title{
  font-size: xx-large;
}
</style>