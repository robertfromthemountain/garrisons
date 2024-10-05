<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useStore } from "vuex";
import FullCalendar from "@fullcalendar/vue3";
import apiClient from "@/utils/apiClient";
import { useI18n } from "vue-i18n";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import enLocale from "@fullcalendar/core/locales/en-gb";
import huLocale from "@fullcalendar/core/locales/hu";
import { useToast } from "vue-toastification";

// i18n and toast
const { locale, t } = useI18n();
const toast = useToast();

// Vuex Store
const store = useStore();

// Show toast function
const showToast = (message, type = "success") => {
  if (type === "success") toast.success(message);
  else if (type === "error") toast.error(message);
  else if (type === "warning") toast.warning(message);
  else if (type === "info") toast.info(message);
};

const handleError = (customMessage) => {
  showToast(customMessage, "error");
};

// Reactive State
const calendarEvents = ref([]);
const showFirstDialog = ref(false);
const showConfirmationDialog = ref(false);
const selectedSlot = ref({ date: "", time: "" });
const services = ref([]);
const selectedService = ref(null);
const userId = ref(null);
const email = ref(null);
const firstName = ref(null);
const lastName = ref(null);
const phoneNumber = ref(null);

const pickedStart = ref(null);
const pickedEnd = ref(null);
const pickedDuration = ref(0);
const loading = ref(false);

// Calendar Options
const calendarOptions = reactive({
  timeZone: "UTC",
  weekends: false,
  locales: [huLocale, enLocale],
  locale: locale.value,
  plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
  slotEventOverlap: false,
  initialView: "timeGridWeek",
  slotDuration: "00:15:00",
  slotMinTime: "08:00:00",
  slotMaxTime: "17:00:00",
  editable: false,
  nowIndicator: true,
  headerToolbar: {
    left: "prev",
    center: "title",
    right: "today,next",
  },
  footerToolbar: {
    left: "",
    center: "",
    right: "",
  },
  slotLabelFormat: {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  },
  dateClick: handleDateClick,
  allDaySlot: false,
  events: calendarEvents,
});

// Computed Properties
const formattedDate = computed(() => {
  return selectedSlot.value.date
    ? new Intl.DateTimeFormat("hu-HU", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: "UTC",
      }).format(new Date(selectedSlot.value.date))
    : "";
});

const formattedTime = computed(() => {
  return selectedSlot.value.time
    ? new Intl.DateTimeFormat("hu-HU", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
      }).format(new Date(selectedSlot.value.time))
    : "";
});

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

function handleDateClick(arg) {
  selectedSlot.value = { date: arg.dateStr, time: arg.dateStr };
  selectedService.value = null;
  showFirstDialog.value = true;
}

// Lifecycle Hook
onMounted(() => {
  fetchUserId();
  fetchAllEvents();
  fetchServices();
});

// Methods
async function fetchUserId() {
  if (!store.getters.isLoggedIn) return;

  const token = store.getters.accessToken;
  const payload = JSON.parse(atob(token.split(".")[1]));
  const currentTime = Math.floor(Date.now() / 1000);

  if (payload.exp < currentTime) {
    showToast("Session expired. Please log in again.", "info");
    store.dispatch("logout");
    return;
  }

  loading.value = true;
  try {
    const response = await apiClient.get("http://localhost:5000/api/user", {
      headers: { Authorization: `Bearer ${token}` },
    });
    userId.value = response.data.userId;
    email.value = response.data.email;
    firstName.value = response.data.firstName;
    lastName.value = response.data.lastName;
    phoneNumber.value = response.data.phoneNumber;
  } catch (error) {
    console.log("Error fetching user ID: " + error.message);
    handleError("Error fetching user ID: " + error.message);
  } finally {
    loading.value = false;
  }
}

