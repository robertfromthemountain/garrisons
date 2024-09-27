<script>
import { ref, onMounted, reactive, computed } from "vue";
import { useStore } from "vuex";
import FullCalendar from "@fullcalendar/vue3";
import axios from "axios";
import { useI18n } from "vue-i18n";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import enLocale from "@fullcalendar/core/locales/en-gb";
import huLocale from "@fullcalendar/core/locales/hu";
import { useToast } from "vue-toastification";

export default {
  components: {
    FullCalendar,
  },
  setup() {
    // i18n
    const { locale, t } = useI18n();
    const toast = useToast();

    // Access the store using useStore()
    const store = useStore(); // Use Vuex store

    // Example usage in the rest of your code:
    const showToast = (message, type = "success") => {
      if (type === "success") toast.success(message);
      else if (type === "error") toast.error(message);
      else if (type === "warning") toast.warning(message);
      else if (type === "info") toast.info(message);
    };

    const handleError = (customMessage) => {
      showToast(customMessage, "error");
    };

    const handleEventDrop = (info) => {
      const modifiedEvent = {
        id: info.event.id,
        modifiedTitle: info.event.title,
        modifiedEventDate: info.event.start.toISOString(),
        newStart: info.event.start.toISOString(),
        newEnd: info.event.end.toISOString(),
        reserving_user_id: info.event.extendedProps.reserving_user_id,
      };

      const existingEventIndex = modifiedEvents.value.findIndex(
        (event) => event.id === info.event.id
      );

      if (existingEventIndex !== -1) {
        modifiedEvents.value[existingEventIndex] = modifiedEvent;
      } else {
        modifiedEvents.value.push(modifiedEvent);
      }
    };

    const handleDateClick = (arg) => {
      selectedSlot.value = {
        date: arg.dateStr,
        time: arg.dateStr,
      };
      selectedService.value = null;
      showFirstDialog.value = true;
    };

    const handleEventClick = (info) => {
      selectedEvent.value = info.event;
      showEventDialog.value = true;
    };

    const closeEventDialog = () => {
      showEventDialog.value = false;
      selectedEvent.value = {};
    };

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

    const calendarEvents = ref([]);

    // Reactive state
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
      eventDrop: handleEventDrop,
      eventClick: handleEventClick,
      aspectRatio: 2.5,
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

    // Other reactive state

    const originalEvents = ref([]);
    const modifiedEvents = ref([]);
    const modifying = ref(false);
    const showModificationDialog = ref(false);
    const showFirstDialog = ref(false);
    const showConfirmationDialog = ref(false);
    // Selected Slot retains raw date for backend
    const selectedSlot = ref({
      date: "", // Raw ISO string or Date object
      time: "", // This will store the time, possibly as an ISO string or timestamp
    });
    const services = ref([]);
    const selectedService = ref(null);
    const userId = ref(null);
    const email = ref(null);
    const firstName = ref(null);
    const lastName = ref(null);
    const showEventDialog = ref(false);
    const selectedEvent = ref({});

    // Lifecycle hooks
    onMounted(() => {
      fetchUserId();
      fetchEvents();
      fetchPendingEvents();
      fetchServices();
    });

    // Methods
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      if (isNaN(date)) {
        console.error("Invalid date provided:", dateString);
        // handleError("Invalid date provided: ", dateString)
        return "";
      }
      return new Intl.DateTimeFormat("hu-HU", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(date);
    };

    const formatTime = (dateString) => {
      const date = new Date(dateString);
      if (isNaN(date)) {
        console.error("Invalid date provided:", dateString);
        return "";
      }
      return new Intl.DateTimeFormat("hu-HU", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
      }).format(date);
    };

    const deleteEvent = async () => {
      if (confirm("Are you sure you want to delete this event?")) {
        try {
          const response = await axios.delete(
            `http://localhost:5000/api/deleteEvent/${selectedEvent.value.id}`,
            {
              headers: {
                Authorization: `Bearer ${store.getters.accessToken}`,
              },
            }
          );
          if (response.status !== 200) {
            throw new Error("Failed to delete event");
          }

          // Update the local events array to remove the deleted event
          const updatedEvents = calendarEvents.value.filter(
            (event) => event.id !== selectedEvent.value.id
          );

          // Trigger reactivity by assigning a new array
          calendarEvents.value = [...updatedEvents];

          // Close the event dialog and show success message
          closeEventDialog();
          showToast("Event deleted successfully");
        } catch (error) {
          handleError("Error deleting event: " + error.message);
        }
      }
    };

    const enableModification = () => {
      originalEvents.value = JSON.parse(JSON.stringify(calendarOptions.events));
      calendarOptions.editable = true;
      modifying.value = true;
    };

    const showModificationModal = () => {
      if (modifiedEvents.value.length > 0) {
        showModificationDialog.value = true;
      } else {
        showToast("No events have been modified.", "info");
      }
    };

    const confirmModifications = async () => {
      try {
        await axios.post(
          "http://localhost:5000/api/updateConfirmedEvents",
          modifiedEvents.value
        );
        showToast("Modifications saved successfully!");
        resetModifications();
      } catch (error) {
        // console.error("Error saving modifications:", error);
        handleError(
          "There was an error saving the modifications. Please try again." +
            error.message
        );
      }
    };

    const discardModifications = () => {
      calendarOptions.events = JSON.parse(JSON.stringify(originalEvents.value));
      resetModifications();
    };

    const fetchUserId = async () => {
      if (!store.getters.isLoggedIn) return;

      const token = store.getters.accessToken;
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Math.floor(Date.now() / 1000);

      if (payload.exp < currentTime) {
        showToast("Session expired. Please log in again.", "info");
        console.log("Token has expired");
        store.dispatch("logout");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        userId.value = response.data.userId;
        email.value = response.data.email;
        firstName.value = response.data.firstName;
        lastName.value = response.data.lastName;
      } catch (error) {
        handleError("Error fetching user ID:" + error.message);
      }
    };

    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/getEvents");
        calendarOptions.events = [...calendarOptions.events, ...response.data];
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    const fetchPendingEvents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/getPendingEvents2"
        );
        calendarOptions.events = [...calendarOptions.events, ...response.data];
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    const fetchServices = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/services");
        services.value = response.data;
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    const closeDialog = () => {
      showFirstDialog.value = false;
      showConfirmationDialog.value = false;
      selectedSlot.value = {};
      selectedService.value = null;
    };

    const checkOverlap = () => {
      if (!selectedService.value) {
        showToast("Please select a service.", "warning");
        return;
      }
      const durationInMinutes = parseInt(selectedService.value.duration, 10);
      const startTime = new Date(selectedSlot.value.date);
      const endTime = new Date(startTime.getTime() + durationInMinutes * 60000);
      const hasOverlap = calendarOptions.events.some((event) => {
        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);
        return startTime < eventEnd && endTime > eventStart;
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
    };

    const confirmationDialogCancel = () => {
      showConfirmationDialog.value = false;
    };

    const finalizeBooking = async () => {
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

      try {
        await axios.post("http://localhost:5000/api/requestEvent", newEvent, {
          headers: {
            Authorization: `Bearer ${store.getters.accessToken}`,
          },
        });

        calendarOptions.events.push(newEvent);
        showToast(
          `Appointment for ${selectedService.value.title} successfully booked!`
        );

        fetchPendingEvents();
        showConfirmationDialog.value = false;
      } catch (error) {
        // console.error("Error booking appointment:", error);
        handleError(
          "There was an error booking your appointment. Please try again." +
            error.message
        );
      }
    };

    const resetModifications = () => {
      console.log("RESET");
      showModificationDialog.value = false;
      modifiedEvents.value = [];
      calendarOptions.editable = false;
      modifying.value = false;
      fetchEvents();
    };

    return {
      locale,
      t,
      calendarOptions,
      calendarEvents,
      originalEvents,
      modifiedEvents,
      modifying,
      showModificationDialog,
      showFirstDialog,
      showConfirmationDialog,
      selectedSlot,
      services,
      selectedService,
      userId,
      email,
      firstName,
      lastName,
      showEventDialog,
      selectedEvent,
      enableModification,
      showModificationModal,
      confirmModifications,
      discardModifications,
      handleEventClick,
      handleEventDrop,
      fetchUserId,
      fetchEvents,
      fetchPendingEvents,
      fetchServices,
      handleDateClick,
      closeEventDialog,
      deleteEvent,
      closeDialog,
      checkOverlap,
      confirmationDialogCancel,
      finalizeBooking,
      resetModifications,
      showToast,
      handleError,
      formattedDate,
      formattedTime,
    };
  },
};
</script>

