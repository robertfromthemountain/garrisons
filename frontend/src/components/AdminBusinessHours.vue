<template>
  <div>
    <h2 class="text-center subtitle-garrisons text-subtitle-1 text-uppercase">
      {{ t("dashboard.manageServices.subtitle") }}
    </h2>
    <v-progress-linear
      v-if="loading"
      indeterminate
      color="primary"
      class="mb-4"
    ></v-progress-linear>

    <!-- Display Services Table -->
    <v-table height="100vh" fixed-header class="bg-garrisons mt-5">
      <thead class="bg-garrisons">
        <tr>
          <th>
            <v-icon class="me-2">mdi-calendar-today</v-icon>
            Days of Week
          </th>
          <th>
            <v-icon class="me-2">mdi-clock-start</v-icon>
            Start Time
          </th>
          <th>
            <v-icon class="me-2">mdi-clock-end</v-icon>
            End Time
          </th>
          <th>
            <v-icon class="me-2">mdi-cog-outline</v-icon>
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="businessHour in filteredBusinessHours"
          :key="businessHour.id"
          class="text-start"
        >
          <td>{{ dayOfWeekMap[businessHour.daysOfWeek] }}</td>
          <td>{{ businessHour.startTime }}</td>
          <td>{{ businessHour.endTime }}</td>
          <td>
            <v-btn
              density="compact"
              class="btn-garrisons text-garrisons text-start"
              @click="openEditModal(businessHour)"
            >
              <v-icon class="pe-2">mdi-pencil</v-icon>Edit
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>

    <!-- Edit Business Hours Dialog -->
    <v-dialog v-model="isEditModalOpen" max-width="400px">
      <v-card class="bg-garrisons text-garrisons">
        <v-card-title>
          <h2 class="headline title-garrisons">
            <span class="mdi mdi-pencil-box"></span>
            Edit Business Hours
          </h2>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <!-- Day of Week (Non-editable for this example) -->
          <v-text-field
            density="compact"
            label="Day of Week"
            v-model="dayOfWeekMap[editBusinessHourData.daysOfWeek]"
            prepend-inner-icon="mdi-calendar-outline"
            readonly
          ></v-text-field>

          <!-- Start Time Picker -->
          <v-text-field
            v-model="editBusinessHourData.startTime"
            label="Start Time"
            readonly
            prepend-inner-icon="mdi-clock-outline"
            @click="startTimeDialog = true"
          ></v-text-field>

          <v-dialog v-model="startTimeDialog" max-width="350">
            <v-card>
              <v-time-picker
                v-model="tempStartTime"
                full-width
                format="24hr"
                color="green-lighten-1"
                @update:modelValue="updateTempStartTime"
              ></v-time-picker>
              <v-card-actions>
                <v-btn text @click="startTimeDialog = false">Cancel</v-btn>
                <v-spacer></v-spacer>
                <v-btn text @click="confirmStartTime">OK</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- End Time Picker -->
          <v-text-field
            v-model="editBusinessHourData.endTime"
            label="End Time"
            readonly
            prepend-inner-icon="mdi-clock-outline"
            @click="endTimeDialog = true"
          ></v-text-field>

          <v-dialog v-model="endTimeDialog" max-width="350">
            <v-card>
              <v-time-picker
                v-model="tempEndTime"
                full-width
                format="24hr"
                color="pink"
                @update:modelValue="updateTempEndTime"
              ></v-time-picker>
              <v-card-actions>
                <v-btn text @click="endTimeDialog = false">Cancel</v-btn>
                <v-spacer></v-spacer>
                <v-btn text @click="confirmEndTime">OK</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-card-text>
        <v-card-actions>
          <v-btn
            class="bg-red-darken-1 text-garrisons ms-2"
            density="comfortable"
            @click="closeEditModal"
          >
            Cancel
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            class="bg-green text-garrisons"
            density="comfortable"
            @click="saveEdit"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import apiClient from "@/utils/apiClient";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";
import { VTimePicker } from "vuetify/lib/labs/components.mjs";

// Initialize required refs
const { t } = useI18n();
const token = sessionStorage.getItem("accessToken");
const businessHours = ref([]);
const isEditModalOpen = ref(false);
const loading = ref(false);
const searchQuery = ref("");
const editBusinessHourData = ref({
  id: null,
  daysOfWeek: "",
  startTime: null,
  endTime: null,
});
const tempStartTime = ref(null);
const tempEndTime = ref(null);
const startTimeDialog = ref(false);
const endTimeDialog = ref(false);
const toast = useToast();

// Map numbers to day names
const dayOfWeekMap = {
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
  7: "Sunday",
};

// Fetch business hours from the backend
const fetchBusinessHours = async () => {
  if (!token) {
    showToast("You are not logged in. Please log in again.", "error");
    return;
  }
  loading.value = true;
  try {
    const response = await apiClient.get(
      "http://localhost:5000/api/business-hours",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    businessHours.value = response.data;
  } catch (error) {
    console.error("Error fetching business hours", error);
  } finally {
    loading.value = false;
  }
};

// Open edit modal and load the selected business hour into the form
const openEditModal = (businessHour) => {
  editBusinessHourData.value = { ...businessHour };
  tempStartTime.value = null;
  tempEndTime.value = null;
  isEditModalOpen.value = true;
};

// Close the edit modal
const closeEditModal = () => {
  isEditModalOpen.value = false;
};

// Ensure time is updated even if only the hour is changed
const updateTempStartTime = (time) => {
  tempStartTime.value = time;
};
const updateTempEndTime = (time) => {
  tempEndTime.value = time;
};

// Confirm selected start time
const confirmStartTime = () => {
  editBusinessHourData.value.startTime = tempStartTime.value;
  startTimeDialog.value = false;
};

// Confirm selected end time
const confirmEndTime = () => {
  editBusinessHourData.value.endTime = tempEndTime.value;
  endTimeDialog.value = false;
};

// Format time to 'HH:mm' format for FullCalendar
const formatTime = (timeKey) => {
  const time = editBusinessHourData.value[timeKey];
  if (time && time.length === 8) {
    editBusinessHourData.value[timeKey] = time.slice(0, 5);
  }
};

// Save the edited business hours
const saveEdit = async () => {
  if (!token) {
    toast.error("You are not logged in. Please log in again.");
    return;
  }
  loading.value = true;

  // Ensure times are properly formatted for FullCalendar
  formatTime("startTime");
  formatTime("endTime");

  try {
    await apiClient.put(
      `http://localhost:5000/api/business-hours/${editBusinessHourData.value.id}`,
      editBusinessHourData.value,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // Update the local list of business hours
    const index = businessHours.value.findIndex(
      (s) => s.id === editBusinessHourData.value.id
    );
    businessHours.value[index] = { ...editBusinessHourData.value };

    isEditModalOpen.value = false; // Close the modal
    toast.success("Business hour updated successfully!");
  } catch (error) {
    toast.error("Failed to update business hour.");
    console.error("Error updating business hour:", error);
  } finally {
    loading.value = false;
  }
};

// Computed property to filter services based on search query
const filteredBusinessHours = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return businessHours.value.filter((businessHour) =>
    ["daysOfWeek", "startTime", "endTime"].some((key) =>
      String(businessHour[key]).toLowerCase().includes(query)
    )
  );
});

// Fetch services on component mount
onMounted(fetchBusinessHours);
</script>

<style scoped>
@import "@/assets/styles/dashboard.css";
</style>
