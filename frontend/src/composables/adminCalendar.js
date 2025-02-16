

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
      calendarEvents: [],
      originalEvents: [],
      modifiedEvents: [],
      modifying: false,
      showModificationDialog: false,
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
    this.fetchPendingEvents();
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
          const response = await apiClient.delete(`http://localhost:5000/api/events/deleteEvent/${this.selectedEvent.id}`, {
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

    // Show the modification dialog with modified events details
    showModificationModal() {
      if (this.modifiedEvents.length > 0) {
        this.showModificationDialog = true;
      } else {
        alert("No events have been modified.");
      }
    },

    // Confirm modifications and update the confirmed_events table
    async confirmModifications() {
      try {
        await apiClient.post("http://localhost:5000/api/events/updateConfirmedEvents", this.modifiedEvents);
        alert("Modifications saved successfully!");

        this.resetModifications();
      } catch (error) {
        console.error("Error saving modifications:", error);
        alert("There was an error saving the modifications. Please try again.");
      }
    },

    // Discard modifications and reset calendar to original state
    discardModifications() {
      this.calendarOptions.events = JSON.parse(JSON.stringify(this.originalEvents));
      this.resetModifications();
    },

    // Handle drag-and-drop modifications
    // handleEventDrop(info) {
    //   const originalEvent = this.findOriginalEvent(info.event.id);
    //   const modifiedEvent = {
    //     id: info.event.id,
    //     modifiedTitle: info.event.title,
    //     originalEventDate: originalEvent.start.toISOString(),
    //     modifiedEventDate: info.event.start.toISOString(),
    //     originalStart: originalEvent.start.toISOString(),
    //     newStart: info.event.start.toISOString(),
    //     originalEnd: originalEvent.end.toISOString(),
    //     newEnd: info.event.end.toISOString(),
    //     reserving_user_id: info.event.extendedProps.reserving_user_id,
    //   };

    //   // Check if the event has already been modified
    //   const index = this.modifiedEvents.findIndex((event) => event.id === info.event.id);
    //   if (index !== -1) {
    //     this.modifiedEvents[index] = modifiedEvent;
    //   } else {
    //     this.modifiedEvents.push(modifiedEvent);
    //   }
    // },

    // Find the original event by ID (before modifications)
    findOriginalEvent(eventId) {
      return this.originalEvents.find(event => event.id === eventId);
    },

    // Reset modification state after confirming or discarding
    resetModifications() {
      this.showModificationDialog = false;
      this.modifiedEvents = [];
      this.calendarOptions.editable = false;
      this.modifying = false;
      this.fetchEvents(); // Reload events from the server
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
        return;
      }

      try {
        const response = await apiClient.get("http://localhost:5000/api/users/loggedInUser", {
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
        const response = await apiClient.get("http://localhost:5000/api/events/getEvents");
        this.calendarOptions.events = [...this.calendarOptions.events, ...response.data];
        // console.log("ITT VANNAK AZ EVENTEK A DATABASEBOL:", this.calendarOptions.events);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    },

//GET ALL PENDING EVENTS TEST ONLY
async fetchPendingEvents() {
  try {
    const response = await apiClient.get("http://localhost:5000/api/events/getPendingEvents");
    this.calendarOptions.events = [...this.calendarOptions.events, ...response.data];
    console.log("ITT VANNAK AZ EVENTEK A DATABASEBOL:", this.calendarOptions.events);
  } catch (error) {
    console.error("Error fetching events:", error);
  }
},

    async fetchServices() {
      try {
        const response = await apiClient.get("http://localhost:5000/api/services");
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
      this.selectedService = null;
      this.showFirstDialog = true;
    },
    closeDialog() {
      this.showFirstDialog = false;
      this.showConfirmationDialog = false;
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
    },

    async finalizeBooking() {
      const durationInMinutes = parseInt(this.selectedService.duration, 10);
      const startTime = new Date(this.selectedSlot.date);
      const endTime = new Date(startTime.getTime() + durationInMinutes * 60000);

      const newEvent = {
        pending_service_title: this.selectedService.title,
        pending_service_id: this.selectedService.id,
        pending_date: this.selectedSlot.date,
        pending_start_of_event: startTime.toISOString(),
        pending_end_of_event: endTime.toISOString(),
        user_id: this.userId,
      };

      try {
        await apiClient.post("http://localhost:5000/api/events/requestAppointment", newEvent, {
          headers: {
            Authorization: `Bearer ${this.$store.getters.accessToken}`,
          },
        });

        this.calendarOptions.events.push(newEvent);
        alert(
          `Appointment for ${this.selectedService.title} successfully booked!`
        );

        this.fetchPendingEvents();
        this.showConfirmationDialog = false;
      } catch (error) {
        console.error("Error booking appointment:", error);
        alert("There was an error booking your appointment. Please try again.");
      }
    },
  },
};
