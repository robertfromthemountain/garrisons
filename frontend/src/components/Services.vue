<template>
  <section>
    <div
      class="d-block justify-center pa-8 elevation-5 rounded bg-dark-garrisons"
    >
      <h1 class="text-center divider text-garrisons font-weight-medium">
        Szolgaltatasok
      </h1>
      <div
        v-for="service in services"
        :key="service.id"
        class="btn-garrisons ma-1 mb-5 text-center elevation-5 rounded-pill d-flex justify-space-between px-5 align-center"
      >
        <h2 class="text-garrisons font-weight-regular">{{ service.title }}</h2>
        <h3 class="text-garrisons font-weight-light">{{ service.duration }} minutes</h3>
        <h3 class="text-garrisons font-weight-regular">{{ service.price }} HUF</h3>
      </div>
    </div>
  </section>
</template>

<script>
import apiClient from '@/utils/apiClient';

export default {
  data() {
    return {
      services: [],
    };
  },
  mounted() {
    this.fetchEvents();
  },
  methods: {
    async fetchEvents() {
      try {
        const response = await apiClient.get("http://localhost:5000/api/services");
        this.services = response.data; // Set fetched events
        console.log(this.services[0].title);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    },
  },
};
</script>

<style>
.divider {
  border-bottom: 1px solid #d3d2cd;
  margin-bottom: 30px;
}
</style>