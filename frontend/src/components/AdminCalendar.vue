<script>
import FullCalendar from "@fullcalendar/vue3";
import adminCalendar from "@/composables/adminCalendar.js";

export default {
  components: {
    FullCalendar,
  },
  mixins: [adminCalendar],
  // Importing JS logic as a mixin
  setup(props, context) {
    // Since we're using the setup function, let's get t directly from the mixin
    const { t } = adminCalendar.setup();

    return {
      t,
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
  