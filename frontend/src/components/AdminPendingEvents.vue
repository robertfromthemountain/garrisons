<template>
  <div>
    <h2 class="text-center subtitle-garrisons text-subtitle-1 text-uppercase">
      {{ t("dashboard.managePendingEvents.subtitle") }}
    </h2>
    <v-divider></v-divider>

    <!-- Display Pending Events Table -->
    <v-table height="100vh" fixed-header class="bg-garrisons">
      <thead>
        <tr>
          <th>ID</th>
          <th>Service ID</th>
          <th>Service Title</th>
          <th>Date</th>
          <th>Start Time</th>
          <th>End Time</th>
          <th>User ID</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <!-- Loop through existing pending events -->
        <tr v-for="event in pendingEvents" :key="event.pending_event_id">
          <td>{{ event.pending_event_id }}</td>
          <td>{{ event.pending_service_id }}</td>
          <td>{{ event.pending_service_title }}</td>
          <td>{{ event.pending_date }}</td>
          <td>{{ event.pending_start_of_event }}</td>
          <td>{{ event.pending_end_of_event }}</td>
          <td>{{ event.user_id }}</td>
          <td>
            <button @click="confirmPendingEvent(event.pending_event_id)">
              Accept
            </button>
            <button @click="openDeleteModal(event)">Deny</button>
          </td>
        </tr>
      </tbody>
    </v-table>

    <!-- Confirmation Modal Component -->
    <ConfirmDeleteModal
      :isOpen="isDeleteModalOpen"
      :selectedEventId="selectedEventId"
      @cancel="closeDeleteModal"
      @confirm="denyPendingEvent"
      @update:isOpen="(val) => (isDeleteModalOpen = val)"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useI18n } from "vue-i18n";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal.vue";

// Initialize i18n translation function
const { t } = useI18n();

// Reactive variable to store the list of pending events
const pendingEvents = ref([]);

// Modal and event state
const isDeleteModalOpen = ref(false);
const selectedEventId = ref(null);

// Fetch all pending events from the backend
const fetchPendingEvents = async () => {
  try {
    const response = await axios.get(
      "http://localhost:5000/api/getPendingEvents"
    );
    pendingEvents.value = response.data; // Populate pending events with data from API
  } catch (error) {
    console.error("Error fetching pending events:", error);
  }
};

// Confirm a pending event using the existing confirmEvent endpoint
const confirmPendingEvent = async (id) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/confirmEvent/${id}`
    );
    alert(response.data); // Show the response message
    fetchPendingEvents(); // Refresh the list of pending events
  } catch (error) {
    console.error("Error confirming pending event:", error);
  }
};

// Open the delete confirmation modal and set the selected event ID
const openDeleteModal = (event) => {
  selectedEventId.value = event.pending_event_id;
  isDeleteModalOpen.value = true;
};

// Close the modal
const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
};

// Deny (delete) a pending event
const denyPendingEvent = async (id) => {
  try {
    const response = await axios.delete(
      `http://localhost:5000/api/deletePendingEvent/${id}`
    );
    alert(response.data.message); // Show the response message
    fetchPendingEvents(); // Refresh the list of pending events
    closeDeleteModal();
  } catch (error) {
    console.error("Error denying pending event:", error);
  }
};

// Fetch pending events when the component is mounted
onMounted(fetchPendingEvents);
</script>

<style scoped>
@import "@/assets/styles/dashboard.css";
</style>
