<template>
  <section>
    <div
      class="d-block justify-center pa-8 elevation-5 rounded bg-dark-garrisons"
    >
      <h1 class="text-center divider text-garrisons font-weight-medium">
        Szolgaltatasok
      </h1>
      <div v-if="!loading && services.length > 0">
        <div
          v-for="service in services"
          :key="service.id"
          class="btn-garrisons ma-1 mb-5 text-center elevation-5 rounded-pill d-flex justify-space-between px-5 align-center"
        >
          <h2 class="text-garrisons font-weight-regular">
            {{ service.title }}
          </h2>
          <h3 class="text-garrisons font-weight-regular">
            {{ service.duration + " minutes, " + service.price }} HUF
          </h3>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import apiClient from "@/utils/apiClient";
import { ref, onMounted } from "vue";

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
  border-bottom: 1px solid #d3d2cd;
  margin-bottom: 30px;
}
</style>