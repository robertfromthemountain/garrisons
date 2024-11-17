<template>
  <div>
    <h2 class="text-center subtitle-garrisons text-subtitle-1 text-uppercase">
      {{ t("dashboard.manageBusinessHours.subtitle") }}
    </h2>
    <v-progress-linear
      v-if="loading"
      indeterminate
      color="primary"
      class="mb-4"
    ></v-progress-linear>

    <!-- Display Services Table -->
    <v-table
      v-if="mdAndUp"
      height="100vh"
      fixed-header
      class="bg-garrisons mt-5"
    >
      <thead class="bg-garrisons">
        <tr>
          <th>
            <v-icon class="me-2">mdi-calendar-today</v-icon>
            {{ t("dashboard.manageBusinessHours.table.days") }}
          </th>
          <th>
            <v-icon class="me-2">mdi-clock-start</v-icon>
            {{ t("dashboard.manageBusinessHours.table.open") }}
          </th>
          <th>
            <v-icon class="me-2">mdi-clock-end</v-icon>
            {{ t("dashboard.manageBusinessHours.table.close") }}
          </th>
          <th>
            <v-icon class="me-2">mdi-cog-outline</v-icon>
            {{ t("dashboard.manageBusinessHours.table.actions") }}
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
              <v-icon class="pe-2">mdi-pencil</v-icon
              >{{ t("dashboard.manageBusinessHours.table.buttons.edit") }}
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>

    <!-- Display Business Hours Cards for smaller screens (sm and down) -->
    <v-row v-if="smAndDown" class="d-flex justify-start px-10 my-10">
      <v-col
        cols="6"
        xs="4"
        sm="4"
        v-for="businessHour in filteredBusinessHours"
        :key="businessHour.id"
      >
        <v-card class="bg-dark-garrisons elevation-5">
          <v-card-title>
            <v-icon class="me-1 text-garrisons-2">mdi-calendar-today</v-icon
            >{{ dayOfWeekMap[businessHour.daysOfWeek] }}
          </v-card-title>
          <v-card-text>
            <div>
              <v-icon class="me-1">mdi-clock-start</v-icon
              >{{
                t("dashboard.manageBusinessHours.table.open") +
                ": " +
                businessHour.startTime
              }}<br />
              <v-icon class="me-1">mdi-clock-end</v-icon
              >{{
                t("dashboard.manageBusinessHours.table.close") +
                ": " +
                businessHour.endTime
              }}
            </div>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="d-flex justify-center">
            <v-btn
              density="compact"
              class="btn-garrisons text-garrisons"
              @click="openEditModal(businessHour)"
            >
              <v-icon class="pe-2">mdi-pencil</v-icon
              >{{ t("dashboard.manageBusinessHours.table.buttons.edit") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Edit Business Hours Dialog -->
    <v-dialog v-model="isEditModalOpen" max-width="400px">
      <v-card class="bg-garrisons text-garrisons">
        <v-card-title>
          <h2 class="headline title-garrisons">
            <span class="mdi mdi-pencil-box"></span>
            {{ t("dashboard.manageBusinessHours.modal.title") }}
          </h2>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <!-- Day of Week (Non-editable for this example) -->
          <v-text-field
            density="compact"
            :label="t('dashboard.manageBusinessHours.modal.weekday')"
            v-model="dayOfWeekMap[editBusinessHourData.daysOfWeek]"
            prepend-inner-icon="mdi-calendar-outline"
            readonly
            class="input-field-font"
          ></v-text-field>

          <!-- Start Time Picker -->
          <v-text-field
            v-model="editBusinessHourData.startTime"
            :label="t('dashboard.manageBusinessHours.table.open')"
            readonly
            prepend-inner-icon="mdi-clock-outline"
            @click="startTimeDialog = true"
            class="input-field-font"
          ></v-text-field>

          <v-dialog v-model="startTimeDialog" max-width="350">
            <v-card class="bg-garrisons mx-auto">
              <v-time-picker
                class="bg-garrisons"
                v-model="tempStartTime"
                full-width
                format="24hr"
                color="green-lighten-1"
                @update:modelValue="updateTempStartTime"
              ></v-time-picker>
              <v-card-actions>
                <v-btn text @click="startTimeDialog = false">{{
                  t("dashboard.manageBusinessHours.modal.buttons.cancel")
                }}</v-btn>
                <v-spacer></v-spacer>
                <v-btn text @click="confirmStartTime">OK</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- End Time Picker -->
          <v-text-field
            v-model="editBusinessHourData.endTime"
            :label="t('dashboard.manageBusinessHours.table.close')"
            readonly
            prepend-inner-icon="mdi-clock-outline"
            @click="endTimeDialog = true"
            class="input-field-font"
          ></v-text-field>

          <v-dialog v-model="endTimeDialog" max-width="350">
            <v-card class="bg-garrisons mx-auto">
              <v-time-picker
                class="bg-garrisons"
                v-model="tempEndTime"
                full-width
                format="24hr"
                color="pink"
                @update:modelValue="updateTempEndTime"
              ></v-time-picker>
              <v-card-actions>
                <v-btn text @click="endTimeDialog = false">{{
                  t("dashboard.manageBusinessHours.modal.buttons.cancel")
                }}</v-btn>
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
            {{ t("dashboard.manageBusinessHours.modal.buttons.cancel") }}
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            class="bg-green text-garrisons"
            density="comfortable"
            @click="saveEdit"
          >
            {{ t("dashboard.manageBusinessHours.modal.buttons.save") }}
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
import { useDisplay } from "vuetify";

// Initialize required refs
const { t } = useI18n();
const token = sessionStorage.getItem("accessToken");
const businessHours = ref([]);
const isEditModalOpen = ref(false);
const loading = ref(false);
const { mdAndUp, smAndDown } = useDisplay();
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
  1: t("footer.openingHours.days.monday"),
  2: t("footer.openingHours.days.tuesday"),
  3: t("footer.openingHours.days.wednesday"),
  4: t("footer.openingHours.days.thursday"),
  5: t("footer.openingHours.days.firday"),
  6: t("footer.openingHours.days.saturday"),
  7: t("footer.openingHours.days.sunday"),
};

// Fetch business hours from the backend
const fetchBusinessHours = async () => {
  if (!token) {
    showToast(t("dashboard.manageBusinessHours.toast.tokenError"), "error");
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
    toast.error(t("dashboard.manageBusinessHours.toast.tokenError"));
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
    toast.success(t("dashboard.manageBusinessHours.toast.updateSuccess"));
  } catch (error) {
    toast.error(t("dashboard.manageBusinessHours.toast.updateError"));
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
