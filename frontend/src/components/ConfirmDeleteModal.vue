<template>
  <v-dialog
    :model-value="isOpen"
    max-width="600"
    @update:modelValue="closeModal"
    persistent
  >
    <v-card class="bg-garrisons text-garrisons">
      <v-card-title>
        <h2 class="headline title-garrisons">{{ title }}</h2>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <h3>{{ message }}</h3>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn @click="cancel">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn class="bg-red-lighten-1 text-garrisons" @click="confirm">
          Confirm
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { defineEmits } from "vue";

// Props to control modal visibility, selected ID, and dynamic text
const props = defineProps({
  isOpen: Boolean,
  selectedEventId: Number,
  title: {
    type: String,
    default: "Confirm Action",
  },
  message: {
    type: String,
    default: "Are you sure you want to proceed?",
  },
});

// Emits for communicating with the parent component
const emit = defineEmits(["cancel", "confirm", "update:isOpen"]);

// Method to emit cancel event
const cancel = () => {
  emit("cancel");
  emit("update:isOpen", false);
};

// Method to emit confirm event
const confirm = () => {
  emit("confirm", props.selectedEventId);
  emit("update:isOpen", false);
};

// Close modal handler
const closeModal = () => {
  emit("update:isOpen", false);
};
</script>
