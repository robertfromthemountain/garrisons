import axios from "axios";
import { useI18n } from "vue-i18n";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import enLocale from "@fullcalendar/core/locales/en-gb";
import huLocale from "@fullcalendar/core/locales/hu";

export default {
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
        locale: this.$i18n.locale,
        plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
        slotEventOverlap: false,
        initialView: "timeGridWeek",
        slotDuration: "00:15:00",
        slotMinTime: "08:00:00",
        slotMaxTime: "17:00:00",
        editable: false,
        eventDrop: this.handleEventDrop,
        eventClick: this.handleEventClick,
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
        dateClick: this.handleDateClick,
        allDaySlot: false,
        events: [],
      },
      modifying: false,
      modifiedEvents: [],
      originalEvents: [],
      showFirstDialog: false,
      showConfirmationDialog: false,
      selectedSlot: {},
      services: [],
      selectedService: null,
      userId: null,
      email: null,
      firstName: null,
      lastName: null,
      showEventDialog: false,  // New property for event dialog
      selectedEvent: {},
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
        minute: '2-digit'
      }).format(new Date(date));
    },
    handleEventClick(info) {
      // Set the selected event details
      console.log("ITT VAGYOOOOOK")
      this.selectedEvent = info.event;

      // Show the event details dialog
      this.showEventDialog = true;
    },
    closeEventDialog() {
      this.showEventDialog = false;
      this.selectedEvent = {};  // Reset selected event when closing
    },
    async deleteEvent() {
      if (confirm("Are you sure you want to delete this event?")) {
        try {
          console.log("EZ A KIVALASZTOTT EVENT IDJE AMIT TOTOLNI KELL:", this.selectedEvent.id)
          const response = await axios.delete(`http://localhost:5000/api/deleteEvent/${this.selectedEvent.id}`, {
            headers: {
              Authorization: `Bearer ${this.$store.getters.accessToken}`,
            },
          });

          if (response.status !== 200) {
            throw new Error('Failed to delete event');
          }

          // Emit an event to refresh the events list or remove the event from local state
          this.closeEventDialog();
          alert('Event deleted successfully');
          window.location.reload();
        } catch (error) {
          console.error('Error deleting event:', error);
          alert('Error deleting event: ' + error.message);
        }
      }
    },

    enableModification() {
      this.originalEvents = JSON.parse(
        JSON.stringify(this.calendarOptions.events)
      );
      this.calendarOptions.editable = true;
      this.modifying = true;
    },
    async saveModifications() {
      const modifiedEventsData = this.modifiedEvents.map((event) => {
        const reservingUserId = event.reserving_user_id;

        return {
          modified_event_id: event.id,
          modified_service_title: event.modifiedTitle,
          original_event_date: event.originalEventDate,
          modified_event_date: event.newStart,
          original_event_start: event.originalStart,
          modified_event_start: event.newStart,
          original_event_end: event.originalEnd,
          modified_event_end: event.newEnd,
          modified_reserving_user_id: reservingUserId,
        };
      });

      try {
        await axios.post(
          "http://localhost:5000/api/saveModifiedEvents",
          modifiedEventsData,
          {
            headers: {
              Authorization: `Bearer ${this.$store.getters.accessToken}`,
            },
          }
        );

        alert("Modified events saved successfully!");
        this.calendarOptions.editable = false;
        this.modifying = false;
        this.modifiedEvents = [];
        this.fetchEvents();
      } catch (error) {
        console.error("Error saving modified events:", error);
        alert(
          "There was an error saving the modified events. Please try again."
        );
      }
    },
    cancelModifications() {
      this.calendarOptions.events = this.originalEvents;
      this.modifiedEvents = [];
      this.calendarOptions.editable = false;
      this.modifying = false;
    },
    handleEventDrop(info) {
      const originalEvent = {
        id: info.event.id,
        originalTitle: info.oldEvent.title,
        originalEventDate: info.event.extendedProps.confirmed_event_date,
        originalStart: info.oldEvent.start.toISOString(),
        originalEnd: info.oldEvent.end.toISOString(),
        reserving_user_id: info.event.extendedProps.reserving_user_id,
      };

      const modifiedEvent = {
        id: info.event.id,
        modifiedTitle: info.event.title,
        modifiedEventDate: info.event.start.toISOString(),
        newStart: info.event.start.toISOString(),
        newEnd: info.event.end.toISOString(),
        reserving_user_id: info.event.extendedProps.reserving_user_id,
      };

      const existingEventIndex = this.modifiedEvents.findIndex(
        (event) => event.id === info.event.id
      );

      if (existingEventIndex !== -1) {
        this.modifiedEvents[existingEventIndex].modifiedEventDate =
          modifiedEvent.modifiedEventDate;
        this.modifiedEvents[existingEventIndex].newStart =
          modifiedEvent.newStart;
        this.modifiedEvents[existingEventIndex].newEnd = modifiedEvent.newEnd;
      } else {
        this.modifiedEvents.push({
          ...originalEvent,
          modifiedTitle: modifiedEvent.modifiedTitle,
          modifiedEventDate: modifiedEvent.modifiedEventDate,
          newStart: modifiedEvent.newStart,
          newEnd: modifiedEvent.newEnd,
          originalEventDate: originalEvent.originalEventDate,
          originalStart: originalEvent.originalStart,
          originalEnd: originalEvent.originalEnd,
        });
      }
    },

    async fetchUserId() {
      if (!this.$store.getters.isLoggedIn) return;
      const token = this.$store.getters.accessToken;
      const payload = JSON.parse(atob(token.split(".")[1]));

      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp < currentTime) {
        console.log("Token has expired");
      }

      try {
        const response = await axios.get("http://localhost:5000/api/user", {
          headers: {
            Authorization: `Bearer ${this.$store.getters.accessToken}`,
          },
        });
        this.userId = response.data.userId;
        this.email = response.data.email;
        this.firstName = response.data.firstName;
        this.lastName = response.data.lastName;
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    },

    async fetchEvents() {
      try {
        const response = await axios.get("http://localhost:5000/api/getEvents");
        this.calendarOptions.events = response.data;
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    },
    async fetchServices() {
      try {
        const response = await axios.get("http://localhost:5000/api/services");
        this.services = response.data;
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
      this.showFirstDialog = true;
    },
    closeDialog() {
      this.showConfirmationDialog = false;
      this.showFirstDialog = false;
      this.selectedSlot = {};
      this.selectedService = null;
    },
    checkOverlap() {
      if (!this.selectedService) {
        alert("Please select a service.");
        return;
      }
      const durationInMinutes = parseInt(this.selectedService.duration, 10);
      const startTime = new Date(this.selectedSlot.date);
      const endTime = new Date(startTime.getTime() + durationInMinutes * 60000);
      const hasOverlap = this.calendarOptions.events.some((event) => {
        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);
        return startTime < eventEnd && endTime > eventStart;
      });

      if (hasOverlap) {
        alert("This time slot is already booked. Please choose another time.");
      } else {
        this.showConfirmationDialog = true;
        this.showFirstDialog = false;
      }
    },
    confirmationDialogCancel() {
      this.showConfirmationDialog = false;
      this.selectedService = null;
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

        this.calendarOptions.events.push(newEvent);
        alert(
          `Appointment for ${this.selectedService.title} successfully booked!`
        );

        this.selectedService = null;
        this.showConfirmationDialog = false;
      } catch (error) {
        console.error("Error booking appointment:", error);
        alert("There was an error booking your appointment. Please try again.");
      }
    },
  },
};
