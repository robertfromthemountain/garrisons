<script>
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import enLocale from "@fullcalendar/core/locales/en-gb";
import huLocale from "@fullcalendar/core/locales/hu";
import { useI18n } from "vue-i18n";
import axios from "axios";

export default {
  components: {
    FullCalendar, // make the <FullCalendar> tag available
  },
  setup() {
    const { locale } = useI18n(); // Get the current locale from i18n

    return {
      locale,
    };
  },
  data() {
    return {
      calendarOptions: {
        locales: [huLocale, enLocale],
        locale: this.locale,
        plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
        initialView: "timeGridDay",
        timeZone: "local",
        slotDuration: "00:30:00", // Adjust slot duration if needed
        slotMinTime: "08:00:00", // Start time
        slotMaxTime: "17:00:00", // End time
        slotLabelFormat: {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        },
        eventClick: (info) => {
          alert(`Event: ${info.event.title}`);
          // You can also navigate or perform other actions based on user selection
        },
        // buttonText: {
        //   prev: "Previous", // Custom text for the previous button
        //   next: "Next", // Custom text for the next button
        // },
        // buttonIcons: {
        //   prev: "custom-prev-icon", // Use a custom class for icons
        //   next: "custom-next-icon",
        // },
        headerToolbar: {
          //   left: "prev,next", // Buttons for previous and next
          //   center: "title", // Title
          //   right: "timeGridWeek,timeGridDay", // Change these according to your needs
        },

        weekends: false, // initial value
        // dateClick: this.handleDateClick,
        allDaySlot: false,
        defaultTimedEventDuration: "00:30",
        events: [],
      },
    };
  },
  mounted() {
    this.fetchEvents();
  },
  methods: {
    async fetchEvents() {
      try {
        const response = await axios.get("http://localhost:5000/api/events");
        this.calendarOptions.events = response.data; // Set fetched events
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    },
  },
};
</script>
<template>
  <div class="bg-dark-garrisons pa-8 elevation-5 rounded">
    <!-- <button @click="toggleWeekends">toggle weekends</button> -->
    <FullCalendar :options="calendarOptions" />
  </div>
</template>

<style scoped>
.bg {
  background-color: #26211e;
}
.bg-dark-garrisons {
  background-color: #201b18;
}
</style>