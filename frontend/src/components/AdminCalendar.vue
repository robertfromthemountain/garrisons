<script setup>
import { ref, onMounted } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import apiClient from "@/utils/apiClient"; // Import your Axios client
import { useI18n } from "vue-i18n";
import ConfirmDeleteModal from "./ConfirmDeleteModal.vue";
import { useSlotDateTimeFormatter } from "@/composables/dashboard/useSlotDateTimeFormatter";
import { useDialogDateTimeFormatter } from "@/composables/dashboard/useDialogDateTimeFormatter";
import { useCalendarViewSettings } from "@/composables/dashboard/useCalendarViewSettings";
import { useLoading } from "@/composables/dashboard/useLoading";
import { useDialogManager } from "@/composables/dashboard/useDialogManager";
import { useNotifier } from "@/composables/dashboard/useNotifier";
import { useEventFetcher } from "@/composables/useEventFetcher";
import { useCalendarOptions } from "@/composables/dashboard/useCalendarOptions";
// i18n and toast
const { locale, t } = useI18n();
const { showToast } = useNotifier();

// Reactive State
const calendarEvents = ref([]);
const services = ref([]);
const token = sessionStorage.getItem("accessToken"); // Get token from sessionStorage

const originalEvents = ref([]);
const modifiedEvents = ref([]);
const modifying = ref(false);
const selectedSlot = ref({ date: "", time: "" });
const { formattedDate, formattedTime } = useSlotDateTimeFormatter(selectedSlot);
const { formatDate, formatTime } = useDialogDateTimeFormatter();
const selectedService = ref(null);
const userId = ref(null);
const email = ref(null);
const firstName = ref(null);
const lastName = ref(null);
const phoneNumber = ref(null);
const selectedEvent = ref(null);
const isPending = ref(false);
const { loading, startLoading, stopLoading } = useLoading();
const pickedStart = ref(null);
const pickedEnd = ref(null);
const pickedDuration = ref(0);

// Reference to the FullCalendar instance
const calendarRef = ref(null);
const { reactiveAspectRatio, reactiveInitialView, xs, sm, md, lg, xl, xxl } =
  useCalendarViewSettings(calendarRef);

// Calendar Options
const calendarOptions = useCalendarOptions({
  locale,
  reactiveInitialView,
  reactiveAspectRatio,
  modifying,
  xs,
  calendarEvents,
  handleEventDrop,
  handleEventClick,
  enableModification,
  showModificationModal,
  resetModifications,
  handleDateClick,
});

const { fetchAllEvents, fetchServices, fetchBusinessHours } = useEventFetcher(
  calendarEvents,
  services,
  calendarOptions
);

// A useDialogManager-nek átadjuk a szükséges függőségeket
const deps = {
  selectedEvent,
  calendarEvents,
  fetchAllEvents,
  closeEventDialog,
  showToast,
};

const {
  // Reaktív állapotok
  isDeleteModalOpen,
  actionType,
  modalTitle,
  modalMessage,
  showModificationDialog,
  showFirstDialog,
  showConfirmationDialog,
  showEventDialog,
  // Függvények
  openDeleteModal,
  closeDeleteModal,
  handleConfirm,
} = useDialogManager(deps);

// Event Handlers
function handleEventDrop(info) {
  const modifiedEvent = {
    id: info.event.id,
    firstName: info.event.firstName,
    lastName: info.event.lastName,
    modifiedTitle: info.event.title,
    modifiedEventDate: info.event.start.toISOString(),
    newStart: info.event.start.toISOString(),
    newEnd: info.event.end.toISOString(),
    reserving_user_id: info.event.extendedProps.reserving_user_id,
    firstName: info.event.extendedProps.firstName,
    lastName: info.event.extendedProps.lastName,
  };

  const existingEventIndex = modifiedEvents.value.findIndex(
    (event) => event.id === info.event.id
  );

  if (existingEventIndex !== -1) {
    // Update modified event
    modifiedEvents.value[existingEventIndex] = modifiedEvent;
  } else {
    // Add new modified event
    modifiedEvents.value.push(modifiedEvent);
  }
}

function handleDateClick(arg) {
  const clickedDate = new Date(arg.date);
  const dayOfWeek = clickedDate.getDay();
  const clickedTime = clickedDate.toISOString().slice(11, 16); // Extract the time in HH:mm format

  // Check if the clicked time falls within the business hours for that day
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
    selectedService.value = null;
    showFirstDialog.value = true;
  } else {
    showToast("This time slot is outside of business hours.", "error");
  }
}

function handleEventClick(info) {
  console.log(info.event);
  selectedEvent.value = info.event;
  console.log("ITTT: " + deps.selectedEvent.value.id);
  showEventDialog.value = true;
}

