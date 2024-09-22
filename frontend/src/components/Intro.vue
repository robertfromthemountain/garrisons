<script setup>
import { ref } from "vue";

const services = ref([
  { name: "Fresh Cut", price: 3500 },
  { name: "Apa + Fia Hajvágás", price: 6500 },
  { name: "Szakálligazítás", price: 2500 },
  { name: "Full Cut", price: 4200 },
  { name: "Hajfestés", price: 7500 },
]);
</script>

<template>
  <section fluid class="mx-auto w-50 mt-10 intro">
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
        </div></v-col
      >
      <!-- Szolgáltatások Section -->
      <v-col cols="12" md="6">
        <div class="justify-end">
          <h2 class="services-title">Szolgáltatások</h2>
          <ul class="services-content">
            <li
              v-for="service in services"
              :key="service.name"
              class="d-flex justify-space-between"
            >
              <span>{{ service.name }}</span>
              <span>{{ service.price }} FT</span>
            </li>
          </ul>
        </div>
      </v-col>
    </v-row>
</section>
</template>

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
  font-size: x-large;
  color: #d3d2cd;
  text-align: start;
  text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.8);
}
</style>
