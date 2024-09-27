<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  showFirstDialog: Boolean,
  showConfirmationDialog: Boolean,
  services: Array,
  selectedService: Object, // Prop passed from parent, it's read-only
  formattedDate: String,
  formattedTime: String,
  formattedEndTime: String,
});

const emit = defineEmits([
  "update:selectedService", // For sending service change to parent
  "goToConfirmation", // For moving to confirmation dialog
  "closeDialogs", // For closing dialogs
]);

// Emit the new selected service when the user selects one
const handleSelectedServiceChange = (newService) => {
  emit("update:selectedService", newService);
};

const handleNext = () => {
  emit("goToConfirmation");
};

const closeDialog = () => {
  emit("closeDialogs");
};
</script>

<template>
  <div>
    <!-- First Dialog -->
    <v-dialog v-model="showFirstDialog" max-width="500">
      <v-card class="bg-garrisons text-garrisons">
        <v-card-title>
          <h2 class="headline title-garrisons">Select Service</h2>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <!-- Service selection using :value and @input -->
          <v-select
            :value="selectedService"
            :items="services"
            :item-value="(service) => service"
            item-text="title"
            label="Choose a Service"
            clearable
            @input="handleSelectedServiceChange"
          />
          <p v-if="selectedService">
            <strong>Service:</strong> {{ selectedService.title }}<br />
            <strong>Price:</strong> {{ selectedService.price }}<br />
            <strong>Duration:</strong>
            {{ selectedService.duration }} minutes<br />
            <strong>Date:</strong> {{ formattedDate }}<br />
            <strong>Start Time:</strong> {{ formattedTime }}<br />
            <strong>End Time:</strong> {{ formattedEndTime }}<br />
          </p>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn variant="tonal" @click="closeDialog">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn
            class="bg-green text-white"
            @click="handleNext"
            :disabled="!selectedService"
          >
            Next
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Confirmation Dialog -->
    <v-dialog v-model="showConfirmationDialog" max-width="500" persistent>
      <v-card class="bg-garrisons text-garrisons">
        <v-card-title>
          <h2 class="headline title-garrisons">Confirm Booking</h2>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <p><strong>Service:</strong> {{ selectedService.title }}</p>
          <p><strong>Price:</strong> {{ selectedService.price }}</p>
          <p>
            <strong>Duration:</strong> {{ selectedService.duration }} minutes
          </p>
          <p><strong>Date:</strong> {{ formattedDate }}</p>
          <p><strong>Start Time:</strong> {{ formattedTime }}</p>
          <p><strong>End Time:</strong> {{ formattedEndTime }}</p>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn variant="tonal" @click="closeDialog">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn class="bg-green text-white" @click="emit('finalizeBooking')"
            >Confirm</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
