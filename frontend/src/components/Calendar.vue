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
        defaultTimedEventDuration: "00:30",
        events: [],
      },
      showDialog: false,
      selectedSlot: {},
      selectedService: null,
      services: [],
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
    },
    checkAndBookEvent() {
      if (!this.selectedService) {
        alert("Please select a service.");
        return;
      }

      // Check for overlap
      const hasOverlap = this.calendarOptions.events.some((event) => {
        return (
          new Date(event.start) <= new Date(this.selectedSlot.date) &&
          new Date(event.end) >= new Date(this.selectedSlot.date)
        );
      });

      if (hasOverlap) {
        alert("This time slot is already booked, please choose another one.");
      } else {
        // Use the correct duration from the selected service
        const durationInMinutes = parseInt(this.selectedService.duration, 10);
        const endTime = new Date(
          new Date(this.selectedSlot.date).getTime() + durationInMinutes * 60000
        ); // Calculate end time using service's duration

        console.log("ITT VAGYOK:", this.selectedService.title);
        // Insert the new event into FullCalendar
        const newEvent = {
          title: this.selectedService.title, // Use the correct title for the event
          start: this.selectedSlot.date,
          end: endTime,
        };
          // Add the new event to the calendar
          this.calendarOptions.events.push(newEvent);
        this.closeDialog();
        alert("Appointment successfully booked!");
      }
    },
  },
};
</script>

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
            item-value="id"
            item-text="title"
            label="Choose a service"
            outlined
            v-if="services.length > 0"
          ></v-select>
          <p v-else>No services available</p>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="checkAndBookEvent">Book</v-btn>
          <v-btn color="secondary" @click="closeDialog">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
  
  <style scoped>
.bg-dark-garrisons {
  background-color: #201b18;
}

.v-dialog {
  z-index: 1000;
}
</style>
  