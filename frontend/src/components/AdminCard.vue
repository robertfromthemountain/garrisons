<template>
  <v-row>
    <v-col cols="12" md="4">
      <v-card variant="tonal">
        <v-card-item>
          <v-card-title
            >Please confirm or deny the pending appointment
            request!</v-card-title
          >
        </v-card-item>
        <v-divider></v-divider>
        <v-card-text class="d-flex align-start">
          <v-col cols="10" class=""
            ><p class="pb-1">
              <v-icon class="me-1">mdi-content-cut</v-icon>Nagy Róbert - Fresh
              Cut
            </p>
            <v-icon class="me-1">mdi-clock-outline</v-icon>2024.10.15,
            13:15-13:45</v-col
          >
          <v-col cols="2" class="d-flex flex-column"
            ><v-btn
              density="compact"
              class="bg-green text-garrisons mb-2"
            >
              <v-icon class="pe-2">mdi-book-check-outline</v-icon
              >Accept
            </v-btn>
            <v-btn
              density="compact"
              class="bg-red-darken-1 text-garrisons"
            >
              <v-icon class="pe-2">mdi-book-cancel-outline</v-icon
              >Deny
            </v-btn></v-col
          >
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
</script>

<style scoped>
</style>