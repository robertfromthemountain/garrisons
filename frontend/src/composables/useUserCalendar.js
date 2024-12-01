import apiClient from '@/utils/apiClient';
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
                initialView: "timeGridDay",
                slotDuration: "00:15:00",
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
                this.calendarOptions.events = response.data;
                console.log("ITT VANNAK AZ EVENTEK A DATABASEBOL:", this.calendarOptions.events);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        },
        async fetchServices() {
            try {
                const response = await apiClient.get("http://localhost:5000/api/services");
                this.services = response.data;
                console.log("ITT VANNJAK A SERVICEK:", this.services);
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
                pending_service_id: this.selectedService.id,
                pending_service_title: this.selectedService.title,
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
                    `Appointment for ${this.selectedService.title}, with the ID: ${this.selectedService.id} successfully booked!`
                );

                this.showConfirmationDialog = false;
            } catch (error) {
                console.error("Error booking appointment:", error);
                alert("There was an error booking your appointment. Please try again.");
            }
        },
    },
};