<template>
  <div class="pa-8">
    <!-- Modification controls -->
    <div v-if="!modifying" class="d-flex align-center justify-start">
      <v-btn
        @click="enableModification"
        class="elevation-8 btn-garrisons text-white"
      >
        {{ t("button.calendarEdit") }}
      </v-btn>
    </div>
    <div v-if="modifying" class="d-flex align-center justify-start">
      <v-btn
        class="elevation-8 bg-red-darken-1 text-garrisons"
        @click="resetModifications"
      >
        {{ t("dialog.button.cancel") }}
      </v-btn>
      <div class="mx-2"></div>
      <v-btn
        class="elevation-8 bg-green text-garrisons"
        @click="showModificationModal"
      >
        {{ t("dialog.button.save") }}
      </v-btn>
    </div>

    <FullCalendar :options="calendarOptions" class="h-auto" />

    <!-- Modal for Confirming Modifications -->
    <v-dialog v-model="showModificationDialog" max-width="600" persistent>
      <v-card class="bg-garrisons text-garrisons">
        <v-card-title>
          <h2 class="headline title-garrisons">
            {{ t("dialog.confirmChanges") }}
          </h2>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <h3>{{ t("dialog.modifiedEvents") }}</h3>
          <ul>
            <li v-for="event in modifiedEvents" :key="event.id">
              <strong>{{ event.modifiedTitle }}</strong
              ><br />
              Original: {{ event.originalEventDate }}
              {{ event.originalStart }} - {{ event.originalEnd }}<br />
              Modified: {{ event.modifiedEventDate }} {{ event.newStart }} -
              {{ event.newEnd }}
            </li>
          </ul>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn @click="discardModifications">{{
            t("dialog.button.discard")
          }}</v-btn>
          <v-spacer></v-spacer>
          <v-btn
            class="bg-green text-garrisons"
            @click="confirmModifications"
            >{{ t("dialog.button.modify") }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showFirstDialog" max-width="500">
      <v-card class="bg-garrisons text-garrisons">
        <v-card-title>
          <h2 class="headline title-garrisons">
            {{ t("dialog.bookDialog.title1") }}
          </h2>
        </v-card-title>
        <v-divider class="mx-3"></v-divider>
        <v-card-text>
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
            <strong>{{ t("dialog.date") }}</strong>
            {{ formattedDate }}
          </p>
          <p class="pb-2">
            <strong>{{ t("dialog.time") }}</strong>
            {{ formattedTime }}
          </p>
          <div v-if="selectedService">
            <p v-if="$store.getters.isLoggedIn">
              <strong>Logged in user ID (ONLY FOR DEBUG):</strong> {{ userId }}
            </p>
            <p v-if="$store.getters.isLoggedIn">
              <strong>{{ t("dialog.userName") }}</strong>
              {{ firstName + " " + lastName }}
            </p>
            <p v-if="$store.getters.isLoggedIn" class="pb-2">
              <strong>{{ t("dialog.userEmail") }}</strong> {{ email }}
            </p>
            <p>
              <strong>{{ t("dialog.service") }}</strong>
              {{ selectedService.title }}
            </p>
            <p>
              <strong>{{ t("dialog.duration") }}</strong>
              {{ selectedService.duration }} {{ t("dialog.duration2") }}
            </p>
            <p>
              <strong>{{ t("dialog.price") }}</strong>
              {{ selectedService.price }} {{ t("dialog.price2") }}
            </p>
          </div>
        </v-card-text>
        <v-divider class="mx-3"></v-divider>
        <v-card-actions class="ma-2">
          <v-btn class="text-garrisons" variant="tonal" @click="closeDialog">{{
            t("dialog.button.cancel")
          }}</v-btn>
          <v-spacer></v-spacer>
          <v-btn class="text-garrisons bg-green" @click="checkOverlap">{{
            t("dialog.button.next")
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showConfirmationDialog" max-width="500" persistent>
      <v-card class="bg-garrisons text-garrisons">
        <v-card-title>
          <h2 class="headline title-garrisons">
            {{ t("dialog.bookDialog.title1") }}
          </h2>
        </v-card-title>
        <v-divider class="mx-3"></v-divider>
        <v-card-text>
          <p>
            <strong>{{ t("dialog.userName") }}</strong>
            {{ firstName + " " + lastName }}
          </p>
          <p>
            <strong>{{ t("dialog.userEmail") }}</strong> {{ email }}
          </p>
          <p>
            <strong>{{ t("dialog.userPhone") }}</strong> {{ phone }}
          </p>
          <p>
            <strong>{{ t("dialog.service") }}</strong>
            {{ selectedService.title }}
          </p>
          <p>
            <strong>{{ t("dialog.date") }}</strong>
            {{ formattedDate }}
          </p>
          <p>
            <strong>{{ t("dialog.time") }}</strong>
            {{ formattedTime }}
          </p>
          <p>
            <strong>{{ t("dialog.price") }}</strong>
            {{ selectedService.price }} {{ t("dialog.price2") }}
          </p>
        </v-card-text>
        <v-divider class="mx-3"></v-divider>
        <v-card-actions class="ma-2">
          <v-btn
            class="text-garrisons"
            variant="tonal"
            @click="confirmationDialogCancel"
            >{{ t("dialog.button.cancel") }}</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn class="text-garrisons bg-green" @click="finalizeBooking">{{
            t("dialog.button.requestBook")
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showEventDialog" max-width="500">
      <v-card>
        <v-card-title>
          <span class="headline">Event Details</span>
        </v-card-title>
        <v-card-text>
          <p><strong>Title:</strong> {{ selectedEvent.title }}</p>
          <p><strong>Date:</strong> {{ selectedEvent.start }}</p>
          <p><strong>Time:</strong> {{ selectedEvent.end }}</p>
          <p>
            <strong>Duration:</strong>
            minutes
          </p>
          <p><strong>Price:</strong></p>
          <p>
            <strong>Reserved by User ID:</strong>
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" @click="closeEventDialog">Close</v-btn>
          <v-btn color="red" @click="deleteEvent">Delete</v-btn>
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
</style>
  