async function fetchAllEvents() {
  loading.value = true;
  try {
    const [regularEventsResponse, pendingEventsResponse] = await Promise.all([
      apiClient.get("http://localhost:5000/api/getEvents"),
      apiClient.get("http://localhost:5000/api/getPendingEvents2"),
    ]);

    // Combine both event types in a single assignment
    calendarOptions.events = [
      ...regularEventsResponse.data,
      ...pendingEventsResponse.data,
    ];
    console.log("Fetched all events:", calendarOptions.events);
  } catch (error) {
    console.error("Error fetching all events:", error);
  } finally {
    loading.value = false;
  }
}

async function fetchServices() {
  loading.value = true;
  try {
    const response = await apiClient.get("http://localhost:5000/api/services");
    services.value = response.data;
  } catch (error) {
    console.error("Error fetching services:", error);
  } finally {
    loading.value = false;
  }
}

function closeDialog() {
  showFirstDialog.value = false;
  showConfirmationDialog.value = false;
  selectedSlot.value = {};
  selectedService.value = null;
}

function checkOverlap() {
  if (!selectedService.value) {
    showToast("Please select a service.", "warning");
    return;
  }

  pickedDuration.value = selectedService.value.duration;
  const startTime = new Date(selectedSlot.value.date);
  pickedStart.value = startTime;
  pickedEnd.value = new Date(
    startTime.getTime() + pickedDuration.value * 60000
  );
  // console.log(
  //   "ITT VANNAK EZEK ASZAROK IS:",
  //   pickedDuration.value,
  //   pickedStart.value,
  //   pickedEnd.value
  // );

  const hasOverlap = calendarOptions.events.some((event) => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    return startTime < eventEnd && pickedEnd.value > eventStart;
  });

  if (hasOverlap) {
    showToast(
      "This time slot is already booked. Please choose another time.",
      "error"
    );
  } else {
    showConfirmationDialog.value = true;
    showFirstDialog.value = false;
  }
}

function confirmationDialogCancel() {
  showConfirmationDialog.value = false;
}

