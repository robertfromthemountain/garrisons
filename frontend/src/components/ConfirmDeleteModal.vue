<template>
    <!-- Use v-model:visible to control the dialog visibility -->
    <v-dialog :model-value="isOpen" max-width="400px" @update:modelValue="closeModal">
      <v-card>
        <v-card-title class="headline">Confirm Delete</v-card-title>
        <v-card-text>
          Are you sure you want to delete this event?
        </v-card-text>
        <v-card-actions>
          <v-btn color="green darken-1" text @click="cancel">
            Cancel
          </v-btn>
          <v-btn color="red darken-1" text @click="confirm">
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup>
  import { defineEmits, defineProps } from 'vue';
  
  // Props to control the modal visibility and selected event ID
  const props = defineProps({
    isOpen: Boolean,  // Modal visibility
    selectedEventId: Number,  // The event ID selected for deletion
  });
  
  // Emits for communicating with the parent component
  const emit = defineEmits(['cancel', 'confirm', 'update:isOpen']);
  
  // Method to emit cancel event
  const cancel = () => {
    emit('cancel');
    emit('update:isOpen', false); // Emit to close modal
  };
  
  // Method to emit confirm event
  const confirm = () => {
    emit('confirm', props.selectedEventId); // Emit event with the selected event ID
    emit('update:isOpen', false); // Emit to close modal
  };
  
  // Close modal handler
  const closeModal = () => {
    emit('update:isOpen', false);
  };
  </script>
  