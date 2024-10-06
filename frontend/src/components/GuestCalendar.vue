<script setup>
import { ref, reactive, onMounted, shallowRef } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import apiClient from "@/utils/apiClient";
import { useI18n } from "vue-i18n";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import enLocale from "@fullcalendar/core/locales/en-gb";
import huLocale from "@fullcalendar/core/locales/hu";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";
import RegisterForm from "./RegisterForm.vue";
import LoginForm from "./LoginForm.vue";

// i18n and toast
const { locale, t } = useI18n();
const toast = useToast();
const router = useRouter();

// Reactive State
const calendarEvents = ref([]);
const selectedSlot = ref({ date: "", time: "" });
const showLoginRegisterDialog = ref(false); // Modal to show login/register
const activeComponent = shallowRef(LoginForm); // Toggle between LoginForm and RegisterForm
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
  eventTimeFormat: {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  },
  businessHours: true,
  dateClick: handleDateClick,
  allDaySlot: false,
  events: calendarEvents,
});

// Function to handle date click and show modal for login/register
function handleDateClick(arg) {
  const clickedDate = new Date(arg.date);
  const dayOfWeek = clickedDate.getDay();
  const clickedTime = clickedDate.toISOString().slice(11, 16);

  const isWithinBusinessHours = calendarOptions.businessHours.some(
    (businessHour) => {
      if (businessHour.daysOfWeek.includes(dayOfWeek)) {
        return (
          clickedTime >= businessHour.startTime &&
          clickedTime < businessHour.endTime
        );
      }
      return false;
    }
  );

  if (isWithinBusinessHours) {
    selectedSlot.value = { date: arg.dateStr, time: arg.dateStr };
    activeComponent.value = LoginForm; // Start with login form
    showLoginRegisterDialog.value = true;
  } else {
    toast.error("This time slot is outside of business hours.");
  }
}

// Close the login/register modal
function closeLoginRegisterDialog() {
  showLoginRegisterDialog.value = false;
}

// Toggle between Login and Register forms
function toggleForm() {
  activeComponent.value =
    activeComponent.value === LoginForm ? RegisterForm : LoginForm;
}

// Lifecycle Hook
onMounted(async () => {
  await fetchAllEvents();
  const businessHoursData = await fetchBusinessHours();
  if (businessHoursData) {
    calendarOptions.businessHours = mapBusinessHours(businessHoursData);
  }
});

// Fetch all events
async function fetchAllEvents() {
  loading.value = true;
  try {
    const [regularEventsResponse, pendingEventsResponse] = await Promise.all([
      apiClient.get("http://localhost:5000/api/getEvents"),
      apiClient.get("http://localhost:5000/api/getPendingEvents2"),
    ]);
    calendarOptions.events = [
      ...regularEventsResponse.data,
      ...pendingEventsResponse.data,
    ];
  } catch (error) {
    console.error("Error fetching all events:", error);
  } finally {
    loading.value = false;
  }
}

// Fetch business hours
async function fetchBusinessHours() {
  loading.value = true;
  try {
    const response = await apiClient.get(
      "http://localhost:5000/api/business-hours"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching business hours:", error);
  } finally {
    loading.value = false;
  }
}

// Function to map business hours to FullCalendar's format
function mapBusinessHours(businessHours) {
  return businessHours.map((hour) => ({
    daysOfWeek: [hour.daysOfWeek],
    startTime: hour.startTime.slice(0, 5),
    endTime: hour.endTime.slice(0, 5),
  }));
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

    <!-- Modal for Login/Register -->
    <v-dialog v-model="showLoginRegisterDialog" max-width="35vw">
      <v-card class="bg-garrisons text-garrisons">
        <v-card-title>
          <h2 class="headline title-garrisons py-2 text-center">
            {{ activeComponent === LoginForm ? "To be able to book, you need to sing in here:" : "Dont have an account? Register here:" }}
          </h2>
        </v-card-title>

        <v-divider class="mx-3"></v-divider>

        <!-- Smooth transition between forms -->
        <v-card-text class="mb-8">
          <transition name="fade" mode="out-in">
            <component :is="activeComponent" :showLink="false"></component>
          </transition>
        </v-card-text>

        <v-divider class="mx-3"></v-divider>

        <v-card-actions class="ma-2">
          <v-btn
            class="text-garrisons bg-red-lighten-1"
            @click="closeLoginRegisterDialog"
          >
            Close
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            class="text-garrisons bg-green"
            @click="toggleForm"
          >
            {{ activeComponent === LoginForm ? "I dont have an account!" : "I already have an account!" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
