<template>
  <div class="bg-dark-garrisons pa-8 elevation-5 rounded">
    <!-- FullCalendar component -->
    <FullCalendar :options="calendarOptions" />

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
            {{ selectedSlot.usableDate }}
          </p>
          <p class="pb-2">
            <strong>{{ t("dialog.time") }}</strong>
            {{ selectedSlot.usableTime }}
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

    <v-dialog v-model="showConfirmationDialog" max-width="500">
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
            {{ selectedSlot.usableDate }}
          </p>
          <p>
            <strong>{{ t("dialog.time") }}</strong>
            {{ selectedSlot.usableTime }}
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
  </div>
</template>


<script>
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import enLocale from "@fullcalendar/core/locales/en-gb";
import huLocale from "@fullcalendar/core/locales/hu";
import axios from "axios";
import { useI18n } from "vue-i18n";

export default {
  components: {
    FullCalendar,
  },
  setup() {
    const { locale, t } = useI18n();
    return {
      locale,
      t,
    };
  },
  data() {
    return {
      calendarOptions: {
        timeZone: "UTC",
        weekends: false,
        locales: [huLocale, enLocale],
        locale: this.locale,
        plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
        slotEventOverlap: false,
        initialView: "timeGridDay",
        slotDuration: "00:30:00",
        slotMinTime: "08:00:00",
        slotMaxTime: "17:00:00",
        nowIndicator: true,
        headerToolbar: {
          left: "",
          center: "title",
          right: "",
        },
        footerToolbar: {
          left: "prev",
          center: "today",
          right: "next",
        },
        slotLabelFormat: {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        },
        dateClick: this.handleDateClick,
        allDaySlot: false,
        events: [],
      },
      showFirstDialog: false,
      showConfirmationDialog: false,
      selectedSlot: {},
      services: [],
      selectedService: null, // To store the selected service
      userId: null,
      email: null,
      firstName: null,
      lastName: null,
    };
  },
  mounted() {
    this.fetchUserId();
    this.fetchEvents();
    this.fetchServices();
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString);
      if (isNaN(date)) {
        console.error('Invalid date provided:', dateString);
        return ''; // or return a fallback value
      }
      return new Intl.DateTimeFormat('hu-HU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(new Date(date));
    },
    formatTime(dateString) {
      const date = new Date(dateString);
      if (isNaN(date)) {
        console.error('Invalid date provided:', dateString);
        return ''; // or return a fallback value
      }
      return new Intl.DateTimeFormat('hu-HU', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC'
      }).format(new Date(date));
    },
    async fetchUserId() {
      if (!this.$store.getters.isLoggedIn) return; // Check if logged in
      console.log("Access Token:", this.$store.getters.accessToken);
      const token = this.$store.getters.accessToken;
      const payload = JSON.parse(atob(token.split(".")[1]));

      // Check expiration time
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      if (payload.exp < currentTime) {
        console.log("Token has expired");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/user", {
          headers: {
            Authorization: `Bearer ${this.$store.getters.accessToken}`,
          },
        });
        this.userId = response.data.userId; // Store user ID in component data
        this.email = response.data.email; // Store user ID in component data
        this.firstName = response.data.firstName; // Store user ID in component data
        this.lastName = response.data.lastName; // Store user ID in component data
      } catch (error) {
        console.error("Error fetching user ID:", error);
        // Handle errors appropriately (e.g., logout if token is invalid)
      }
    },

    async fetchEvents() {
      try {
        const response = await axios.get("http://localhost:5000/api/getEvents");
        this.calendarOptions.events = response.data;
        console.log("ERTERTERT", this.calendarOptions.events);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    },
    async fetchServices() {
      try {
        const response = await axios.get("http://localhost:5000/api/services");
        this.services = response.data;
        console.log("Fetched services:", this.services);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    },
    handleDateClick(arg) {
      this.selectedSlot = {
        date: arg.dateStr,
        time: arg.dateStr,
        usableDate: this.formatDate(arg.dateStr),
        usableTime: this.formatTime(arg.dateStr),
      };
      this.selectedService = null;
      this.showFirstDialog = true;
    },
    closeDialog() {
      this.showConfirmationDialog = false; // Close confirmation dialog
      this.showFirstDialog = false; // Close the initial booking dialog
      this.selectedSlot = {}; // Reset selected slot
      this.selectedService = null; // Reset selected service
    },

    checkOverlap() {
      if (!this.selectedService) {
        alert("Please select a service.");
        return;
      }
      const durationInMinutes = parseInt(this.selectedService.duration, 10);
      const startTime = new Date(this.selectedSlot.date);
      const endTime = new Date(startTime.getTime() + durationInMinutes * 60000);
      // Check for overlapping events
      const hasOverlap = this.calendarOptions.events.some((event) => {
        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);
        return startTime < eventEnd && endTime > eventStart; // Checking for overlap
      });

      if (hasOverlap) {
        alert("This time slot is already booked. Please choose another time.");
      } else {
        this.showConfirmationDialog = true;
        this.showDialog = false;
      }
    },

    confirmationDialogCancel() {
      this.showConfirmationDialog = false;
    },

    async finalizeBooking() {
      const durationInMinutes = parseInt(this.selectedService.duration, 10);
      const startTime = new Date(this.selectedSlot.date);
      const endTime = new Date(startTime.getTime() + durationInMinutes * 60000);

      const newEvent = {
        pending_service_title: this.selectedService.title,
        pending_date: this.selectedSlot.date,
        pending_start_of_event: startTime.toISOString(),
        pending_end_of_event: endTime.toISOString(),
        user_id: this.userId,
      };

      try {
        await axios.post("http://localhost:5000/api/requestEvent", newEvent, {
          headers: {
            Authorization: `Bearer ${this.$store.getters.accessToken}`,
          },
        });

        // Update the events in the calendar
        this.calendarOptions.events.push(newEvent);
        alert(
          `Appointment for ${this.selectedService.title} successfully booked!`
        );

        this.showConfirmationDialog = false;
        // Close the confirmation dialog
      } catch (error) {
        console.error("Error booking appointment:", error);
        alert("There was an error booking your appointment. Please try again.");
      }
    },
  },
};
</script>

<style scoped>
.bg-dark-garrisons {
  background-color: #201b18;
}

.v-dialog {
  z-index: 1000;
}
</style>
