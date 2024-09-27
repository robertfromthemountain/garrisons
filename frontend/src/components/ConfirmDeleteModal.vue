<template>
  <!-- Use v-model:visible to control the dialog visibility -->
  <v-dialog
    :model-value="isOpen"
    max-width="600"
    @update:modelValue="closeModal"
    persistent
  >
    <v-card class="bg-garrisons text-garrisons">
      <v-card-title
        ><h2 class="headline title-garrisons">
          Deny Reservation
        </h2></v-card-title
      >
      <v-divider></v-divider>
      <v-card-text>
        <h3>Are you sure you want to deny this reservation?</h3>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn @click="cancel"> Cancel </v-btn>
        <v-spacer></v-spacer>
        <v-btn class="bg-red-lighten-1 text-garrisons" @click="confirm"> Confirm </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
  
  <script setup>
import { defineEmits, defineProps } from "vue";

// Props to control the modal visibility and selected event ID
const props = defineProps({
  isOpen: Boolean, // Modal visibility
  selectedEventId: Number, // The event ID selected for deletion
});

// Emits for communicating with the parent component
const emit = defineEmits(["cancel", "confirm", "update:isOpen"]);

// Method to emit cancel event
const cancel = () => {
  emit("cancel");
  emit("update:isOpen", false); // Emit to close modal
};

// Method to emit confirm event
const confirm = () => {
  emit("confirm", props.selectedEventId); // Emit event with the selected event ID
  emit("update:isOpen", false); // Emit to close modal
};

// Close modal handler
const closeModal = () => {
  emit("update:isOpen", false);
};
</script>
  