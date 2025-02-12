<template>
  <v-container>
    <v-card>
      <v-card-title>
        <span class="text-h5">Admin Naptár Kezelése</span>
      </v-card-title>

      <v-card-text>
        <v-row justify="space-between" align="center">
          <v-col cols="12" md="6">
            <v-btn
              :color="isOpen ? 'error' : 'primary'"
              @click="toggleCalendar"
            >
              {{ isOpen ? "Hónap Lezárása" : "Hónap Megnyitása" }}
            </v-btn>
          </v-col>
          <v-col cols="12" md="6" class="text-right">
            <h4>{{ formattedMonthYear }}</h4>
          </v-col>
        </v-row>

        <FullCalendar :options="calendarOptions" ref="calendarRef" />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import apiClient from "@/utils/apiClient"; // Az új Axios konfiguráció használata
import { useToast } from "vue-toastification";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";

// Állapotváltozók és toast inicializálása
const toast = useToast();
const calendarRef = ref(null);
const currentDate = ref(new Date());
const isOpen = ref(false);
const loading = ref(false);

const calendarEvents = ref([]);
const token = sessionStorage.getItem("accessToken");

// FullCalendar beállítások
const calendarOptions = reactive({
  timeZone: "UTC",
  plugins: [dayGridPlugin],
  initialView: "dayGridMonth",
  headerToolbar: {
    start: "", // Nem használunk alap navigációt
    center: "title",
    end: "prev,next",
  },
  datesSet: (info) => {
    const calendarApi = calendarRef.value.getApi(); // FullCalendar API elérése
    currentDate.value = calendarApi.getDate(); // A naptár közepén lévő dátum lekérése
    console.log("FullCalendar center date:", currentDate.value);

    checkCalendarStatus();
  },
});

// Formázott dátum a hónap kijelzéséhez
const formattedMonthYear = computed(() => {
  const options = { year: "numeric", month: "long", timeZone: "UTC" }; // Add hozzá az időzóna megadását
  return currentDate.value.toLocaleDateString("hu-HU", options);
});

// Ellenőrzi, hogy az aktuális hónap nyitva van-e
const checkCalendarStatus = async () => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth() + 1;

  try {
    const response = await apiClient.get(
      `/api/calendar/status/${year}/${month}`
    );
    isOpen.value = response.data.is_open;
  } catch (error) {
    toast.error("Hiba történt a naptár állapot lekérdezésekor.");
    console.error(error);
  }
};

// Naptár nyitása/zárása
async function toggleCalendar() {
  loading.value = true;
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth() + 1;
  try {
    if (isOpen.value) {
      await apiClient.post(
        "/api/calendar/close",
        { year, month },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("A hónap sikeresen lezárva!");
    } else {
      await apiClient.post(
        "/api/calendar/open",
        { year, month },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("A hónap sikeresen megnyitva!");
    }
    isOpen.value = !isOpen.value;
  } catch (error) {
    toast.error("Hiba történt a naptár állapot módosítása közben.");
    console.error(error);
  } finally {
    loading.value = false;
  }
}

// Automatikus állapotlekérdezés a komponens betöltésekor
onMounted(() => {
  checkCalendarStatus();
});
</script>

<style scoped>
.fc {
  margin-top: 20px;
}
</style>
