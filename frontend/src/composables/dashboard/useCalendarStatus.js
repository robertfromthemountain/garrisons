import { ref, computed } from "vue";
import apiClient from "@/utils/apiClient";
import { useToast } from "vue-toastification";

export function useCalendarStatus() {
  const toast = useToast();
  const isMonthOpen = ref(false);
  const currentDate = ref(new Date());
  const token = sessionStorage.getItem("accessToken");

  const formattedMonthYear = computed(() => {
    const options = { year: "numeric", month: "long", timeZone: "UTC" };
    return currentDate.value.toLocaleDateString("hu-HU", options);
  });

  const checkCalendarStatus = async () => {
    const year = currentDate.value.getFullYear();
    const month = currentDate.value.getMonth() + 1;

    try {
      const response = await apiClient.get(
        `/api/calendar/status/${year}/${month}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      isMonthOpen.value = response.data.is_open;
    } catch (error) {
      toast.error("Hiba történt a naptár állapot lekérdezésekor.");
      console.error(error);
    }
  };

  const openCalendar = async () => {
    const year = currentDate.value.getFullYear();
    const month = currentDate.value.getMonth() + 1;
    try {
      await apiClient.post(
        "/api/calendar/open",
        { year, month },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("A hónap sikeresen megnyitva!");
      await checkCalendarStatus();
    } catch (error) {
      toast.error("Hiba történt a naptár megnyitása közben.");
      console.error(error);
    }
  };

  const closeCalendar = async () => {
    const year = currentDate.value.getFullYear();
    const month = currentDate.value.getMonth() + 1;
    try {
      await apiClient.post(
        "/api/calendar/close",
        { year, month },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("A hónap sikeresen lezárva!");
      await checkCalendarStatus();
    } catch (error) {
      toast.error("Hiba történt a naptár lezárása közben.");
      console.error(error);
    }
  };

  return {
    isMonthOpen,
    formattedMonthYear,
    currentDate,
    checkCalendarStatus,
    openCalendar,
    closeCalendar,
  };
}
