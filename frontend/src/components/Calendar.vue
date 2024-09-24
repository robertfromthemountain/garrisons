<template>
  <div class="bg-dark-garrisons pa-8 elevation-5 rounded">
    <!-- FullCalendar component -->
    <FullCalendar :options="calendarOptions" />

    <!-- Vuetify Dialog -->
    <v-dialog v-model="showDialog" max-width="500">
      <v-card>
        <v-card-title>
          <span class="headline">Book an Appointment</span>
        </v-card-title>

        <v-card-text>
          <p><strong>Date:</strong> {{ selectedSlot.date }}</p>
          <p><strong>Time:</strong> {{ selectedSlot.time }}</p>

          <!-- Vuetify Select for services -->
          <v-select
            v-model="selectedService"
            :items="services"
            :item-value="(service) => service"
            item-text="title"
            label="Choose a service"
            outlined
            v-if="services.length > 0"
          ></v-select>
          <p v-else>No services available</p>

          <!-- Show selected service details reactively -->
          <div v-if="selectedService">
            <p><strong>Service:</strong> {{ selectedService.title }}</p>
            <p>
              <strong>Duration:</strong> {{ selectedService.duration }} minutes
            </p>
            <p><strong>Price:</strong> {{ selectedService.price }}</p>
            <p v-if="$store.getters.isLoggedIn">
              <strong>Logged in user ID:</strong> {{ userId }}
            </p>
            <p v-if="$store.getters.isLoggedIn">
              <strong>Name:</strong> {{ firstName + " " + lastName }}
            </p>
            <p v-if="$store.getters.isLoggedIn">
              <strong>Email:</strong> {{ email }}
            </p>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="checkOverlap">Next</v-btn>
          <v-btn color="secondary" @click="closeDialog">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Second Vuetify Dialog for confirmation -->
    <v-dialog v-model="showConfirmationDialog" max-width="500">
      <v-card>
        <v-card-title>
          <span class="headline">Confirm Your Appointment</span>
        </v-card-title>
        <v-card-text>
          <p><strong>Name:</strong> {{ firstName + " " + lastName }}</p>
          <p><strong>Email:</strong> {{ email }}</p>
          <p><strong>Phone:</strong> {{ phone }}</p>
          <p><strong>Service:</strong> {{ selectedService.title }}</p>
          <p><strong>Date:</strong> {{ selectedSlot.date }}</p>
          <p><strong>Time:</strong> {{ selectedSlot.time }}</p>
          <p><strong>Price:</strong> {{ selectedService.price }}</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="finalizeBooking">Book</v-btn>
          <v-btn color="secondary" @click="showConfirmationDialog = false"
            >Cancel</v-btn
          >
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
    const { locale } = useI18n();
    return {
      locale,
    };
  },
  data() {
    return {
      calendarOptions: {
        timeZone: 'UTC',
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
          left:"",
          center: "title",
          right:""
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
      showDialog: false,
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
    async fetchUserId() {
      if (!this.$store.getters.isLoggedIn) return; // Check if logged in
      console.log("Access Token:", this.$store.getters.accessToken);
      const token = this.$store.getters.accessToken;
      const payload = JSON.parse(atob(token.split(".")[1]));
      console.log("TOKEEEEEEEEEEEEN:", payload);

      // Check expiration time
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      if (payload.exp < currentTime) {
        console.log("Token has expired");
      } else {
        console.log("Token is still valid");
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
        console.log("ITT A USERID:", this.userId);
        // console.log("ITT A firstname:", this.firstName);
        // console.log("ITT A lastName:", this.lastName);
        // console.log("ITT A email:", this.email);
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
        time: arg.date.toLocaleTimeString(),
      };
      this.showDialog = true;
    },
    closeDialog() {
      this.showConfirmationDialog = false; // Close confirmation dialog
      this.showDialog = false; // Close the initial booking dialog
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