async function finalizeBooking() {
  const durationInMinutes = parseInt(selectedService.value.duration, 10);
  const startTime = new Date(selectedSlot.value.date);
  const endTime = new Date(startTime.getTime() + durationInMinutes * 60000);

  const newEvent = {
    pending_service_title: selectedService.value.title,
    pending_service_id: selectedService.value.id,
    pending_date: selectedSlot.value.date,
    pending_start_of_event: startTime.toISOString(),
    pending_end_of_event: endTime.toISOString(),
    user_id: userId.value,
  };

  loading.value = true;
  try {
    await apiClient.post("http://localhost:5000/api/requestEvent", newEvent, {
      headers: { Authorization: `Bearer ${store.getters.accessToken}` },
    });

    calendarOptions.events.push(newEvent);
    showToast(
      `Appointment for ${selectedService.value.title} successfully requested!`
    );

    await fetchAllEvents();
    showConfirmationDialog.value = false;
  } catch (error) {
    handleError(
      "There was an error booking your appointment. Please try again." +
        error.message
    );
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="pa-8 rounded elevation-5">
    <v-progress-linear
      v-if="loading"
      indeterminate
      color="primary"
      class="mb-4"
    ></v-progress-linear>
    <FullCalendar :options="calendarOptions" class="h-auto" />

    <v-dialog v-model="showFirstDialog" max-width="600">
      <v-card class="bg-garrisons text-garrisons">
        <v-card-title>
          <h2 class="headline title-garrisons">
            {{ t("dialog.bookDialog.title1") }}
          </h2>
        </v-card-title>
        <v-divider class="mx-3"></v-divider>
        <v-card-text>
          <p class="pb-1">
            Please select a service to calculate your appointment!
          </p>
          <v-select
            class=""
            v-model="selectedService"
            :items="services"
            :item-value="(service) => service"
            item-text="title"
            :label="t('dialog.bookDialog.selectTitle')"
            density="compact"
            clearable
            v-if="services.length > 0"
          ></v-select>
          <p v-else>{{ t("dialog.bookDialog.noServices") }}</p>
          <p>
            <span class="mdi mdi-calendar-question-outline"></span>
            {{ formattedDate }}
          </p>
          <p class="pb-2">
            <span class="mdi mdi-clock-outline"></span>
            {{ formattedTime }}
          </p>
          <div v-if="selectedService">
            <!-- <p v-if="$store.getters.isLoggedIn">
              <span class="mdi mdi-account-circle-outline"></span>
              {{ firstName + " " + lastName }}
            </p>
            <p v-if="$store.getters.isLoggedIn">
              <span class="mdi mdi-email-outline"></span> {{ email }}
            </p>
            <p v-if="$store.getters.isLoggedIn" class="pb-2">
              <span class="mdi mdi-phone-outline"></span> {{ phoneNumber }}
            </p> -->
            <p>
              <span class="mdi mdi-content-cut"></span>
              {{ selectedService.title }} -
              <span class="mdi mdi-cash-multiple"></span>
              {{ selectedService.price }} HUF
            </p>
            <p>
              <span class="mdi mdi-timer-sand"></span>
              {{ selectedService.duration }} {{ t("dialog.duration2") }}
            </p>
          </div>
        </v-card-text>
        <v-divider class="mx-3"></v-divider>
        <v-card-actions class="ma-2">
          <v-btn
            :disabled="loading"
            class="text-garrisons"
            variant="tonal"
            @click="closeDialog"
            >{{ t("dialog.button.cancel") }}</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn
            :disabled="loading"
            class="text-garrisons bg-green"
            @click="checkOverlap"
            >{{ t("dialog.button.next") }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showConfirmationDialog" max-width="600" persistent>
      <v-card class="bg-garrisons text-garrisons">
        <v-card-title>
          <h2 class="headline title-garrisons py-2">Finalize your booking</h2>
        </v-card-title>
        <v-divider class="mx-3"></v-divider>
        <v-card-text>
          <p>
            <span class="mdi mdi-account-circle-outline"></span>
            {{ firstName + " " + lastName }}
          </p>
          <p><span class="mdi mdi-email-outline"></span> {{ email }}</p>
          <p><span class="mdi mdi-phone-outline"></span> {{ phoneNumber }}</p>
          <div class="py-2"></div>
          <p>
            <span class="mdi mdi-calendar-outline"></span>
            {{ formatDate(pickedStart) }}
          </p>
          <p>
            <span class="mdi mdi-calendar-start-outline"></span>
            {{ formatTime(pickedStart) }} -
            <span class="mdi mdi-calendar-end-outline"></span>
            {{ formatTime(pickedEnd) }},
            <span class="mdi mdi-timer-sand"></span>
            {{ pickedDuration }} minutes
          </p>
          <p>
            <span class="mdi mdi-content-cut"></span>
            {{ selectedService.title }} -
            <span class="mdi mdi-cash-multiple"></span>
            {{ selectedService.price }} HUF
          </p>
        </v-card-text>
        <v-divider class="mx-3"></v-divider>
        <v-card-actions class="ma-2">
          <v-btn
            :disabled="loading"
            class="text-garrisons"
            variant="tonal"
            @click="confirmationDialogCancel"
            >{{ t("dialog.button.cancel") }}</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn
            :disabled="loading"
            class="text-garrisons bg-green"
            @click="finalizeBooking"
            >{{ t("dialog.button.requestBook") }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
  
  
  
<style>
.v-dialog {
  z-index: 1000;
}

.text-garrisons {
  color: #d3d2cd;
}

.btn-garrisons {
  background-color: #8f6a48;
}

.bg-garrisons {
  background-color: #26211e;
}

p {
  font-size: larger;
}

.calendar-border {
  border: 1px solid #6a4e35;
  border-radius: 5px;
}
</style>
  