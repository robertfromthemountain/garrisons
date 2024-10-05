<template>
  <div>
    <h2
      class="text-center subtitle-garrisons text-subtitle-1 text-uppercase pb-7"
    >
      {{ t("dashboard.managePendingEvents.subtitle") }}
    </h2>
    <!-- <v-divider></v-divider> -->
    <!-- Loading Indicator -->
    <v-progress-linear
      v-if="loading"
      indeterminate
      color="primary"
      class="mb-4"
    ></v-progress-linear>
    <!-- Display Pending Events Table -->
    <v-table height="100vh" fixed-header class="bg-garrisons">
      <thead>
        <tr>
          <!-- <th>ID</th> -->
          <!-- <th>Service ID</th> -->
          <th><v-icon class="me-2">mdi-content-cut</v-icon>Service</th>
          <th>
            <v-icon class="me-2">mdi-account-circle-outline</v-icon>Booker
          </th>
          <th><v-icon class="me-2">mdi-calendar-outline</v-icon>Date</th>
          <th><v-icon class="me-2">mdi-calendar-start-outline</v-icon>Start Time</th>
          <th><v-icon class="me-2">mdi-calendar-end-outline</v-icon>End Time</th>
          <th><v-icon class="me-2">mdi-cog-outline</v-icon>Actions</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="pendingEvents.length === 0">
          <tr>
            <td colspan="6" class="text-center">
              There are no pending events at the moment. Take a break, grab some
              coffee, and wait for the next booking to come in!
            </td>
          </tr>
        </template>
        <!-- Loop through existing pending events -->
        <template v-else>
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
                :disabled="loading"
                @click="confirmPendingEvent(event.id)"
              >
                <v-icon class="pe-2">mdi-book-check-outline</v-icon>Accept
              </v-btn>
              <v-btn
                density="compact"
                class="bg-red-darken-1 text-garrisons"
                :disabled="loading"
                @click="openDeleteModal(event)"
              >
                <v-icon class="pe-2">mdi-book-cancel-outline</v-icon>Deny
              </v-btn>
            </td>
          </tr>
        </template>
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
import apiClient from "@/utils/apiClient";
import { useI18n } from "vue-i18n";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal.vue";
import { useToast } from "vue-toastification";

// Initialize i18n translation function
const { t } = useI18n();
const token = sessionStorage.getItem("accessToken");
const toast = useToast();
const loading = ref(false); // Add loading state
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
  if (!token) {
    showToast("You are not logged in. Please log in again.", "error");
    return;
  }
  loading.value = true;
  try {
    const response = await apiClient.get(
      "http://localhost:5000/api/getPendingEvents2",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    pendingEvents.value = response.data; // Populate pending events with data from API
  } catch (error) {
    console.error("Error fetching pending events:", error);
  } finally {
    loading.value = false;
  }
};

// Confirm a pending event using the existing confirmEvent endpoint
const confirmPendingEvent = async (id) => {
  console.log(id);
  if (!token) {
    showToast("You are not logged in. Please log in again.", "error");
    return;
  }
  loading.value = true;
  try {
    const response = await apiClient.get(
      `http://localhost:5000/api/confirmEvent/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
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
  } finally {
    loading.value = false;
  }
};

// Open the delete confirmation modal and set the selected event ID
const openDeleteModal = (event) => {
  selectedEventId.value = event.id;
  isDeleteModalOpen.value = true;
};

// Close the modal
const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
};

// Deny (delete) a pending event
const denyPendingEvent = async () => {
  const id = selectedEventId.value; // Ensure the correct ID is used here
  console.log("Selected Event ID:", id); // Check if the ID is logged correctly

  if (!id) {
    handleError("No event selected to deny.");
    return;
  }

  if (!token) {
    showToast("You are not logged in. Please log in again.", "error");
    return;
  }

  loading.value = true;
  try {
    const response = await apiClient.get(
      `http://localhost:5000/api/deletePendingEvent/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.status === 200) {
      showToast("Event successfully denied!");
      fetchPendingEvents(); // Refresh pending events
      closeDeleteModal(); // Close modal
    } else {
      throw new Error(
        response.data.message || "Failed to deny event. Try again later."
      );
    }
  } catch (error) {
    handleError(`Error denying event (ID: ${id}): ${error.message}`);
  } finally {
    loading.value = false;
  }
};

// Fetch pending events when the component is mounted
onMounted(fetchPendingEvents);
</script>

<style scoped>
@import "@/assets/styles/dashboard.css";
</style>
