<template>
  <div>
    <h2
      class="text-center subtitle-garrisons text-subtitle-1 text-uppercase pb-7"
    >
      {{ t("dashboard.managePendingEvents.subtitle") }}
    </h2>
    <!-- <v-divider></v-divider> -->

    <!-- Display Pending Events Table -->
    <v-table height="100vh" fixed-header class="bg-garrisons">
      <thead>
        <tr>
          <!-- <th>ID</th> -->
          <!-- <th>Service ID</th> -->
          <th>Service</th>
          <th>Booker</th>
          <th>Date</th>
          <th>Start Time</th>
          <th>End Time</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <!-- Loop through existing pending events -->
        <tr v-for="event in pendingEvents" :key="event.pending_event_id">
          <!-- <td>{{ event.id }}</td> -->
          <!-- <td>{{ event.pending_service_id }}</td> -->
          <td>{{ event.title }}</td>
          <td>{{ event.firstName + " " + event.lastName }}</td>
          <td>{{ formatDate(event.start) }}</td>
          <td>{{ formatTime(event.start) }}</td>
          <td>{{ formatTime(event.end) }}</td>
          <td>
            <v-btn
              density="compact"
              class="bg-green text-garrisons"
              @click="confirmPendingEvent(event.pending_event_id)"
            >
              <v-icon class="pe-2">mdi-book-check-outline</v-icon>Accept
            </v-btn>
            <v-btn
              density="compact"
              class="bg-red-darken-1 text-garrisons"
              @click="openDeleteModal(event)"
            >
              <v-icon class="pe-2">mdi-book-cancel-outline</v-icon>Deny
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>

    <!-- Confirmation Modal Component -->
    <ConfirmDeleteModal
      :isOpen="isDeleteModalOpen"
      :selectedEventId="selectedEventId"
      title="Delete Pending Reservation"
      message="Are you sure you want to deny this pending reservation?"
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
import { useToast } from "vue-toastification";

// Initialize i18n translation function
const { t } = useI18n();
const toast = useToast();
// Reactive variable to store the list of pending events
const pendingEvents = ref([]);

// Modal and event state
const isDeleteModalOpen = ref(false);
const selectedEventId = ref(null);

function formatDate(date) {
  if (!date) return "";

  const parsedDate = new Date(date);
  if (isNaN(parsedDate)) {
    console.error("Invalid date provided:", date);
    return ""; // Return a fallback if the date is invalid
  }

  return new Intl.DateTimeFormat("hu-HU", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "UTC",
  }).format(parsedDate);
}

function formatTime(time) {
  if (!time) return "";

  const parsedTime = new Date(time);
  if (isNaN(parsedTime)) {
    console.error("Invalid time provided:", time);
    return ""; // Return a fallback if the time is invalid
  }

  return new Intl.DateTimeFormat("hu-HU", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(parsedTime);
}

const showToast = (message, type = "success") => {
  if (type === "success") toast.success(message);
  else if (type === "error") toast.error(message);
  else if (type === "warning") toast.warning(message);
  else if (type === "info") toast.info(message);
};

const handleError = (customMessage) => {
  showToast(customMessage, "error");
};

// Fetch all pending events from the backend
const fetchPendingEvents = async () => {
  try {
    const response = await axios.get(
      "http://localhost:5000/api/getPendingEvents2"
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

    // Check if the response is successful
    if (response.status === 200) {
      showToast(response.data.message || "Event successfully confirmed!"); // Show success message
      fetchPendingEvents(); // Refresh the list of pending events
    } else {
      throw new Error(
        response.data.message || "Failed to confirm event. Please try again."
      );
    }
  } catch (error) {
    // Display the specific error message from the server, or a default message
    handleError(
      `Error confirming event (ID: ${id}): ${
        error.response?.data?.message || error.message
      }`
    );
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

    // Check if the response is successful
    if (response.status === 200) {
      showToast("Event successfully denied!"); // Show success message
      fetchPendingEvents(); // Refresh the list of pending events
      closeDeleteModal(); // Close modal only on success
    } else {
      throw new Error(
        response.data.message || "Failed to deny event. Try again later."
      );
    }
  } catch (error) {
    // Display the specific error message from the server, or a default message
    handleError(
      `Error denying event (ID: ${id}): ${
        error.response?.data?.message || error.message
      }`
    );
  }
};

// Fetch pending events when the component is mounted
onMounted(fetchPendingEvents);
</script>

<style scoped>
@import "@/assets/styles/dashboard.css";
</style>
