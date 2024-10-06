<template>
  <section class="mx-auto w-50 mt-10 intro">
    <v-row>
      <v-col cols="12" md="6" class="vertical-divider">
        <div>
          <h2 class="about-title">Rólam</h2>
          <p class="about-content">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
        </div>
      </v-col>

      <!-- Szolgáltatások Section -->
      <v-col cols="12" md="6">
        <div class="justify-end">
          <h2 class="services-title">Szolgáltatások</h2>
          <ul class="services-content">
            <li
              v-for="service in services"
              :key="service.id"
              class="d-flex"
            >
            <v-col cols="4" class="text-start pa-0 ma-0" no-gutters><span class="mdi mdi-content-cut subtitle-garrisons"></span> {{ service.title }}</v-col>
            <v-col cols="4" class="text-center pa-0 ma-0" no-gutters><span class="mdi mdi-timer-sand subtitle-garrisons"></span>{{ service.duration }}</v-col>
            <v-col cols="4" class="text-end pa-0 ma-0" no-gutters><span class="mdi mdi-cash-multiple subtitle-garrisons"></span> {{ service.price }} HUF</v-col>
            </li>
          </ul>
        </div>
      </v-col>
    </v-row>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import apiClient from "@/utils/apiClient";

// Define the services array
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
    // Fetch the services from the API without needing a token
    const response = await apiClient.get("http://localhost:5000/api/services");
    const allServices = response.data;

    // Filter out services that have no price (e.g., breaks)
    services.value = allServices.filter((service) => service.price !== null);
  } catch (error) {
    console.error("Error fetching services:", error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.about-title {
  font-size: xx-large;
  color: #6a4e35;
  text-shadow: 6px 6px 12px rgba(0, 0, 0, 0.8);
  text-align: end;
  margin-bottom: 20px;
}

.about-content {
  text-align: end;
  color: #d3d2cd;
  font-size: x-large;
  text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.8);
}

.vertical-divider {
  border-right: 3px solid #8f6a48;
}

.services-title {
  font-size: xx-large;
  color: #6a4e35;
  text-shadow: 6px 6px 12px rgba(0, 0, 0, 0.8);
  text-align: start;
  margin-bottom: 20px;
}

.services-content {
  font-size: larger;
  color: #d3d2cd;
  text-align: start;
  text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.8);
}
</style>