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
    <v-table v-if="mdAndUp" height="100vh" fixed-header class="bg-garrisons">
      <thead>
        <tr>
          <!-- <th>ID</th> -->
          <!-- <th>Service ID</th> -->
          <th>
            <v-icon class="me-2">mdi-content-cut</v-icon
            >{{ t("dashboard.managePendingEvents.table.service") }}
          </th>
          <th>
            <v-icon class="me-2">mdi-account-circle-outline</v-icon
            >{{ t("dashboard.managePendingEvents.table.booker") }}
          </th>
          <th>
            <v-icon class="me-2">mdi-calendar-outline</v-icon
            >{{ t("dashboard.managePendingEvents.table.date") }}
          </th>
          <th>
            <v-icon class="me-2">mdi-calendar-start-outline</v-icon
            >{{ t("dashboard.managePendingEvents.table.start") }}
          </th>
          <th>
            <v-icon class="me-2">mdi-calendar-end-outline</v-icon
            >{{ t("dashboard.managePendingEvents.table.end") }}
          </th>
          <th>
            <v-icon class="me-2">mdi-cog-outline</v-icon
            >{{ t("dashboard.managePendingEvents.table.actions") }}
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-if="pendingEvents.length === 0&&!loading">
          <tr>
            <td colspan="6" class="text-center">
              {{ t("dashboard.managePendingEvents.noEvents") }}
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
            <td class="d-flex align-center">
              <v-btn
                density="compact"
                class="bg-green text-garrisons"
                :disabled="loading"
                @click="confirmPendingEvent(event.id)"
              >
                <v-icon class="pe-2">mdi-book-check-outline</v-icon
                >{{ t("dashboard.managePendingEvents.table.buttons.accept") }}
              </v-btn>
              <v-btn
                density="compact"
                class="bg-red-darken-1 text-garrisons"
                :disabled="loading"
                @click="openDeleteModal(event)"
              >
                <v-icon class="pe-2">mdi-book-cancel-outline</v-icon
                >{{ t("dashboard.managePendingEvents.table.buttons.deny") }}
              </v-btn>
            </td>
          </tr>
        </template>
      </tbody>
    </v-table>

    <!-- Display Cards on mobile views (smAndDown) -->
    <v-row v-if="smAndDown" class="d-flex justify-start px-10">
      <template v-if="pendingEvents.length === 0&&!loading">
          <tr>
            <td colspan="6" class="text-center">
              {{ t("dashboard.managePendingEvents.noEvents") }}
            </td>
          </tr>
        </template>
      <v-col
        cols="12"
        xs="12"
        sm="6"
        v-for="event in pendingEvents"
        :key="event.pending_event_id"
      >
        <v-card class="bg-dark-garrisons elevation-5">
          <v-card-title
            ><v-icon class="me-1">mdi-content-cut</v-icon
            >{{
              event.firstName + " " + event.lastName + ", " + event.title
            }}</v-card-title
          >
          <v-card-text>
            <div>
              <v-icon class="me-1">mdi-calendar-outline</v-icon
              >{{ formatDate(event.start) }} <br />
              <v-icon class="me-1">mdi-clock-outline</v-icon
              >{{ formatTime(event.start) }} - {{ formatTime(event.end) }}
            </div>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn
              density="compact"
              class="ms-2 bg-red-darken-1 text-garrisons"
              :disabled="loading"
              @click="openDeleteModal(event)"
            >
              <v-icon class="pe-2">mdi-book-cancel-outline</v-icon
              >{{ t("dashboard.managePendingEvents.table.buttons.deny") }}
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              density="compact"
              class="bg-green text-garrisons"
              :disabled="loading"
              @click="confirmPendingEvent(event.id)"
            >
              <v-icon class="pe-2">mdi-book-check-outline</v-icon
              >{{ t("dashboard.managePendingEvents.table.buttons.accept") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Confirmation Modal Component -->
    <ConfirmDeleteModal
      :isOpen="isDeleteModalOpen"
      :selectedEventId="selectedEventId"
      :title="t('dashboard.managePendingEvents.deleteModal.title')"
      :message="t('dashboard.managePendingEvents.deleteModal.message')"
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
import { useDisplay } from "vuetify";

// Initialize i18n translation function
const { t } = useI18n();
const token = sessionStorage.getItem("accessToken");
const toast = useToast();
const loading = ref(false); // Add loading state
const { mdAndUp, smAndDown } = useDisplay();
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
    showToast(t("dashboard.managePendingEvents.toast.error.token"), "error");
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
    showToast(t("dashboard.managePendingEvents.toast.error.token"), "error");
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
      showToast(
        response.data.message ||
          t("dashboard.managePendingEvents.toast.success.confirm")
      ); // Show success message
      fetchPendingEvents(); // Refresh the list of pending events
    } else {
      throw new Error(
        response.data.message ||
          t("dashboard.managePendingEvents.toast.error.confirm")
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
    handleError(t("dashboard.managePendingEvents.toast.error.noEvent"));
    return;
  }

  if (!token) {
    showToast(t("dashboard.managePendingEvents.toast.error.token"), "error");
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
      showToast(t("dashboard.managePendingEvents.toast.success.deny"));
      fetchPendingEvents(); // Refresh pending events
      closeDeleteModal(); // Close modal
    } else {
      throw new Error(
        response.data.message ||
          t("dashboard.managePendingEvents.toast.error.deny")
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
