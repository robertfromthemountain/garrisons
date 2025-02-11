<template>
  <section>
    <div class="d-block justify-center">
      <v-skeleton-loader
        v-if="loading"
        type="article"
        class="skeleton-loader"
      ></v-skeleton-loader>
      <div v-else>
        <h1 class="text-center text-lg-left title-garrisons bigger-title service-title-fade">
          {{ t("guestBooking.services.title") }}
        </h1>
        <div v-if="!loading && services.length > 0">
          <ul class="services-content">
            <div
              v-for="(service, index) in services"
              :key="service.id"
              :style="{ animationDelay: `${index * 0.1}s` }"
              class="service-float-animation"
            >
              <li class="text-center d-flex justify-space-between align-center">
                <v-col
                  cols="5"
                  class="text-start pa-0 ma-0 text-garrisons bigger"
                  no-gutters
                  ><span class="mdi mdi-content-cut title-garrisons"></span>
                  {{ service.title }}</v-col
                >
                <v-col
                  cols="2"
                  class="text-center pa-0 ma-0 text-garrisons bigger"
                  no-gutters
                  ><span class="mdi mdi-timer-sand title-garrisons"></span
                  >{{ service.duration }}</v-col
                >
                <v-col
                  cols="5"
                  class="text-end pa-0 ma-0 text-garrisons bigger"
                  no-gutters
                  ><span class="mdi mdi-cash-multiple title-garrisons"></span>
                  {{ service.price }} HUF</v-col
                >
              </li>
              <v-divider></v-divider>
            </div>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import apiClient from "@/utils/apiClient";
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

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

<style scoped>
.bigger {
  font-size: x-large;
}

.bigger-title {
  font-size: xx-large;
}

.skeleton-loader {
  width: 100%;
  height: auto;
  margin-bottom: 20px;
  background-color: #26211e;
}

.service-title-fade {
  opacity: 0;
  animation: fadeInTitle 0.8s forwards ease-in;
}

@keyframes fadeInTitle {
  to {
    opacity: 1;
  }
}

/* Float from left animation */
.service-float-animation {
  opacity: 0;
  /* transform: translateX(-100%); */
  animation: floatLeft 0.8s forwards ease-in;
}

@keyframes floatLeft {
  to {
    opacity: 1;
    /* transform: translateX(0); */
  }
}
</style>