function closeEventDialog() {
  showEventDialog.value = false;
  // selectedEvent.value = {};
  fetchAllEvents();
}

function clearSelectedEvent() {
  selectedEvent.value = {}; // Reset selectedEvent after the dialog is fully closed
  isPending.value = false; // Reset the pending flag
}

// Lifecycle Hook
onMounted(async () => {
  if (calendarRef.value) {
    // Set the initial view when the component is mounted
    calendarRef.value.getApi().changeView(reactiveInitialView.value);
    console.log(`Initial view set to: ${reactiveInitialView.value}`);
  }

  await fetchUserId();
  await fetchAllEvents();
  await fetchServices();
  await fetchBusinessHours();
});

// Methods
async function fetchUserId() {
  if (!token) {
    showToast("You are not logged in. Please log in again.", "info");
    return;
  }

  const payload = JSON.parse(atob(token.split(".")[1]));
  const currentTime = Math.floor(Date.now() / 1000);

  if (payload.exp < currentTime) {
    showToast("Session expired. Please log in again.", "info");
    sessionStorage.removeItem("accessToken"); // Clear token on expiration
    sessionStorage.removeItem("role"); // Clear user role as well if needed
    return;
  }

  startLoading();
  try {
    const response = await apiClient.get(
      "http://localhost:5000/api/users/loggedInUser",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // Assuming the API response returns user details in response.data
    userId.value = response.data.userId;
    email.value = response.data.email;
    firstName.value = response.data.firstName;
    lastName.value = response.data.lastName;
    phoneNumber.value = response.data.phoneNumber;
  } catch (error) {
    console.log("Error fetching user ID: " + error.message);
    showToast("Error fetching user ID: " + error.message, "error");
  } finally {
    stopLoading();
  }
}

// Enabling modification by saving original events before edits
function enableModification() {
  originalEvents.value = JSON.parse(JSON.stringify(calendarOptions.events));
  console.log("Eredeti eventek: ", originalEvents.value);
  calendarOptions.editable = true;
  modifying.value = true;
}

function showModificationModal() {
  if (modifiedEvents.value.length > 0) {
    showModificationDialog.value = true;
  } else {
    showToast("No events have been modified.", "info");
  }
}

async function confirmModifications() {
  startLoading();
  if (!token) {
    showToast(
      "Nem vagy bejelentkezve. Kérlek lépj be a folytatáshoz.",
      "error"
    );
    stopLoading();
    return;
  }

  console.log("ModifiedEventek:", modifiedEvents.value);

  try {
    await apiClient.post(
      "http://localhost:5000/api/events/updateConfirmedEvents",
      modifiedEvents.value,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    showToast("Sikeres módosítás!", "success");
    resetModifications();
  } catch (error) {
    showToast(
      "Módosítások mentése sikertelen. Kérlek próbáld újra. " +
        (error.response?.data?.message || error.message),
      "error"
    );
  } finally {
    stopLoading();
  }
}

// Reset modifications and restore original events
function discardModifications() {
  calendarOptions.events = JSON.parse(JSON.stringify(originalEvents.value));
  resetModifications();
}

// Reset modifications after changes are confirmed or discarded
function resetModifications() {
  showModificationDialog.value = false;
  modifiedEvents.value = [];
  calendarOptions.editable = false;
  modifying.value = false;
  fetchAllEvents();
}

function closeModificationDialog() {
  showModificationDialog.value = false;
}

function closeDialog() {
  showFirstDialog.value = false;
  showConfirmationDialog.value = false;
  selectedSlot.value = {};
  selectedService.value = null;
}

function checkOverlap() {
  if (!selectedService.value) {
    showToast("Kérlek válassz szolgáltatást.", "warning");
    return;
  }

  pickedDuration.value = selectedService.value.duration;
  const startTime = new Date(selectedSlot.value.date);
  pickedStart.value = startTime;
  pickedEnd.value = new Date(
    startTime.getTime() + pickedDuration.value * 60000
  );

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

// Method to find the original event based on the ID of the modified event
function getOriginalEvent(eventId) {
  console.log("Selected Event ID for getOriginalEvent:", eventId);
  const originalEvent = originalEvents.value.find(
    (event) => String(event.id) === String(eventId)
  );
  console.log("getOriginalEvent() - Event ID:", eventId);
  console.log("getOriginalEvent() - Original Event:", originalEvent);
  return originalEvent;
  s;
}

async function finalizeBooking() {
  const durationInMinutes = parseInt(selectedService.value.duration, 10);
  const startTime = new Date(selectedSlot.value.date);
  const endTime = new Date(startTime.getTime() + durationInMinutes * 60000);
  const dayOfWeek = startTime.getDay();
  const startTimeFormatted = startTime.toISOString().slice(11, 16); // Get start time in HH:mm
  const endTimeFormatted = endTime.toISOString().slice(11, 16); // Get end time in HH:mm

  // Check if the start and end times are within the business hours for the day
  const isWithinBusinessHours = calendarOptions.businessHours.some(
    (businessHour) => {
      if (businessHour.daysOfWeek.includes(dayOfWeek)) {
        return (
          startTimeFormatted >= businessHour.startTime &&
          endTimeFormatted <= businessHour.endTime
        );
      }
      return false;
    }
  );

  if (!isWithinBusinessHours) {
    showToast("The selected time is outside of business hours.", "error");
    return; // Prevent booking if the event is outside business hours
  }

  const newEvent = {
    service_id: selectedService.value.id,
    event_date: selectedSlot.value.date,
    event_start: startTime.toISOString(),
    event_end: endTime.toISOString(),
    user_id: userId.value,
  };

  startLoading();
  try {
    // Make the API request to book the event
    await apiClient.post(
      "http://localhost:5000/api/events/requestAppointment",
      newEvent,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // Add the new event to the calendar
    calendarOptions.events.push(newEvent);
    showToast(
      `Appointment for ${selectedService.value.title} successfully requested!`
    );

    await fetchAllEvents();
    showConfirmationDialog.value = false;
  } catch (error) {
    // Handle the 403 error when the user exceeds the 3 pending events limit
    if (error.response && error.response.status === 429) {
      showToast(
        "You already have 3 pending events. Please wait for one to be confirmed before booking a new one.",
        "warning"
      );
    } else {
      showToast(
        "There was an error booking your appointment. Please try again." +
          error.message,
        "error"
      );
    }
  } finally {
    stopLoading();
  }
}
</script>

<template>
  <div class="pa-8">
    <v-progress-linear
      v-if="loading"
      indeterminate
      color="primary"
      class="mb-4"
    ></v-progress-linear>
    <FullCalendar ref="calendarRef" :options="calendarOptions" class="h-auto" />

    <!-- Modal for Confirming Modifications -->
    <v-dialog v-model="showModificationDialog" max-width="600" persistent>
      <v-card class="bg-garrisons text-garrisons">
        <v-card-title class="">
          <h2 class="headline title-garrisons">
            <span class="mdi mdi-book-search-outline"></span>
            {{ t("dashboard.manageEvents.dialog.confirmChanges") }}
          </h2>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <h3 class="text-garrisons">
            {{ t("dashboard.manageEvents.dialog.modifiedEvents") }}
          </h3>
          <ul class="pa-5 larger text-garrisons">
            <li v-for="event in modifiedEvents" :key="event.id" class="pb-3">
              <strong>
                {{ event.firstName + " " + event.lastName + ", " }}
                {{ event.modifiedTitle }}</strong
              ><br />
              <span>{{
                t("dashboard.manageEvents.dialog.originalEventDetails")
              }}</span>
              <span v-if="getOriginalEvent(event.id)" class="text-red">
                {{ formatDate(getOriginalEvent(event.id).start) }} -
                {{ formatTime(getOriginalEvent(event.id).start) }} to
                {{ formatTime(getOriginalEvent(event.id).end) }} </span
              ><br />
              <span>{{
                t("dashboard.manageEvents.dialog.modifiedEventDetails")
              }}</span>
              <span class="text-green">
                {{ formatDate(event.newStart) }} -
                {{ formatTime(event.newStart) }} to
                {{ formatTime(event.newEnd) }}
              </span>
            </li>
          </ul>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn
            density="comfortable"
            :disabled="loading"
            @click="closeModificationDialog"
            >{{ t("dashboard.manageEvents.dialog.button.close") }}</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn
            density="comfortable"
            :disabled="loading"
            @click="discardModifications"
            class="bg-red text-garrisons"
            >{{ t("dashboard.manageEvents.dialog.button.discard") }}</v-btn
          >
          <v-btn
            density="comfortable"
            :disabled="loading"
            class="bg-green text-garrisons"
            @click="confirmModifications"
            >{{ t("dashboard.manageEvents.dialog.button.save") }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

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
            Kérlek válassz egy szolgáltatást az időpont kalkuláláshoz!
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
            density="comfortable"
            :disabled="loading"
            class="text-garrisons"
            variant="tonal"
            @click="closeDialog"
            >{{ t("dialog.button.cancel") }}</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn
            density="comfortable"
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
          <h2 class="headline title-garrisons py-2">Foglalás kérvényezése</h2>
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
            {{ pickedDuration }} perc
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
            density="comfortable"
            :disabled="loading"
            class="text-garrisons"
            variant="tonal"
            @click="confirmationDialogCancel"
            >{{ t("dialog.button.cancel") }}</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn
            density="comfortable"
            :disabled="loading"
            class="text-garrisons bg-green"
            @click="finalizeBooking"
            >{{ t("dialog.button.requestBook") }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="showEventDialog"
      max-width="600"
      @close="clearSelectedEvent"
    >
      <v-card class="bg-garrisons text-garrisons">
        <v-card-title>
          <h2 class="headline title-garrisons py-2">
            <span class="mdi mdi-information-outline"></span>
            {{
              selectedEvent.extendedProps.firstName +
              " " +
              selectedEvent.extendedProps.lastName +
              ", " +
              formatDate(selectedEvent.start) +
              " " +
              formatTime(selectedEvent.start) +
              " - " +
              formatTime(selectedEvent.end) +
              ", " +
              selectedEvent.title
            }}
          </h2>
        </v-card-title>
        <v-divider class="mx-3"></v-divider>
        <v-card-text>
          <p>
            <span class="mdi mdi-account-circle-outline"></span>
            {{
              selectedEvent.extendedProps.firstName +
              " " +
              selectedEvent.extendedProps.lastName
            }}
          </p>
          <p>
            <span class="mdi mdi-email-outline"></span>
            {{ selectedEvent.extendedProps.email }}
          </p>
          <p>
            <span class="mdi mdi-phone-outline"></span>
            {{ selectedEvent.extendedProps.phoneNumber }}
          </p>
          <div class="py-2"></div>

          <p>
            <span class="mdi mdi-calendar-question-outline"></span>
            {{ formatDate(selectedEvent.start) }}
          </p>
          <p>
            <span class="mdi mdi-calendar-start-outline"></span>
            {{ formatTime(selectedEvent.start) }} -
            <span class="mdi mdi-calendar-end-outline"></span>
            {{ formatTime(selectedEvent.end) }},
            <span class="mdi mdi-timer-sand"></span>
            {{ selectedEvent.extendedProps.service_duration }} minutes
          </p>

          <p>
            <span class="mdi mdi-content-cut"></span>
            {{ selectedEvent.title }} -
            <span class="mdi mdi-cash-multiple"></span>
            {{ selectedEvent.extendedProps.price }} HUF
          </p>
          <div class="py-2 w-50"></div>
          <p v-if="selectedEvent.extendedProps.reserved_at">
            <strong
              ><span class="mdi mdi-timer-plus-outline"></span> Foglalást
              leadta:</strong
            >
            {{
              formatDate(selectedEvent.extendedProps.reserved_at) +
              ", " +
              formatTime(
                selectedEvent.extendedProps.reserved_at,
                "Europe/Budapest"
              )
            }}
          </p>

          <p v-else-if="selectedEvent.extendedProps.confirmed_at">
            <strong
              ><span class="mdi mdi-timer-check-outline"></span> Foglalás
              megerősítve:</strong
            >
            {{
              formatDate(selectedEvent.extendedProps.confirmed_at) +
              ", " +
              formatTime(
                selectedEvent.extendedProps.confirmed_at,
                "Europe/Budapest"
              )
            }}
          </p>
        </v-card-text>
        <v-divider class="mx-3"></v-divider>
        <v-card-actions class="ma-2">
          <template v-if="selectedEvent.extendedProps.reserved_at">
            <v-btn
              density="comfortable"
              :disabled="loading"
              class="text-garrisons"
              @click="closeEventDialog"
              >Bezár</v-btn
            >
            <v-spacer></v-spacer>
            <v-btn
              density="comfortable"
              :disabled="loading"
              class="text-garrisons bg-red"
              @click="openDeleteModal('deny')"
              >Elutasít</v-btn
            >
            <v-btn
              density="comfortable"
              :disabled="loading"
              class="text-garrisons bg-green"
              @click="confirmEvent"
              >Elfogad</v-btn
            >
          </template>

          <!-- Regular Close Button for Confirmed Event -->
          <template v-else-if="selectedEvent.extendedProps.confirmed_at">
            <v-btn
              density="comfortable"
              :disabled="loading"
              class="text-garrisons"
              @click="closeEventDialog"
              >Bezár</v-btn
            >
            <v-spacer></v-spacer>
            <v-btn
              density="comfortable"
              :disabled="loading"
              class="text-garrisons bg-red"
              @click="openDeleteModal('delete')"
              >Törlés</v-btn
            >
          </template>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Confirmation Modal Component -->
    <ConfirmDeleteModal
      :isOpen="isDeleteModalOpen"
      :title="modalTitle"
      :message="modalMessage"
      @cancel="closeDeleteModal"
      @confirm="handleConfirm"
      @update:isOpen="(val) => (isDeleteModalOpen = val)"
    />
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

.larger {
  font-size: larger;
}
</style>