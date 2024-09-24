<template>
  <div class="pa-8">
    <FullCalendar :options="calendarOptions" class="h-auto" />

    <v-btn v-if="!modifying" @click="enableModification">Modify Events</v-btn>

    <div v-if="modifying">
      <v-btn color="primary" @click="saveModifications">Save</v-btn>
      <v-btn color="secondary" @click="cancelModifications">Cancel</v-btn>
    </div>

    <v-dialog v-model="showFirstDialog" max-width="500">
      <v-card>
        <v-card-title>
          <span class="headline">Book an Appointment</span>
        </v-card-title>
        <v-card-text>
          <p><strong>Date:</strong> {{ selectedSlot.date }}</p>
          <p><strong>Time:</strong> {{ selectedSlot.time }}</p>
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
  
  <script>
import FullCalendar from "@fullcalendar/vue3";
import adminCalendar from "@/composables/adminCalendar.js";

export default {
  components: {
    FullCalendar,
  },
  mixins: [adminCalendar], // Importing JS logic as a mixin
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
  