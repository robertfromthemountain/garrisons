<script setup>
const links = ["Home", "About Us", "Team", "Services", "Blog", "Contact Us"];
</script>

<template>
  <v-footer class="bg-dark-garrisons footer-elevation d-flex flex-column align-center my-0 py-0">
    <div>
      <!-- Row for the links -->
      <v-row justify="center" no-gutters class="footer-divider">
        <v-btn
          v-for="link in links"
          :key="link"
          class="mx-2"
          color="white"
          rounded="xl"
          variant="text"
        >
          {{ link }}
        </v-btn>
      </v-row>
      <!-- Row for the text -->
      <v-row justify="center" no-gutters class="font-weight-thin text-caption">
        <p class="text-center">
          Nagy Róbert, {{ new Date().getFullYear() }} — garrisons.hu, All
          rights reserved.
        </p>
      </v-row>
    </div>
  </v-footer>
</template>

<style scoped>
.footer-elevation {
  box-shadow: 0px -8px 10px rgba(0, 0, 0, 0.1);
  border-top: 2px solid #6a4e35;
}
.footer-divider{
  border-bottom: 1px solid rgba(211, 210, 205, 0.1);
}
</style>
