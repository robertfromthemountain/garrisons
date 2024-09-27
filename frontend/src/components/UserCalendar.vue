<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import FullCalendar from '@fullcalendar/vue3';
import axios from 'axios';
import { useI18n } from 'vue-i18n';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import enLocale from '@fullcalendar/core/locales/en-gb';
import huLocale from '@fullcalendar/core/locales/hu';
import { useToast } from 'vue-toastification';

// i18n and toast
const { locale, t } = useI18n();
const toast = useToast();

// Vuex Store
const store = useStore();

// Show toast function
const showToast = (message, type = 'success') => {
  if (type === 'success') toast.success(message);
  else if (type === 'error') toast.error(message);
  else if (type === 'warning') toast.warning(message);
  else if (type === 'info') toast.info(message);
};

const handleError = (customMessage) => {
  showToast(customMessage, 'error');
};

// Reactive State
const calendarEvents = ref([]);
const showFirstDialog = ref(false);
const showConfirmationDialog = ref(false);
const selectedSlot = ref({ date: '', time: '' });
const services = ref([]);
const selectedService = ref(null);
const userId = ref(null);
const email = ref(null);
const firstName = ref(null);
const lastName = ref(null);

// Calendar Options
const calendarOptions = reactive({
  timeZone: 'UTC',
  weekends: false,
  locales: [huLocale, enLocale],
  locale: locale.value,
  plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
  slotEventOverlap: false,
  initialView: 'timeGridDay',
  slotDuration: '00:15:00',
  slotMinTime: '08:00:00',
  slotMaxTime: '17:00:00',
  editable: false,
  nowIndicator: true,
  headerToolbar: {
    left: 'prev',
    center: 'title',
    right: 'today,next',
  },
  footerToolbar: {
    left: '',
    center: '',
    right: '',
  },
  slotLabelFormat: {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  },
  dateClick: handleDateClick,
  allDaySlot: false,
  events: calendarEvents,
});

// Computed Properties
const formattedDate = computed(() => {
  return selectedSlot.value.date
    ? new Intl.DateTimeFormat('hu-HU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: 'UTC',
      }).format(new Date(selectedSlot.value.date))
    : '';
});

const formattedTime = computed(() => {
  return selectedSlot.value.time
    ? new Intl.DateTimeFormat('hu-HU', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC',
      }).format(new Date(selectedSlot.value.time))
    : '';
});

function handleDateClick(arg) {
  selectedSlot.value = { date: arg.dateStr, time: arg.dateStr };
  selectedService.value = null;
  showFirstDialog.value = true;
}

// Lifecycle Hook
onMounted(() => {
  fetchUserId();
  fetchEvents();
  fetchPendingEvents();
  fetchServices();
});

// Methods
async function fetchUserId() {
  if (!store.getters.isLoggedIn) return;

  const token = store.getters.accessToken;
  const payload = JSON.parse(atob(token.split('.')[1]));
  const currentTime = Math.floor(Date.now() / 1000);

  if (payload.exp < currentTime) {
    showToast('Session expired. Please log in again.', 'info');
    store.dispatch('logout');
    return;
  }

  try {
    const response = await axios.get('http://localhost:5000/api/user', {
      headers: { Authorization: `Bearer ${token}` },
    });
    userId.value = response.data.userId;
    email.value = response.data.email;
    firstName.value = response.data.firstName;
    lastName.value = response.data.lastName;
  } catch (error) {
    handleError('Error fetching user ID: ' + error.message);
  }
}

async function fetchEvents() {
  try {
    const response = await axios.get('http://localhost:5000/api/getEvents');
    calendarOptions.events = [...calendarOptions.events, ...response.data];
  } catch (error) {
    console.error('Error fetching events:', error);
  }
}

async function fetchPendingEvents() {
  try {
    const response = await axios.get(
      'http://localhost:5000/api/getPendingEvents2'
    );
    calendarOptions.events = [...calendarOptions.events, ...response.data];
  } catch (error) {
    console.error('Error fetching pending events:', error);
  }
}

async function fetchServices() {
  try {
    const response = await axios.get('http://localhost:5000/api/services');
    services.value = response.data;
  } catch (error) {
    console.error('Error fetching services:', error);
  }
}

function closeDialog() {
  showFirstDialog.value = false;
  showConfirmationDialog.value = false;
  selectedSlot.value = {};
  selectedService.value = null;
}

function checkOverlap() {
  if (!selectedService.value) {
    showToast('Please select a service.', 'warning');
    return;
  }
  const durationInMinutes = parseInt(selectedService.value.duration, 10);
  const startTime = new Date(selectedSlot.value.date);
  const endTime = new Date(startTime.getTime() + durationInMinutes * 60000);
  const hasOverlap = calendarOptions.events.some((event) => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    return startTime < eventEnd && endTime > eventStart;
  });

  if (hasOverlap) {
    showToast(
      'This time slot is already booked. Please choose another time.',
      'error'
    );
  } else {
    showConfirmationDialog.value = true;
    showFirstDialog.value = false;
  }
}

function confirmationDialogCancel() {
  showConfirmationDialog.value = false;
}

async function finalizeBooking() {
  const durationInMinutes = parseInt(selectedService.value.duration, 10);
  const startTime = new Date(selectedSlot.value.date);
  const endTime = new Date(startTime.getTime() + durationInMinutes * 60000);

  const newEvent = {
    pending_service_title: selectedService.value.title,
    pending_service_id: selectedService.value.id,
    pending_date: selectedSlot.value.date,
    pending_start_of_event: startTime.toISOString(),
    pending_end_of_event: endTime.toISOString(),
    user_id: userId.value,
  };

  try {
    await axios.post('http://localhost:5000/api/requestEvent', newEvent, {
      headers: { Authorization: `Bearer ${store.getters.accessToken}` },
    });

    calendarOptions.events.push(newEvent);
    showToast(
      `Appointment for ${selectedService.value.title} successfully booked!`
    );

    fetchPendingEvents();
    showConfirmationDialog.value = false;
  } catch (error) {
    handleError(
      'There was an error booking your appointment. Please try again.' +
        error.message
    );
  }
}
</script>

<template>
  <div class="pa-8">
    <FullCalendar :options="calendarOptions" class="h-auto" />

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
            {{ formattedDate }}
          </p>
          <p class="pb-2">
            <strong>{{ t("dialog.time") }}</strong>
            {{ formattedTime }}
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
            {{ formattedDate }}
          </p>
          <p>
            <strong>{{ t("dialog.time") }}</strong>
            {{ formattedTime }}
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
  