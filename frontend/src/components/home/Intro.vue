<template>
  <section class="mx-auto my-12 intro-section">
    <v-row>
      <!-- Intro Section -->
      <v-col cols="12" lg="6" class="vertical-divider">
        <div>
          <v-skeleton-loader
            v-if="loading"
            type="article"
            class="skeleton-loader"
          ></v-skeleton-loader>
          <div v-else class="float-right-animation">
            <h2 class="about-title">{{ t("intro.about") }}</h2>
            <p class="about-content">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
        </div>
      </v-col>

      <!-- Services Section -->
      <v-col cols="12" lg="6">
        <div class="justify-end">
          <v-skeleton-loader
            v-if="loading"
            type="article"
            class="skeleton-loader"
          ></v-skeleton-loader>
          <div v-else class="float-left-animation">
            <h2 class="services-title text-center text-lg-left">
              {{ t("intro.services") }}
            </h2>
            <ul class="services-content">
              <div v-for="service in filteredServices" :key="service.id">
                <li class="d-flex">
                  <v-col cols="4" class="text-start pa-0 ma-0" no-gutters>
                    <span class="mdi mdi-content-cut subtitle-garrisons"></span>
                    {{ service.title }}
                  </v-col>
                  <v-col cols="4" class="text-center pa-0 ma-0" no-gutters>
                    <span class="mdi mdi-timer-sand subtitle-garrisons"></span>
                    {{ service.duration }}
                  </v-col>
                  <v-col cols="4" class="text-end pa-0 ma-0" no-gutters>
                    <span
                      class="mdi mdi-cash-multiple subtitle-garrisons"
                    ></span>
                    {{ service.price }} HUF
                  </v-col>
                </li>
                <v-divider></v-divider>
              </div>
            </ul>
          </div>
        </div>
      </v-col>
    </v-row>
  </section>
</template>


<script setup>
import { ref, onMounted } from "vue";
import apiClient from "@/utils/apiClient";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
// Define the services array
const filteredServices = ref([]);
const loading = ref(false);


// Fetch services method
const fetchServices = async () => {
  loading.value = true;
  try {
    // Fetch the services from the API without needing a token
    const response = await apiClient.get("http://localhost:5000/api/services");
    const unfilteredServices = response.data;
    
    // Filter out services that have no price (e.g., breaks)
    filteredServices.value = unfilteredServices.filter(
      (service) => service.price !== null
    );
  } catch (error) {
    console.error("Error fetching services:", error);
  } finally {
    loading.value = false;
  }
};

// Fetch services when the component is mounted
onMounted(() => {
  fetchServices();
});
</script>

<style scoped>
/* Apply w-100 (full width) on small screens and w-50 on md and above */
.intro-section {
  width: 100%; /* Full width on mobile */
  padding-left: 5%;
  padding-right: 5%;
  /* min-height: 35vh; */
}

/* On medium screens and above (md, lg, xl), apply w-50 */
@media (min-width: 960px) {
  .intro-section {
    width: 80%; /* 50% width for md and above */
  }
}

.about-title {
  font-size: xx-large;
  color: #8f6a48;
  text-shadow: 6px 6px 12px rgba(0, 0, 0, 0.8);
  text-align: end;
  margin-bottom: 20px;
}

.about-content {
  text-align: end;
  color: #d3d2cd;
  font-size: x-large;
  line-height: 1.4;
  text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.8);
}

.vertical-divider {
  border-right: 3px solid #8f6a48;
}

.services-title {
  font-size: xx-large;
  color: #8f6a48;
  text-shadow: 6px 6px 12px rgba(0, 0, 0, 0.8);
  text-align: start;
  margin-bottom: 20px;
}

.services-content {
  font-size: x-large;
  line-height: 1.3;
  color: #d3d2cd;
  text-align: start;
  text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.8);
}

.skeleton-loader {
  width: 100%;
  height: 300px;
  margin-bottom: 20px;
  background-color: #26211e;
}

/* Parent containers need to have overflow hidden to prevent content visibility outside */
.vertical-divider,
.justify-end {
  overflow: hidden; /* Hide content that moves outside the container */
}

/* Animation for floating from the left */
.float-left-animation {
  opacity: 0;
  transform: translateX(-100%);
  animation: float-left 1s forwards;
}

@keyframes float-left {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Animation for floating from the right */
.float-right-animation {
  opacity: 0;
  transform: translateX(100%);
  animation: float-right 1s forwards;
}

@keyframes float-right {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>