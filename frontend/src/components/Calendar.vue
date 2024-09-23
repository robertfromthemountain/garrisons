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
            :item-value="service => service"
            item-text="title"
            label="Choose a service"
            outlined
            v-if="services.length > 0"
          ></v-select>
          <p v-else>No services available</p>

          <!-- Show selected service details reactively -->
          <div v-if="selectedService">
            <p><strong>Service:</strong> {{ selectedService.title }}</p>
            <p><strong>Duration:</strong> {{ selectedService.duration }} minutes</p>
            <p><strong>Price:</strong> {{ selectedService.price }}</p>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="bookService(selectedService)">Book</v-btn>
          <v-btn color="secondary" @click="closeDialog">Cancel</v-btn>
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
        weekends: false,
        locales: [huLocale, enLocale],
        locale: this.locale,
        plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
        slotEventOverlap: false,
        initialView: "timeGridDay",
        timeZone: "local",
        slotDuration: "00:30:00",
        slotMinTime: "08:00:00",
        slotMaxTime: "17:00:00",
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
      selectedSlot: {},
      services: [],
      selectedService: null, // To store the selected service
    };
  },
  mounted() {
    this.fetchEvents();
    this.fetchServices();
  },
  methods: {
    async fetchEvents() {
      try {
        const response = await axios.get("http://localhost:5000/api/events");
        this.calendarOptions.events = response.data;
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
      this.showDialog = false;
      this.selectedSlot = {};
      this.selectedService = null; // Reset selected service on dialog close
    },
    bookService(service) {
      if (!service) {
        alert("Please select a service.");
        return;
      }

      // Use the correct duration from the selected service
      const durationInMinutes = parseInt(service.duration, 10);
      const startTime = new Date(this.selectedSlot.date);
      const endTime = new Date(
        new Date(this.selectedSlot.date).getTime() + durationInMinutes * 60000
      );

      // Check for overlapping events
      const hasOverlap = this.calendarOptions.events.some((event) => {
        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);

        return startTime < eventEnd && endTime > eventStart; // Checking for overlap
      });

      if (hasOverlap) {
        alert("This time slot is already booked. Please choose another time.");
      } else {
        // Proceed with booking since there's no overlap
        const newEvent = {
          title: service.title,
          start: this.selectedSlot.date,
          end: endTime,
        };

        this.calendarOptions.events.push(newEvent);
        this.closeDialog();
        alert(`Appointment for ${service.title} successfully booked!`);
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
