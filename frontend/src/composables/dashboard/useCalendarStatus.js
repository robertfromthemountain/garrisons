import { ref } from "vue";
import apiClient from "@/utils/apiClient";
import { useToast } from "vue-toastification";

export function useCalendarStatus() {
    const toast = useToast();
    const isMonthOpen = ref(false);
    const currentDate = ref(new Date());
    const openMonths = ref([]);
    const openMonthsCount = ref(0);
    const formattedOpenMonth = ref("");
    const token = sessionStorage.getItem("accessToken");

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

    // Lekéri az adatbázisból az összes nyitott hónapot
    const fetchOpenMonths = async () => {
        try {
            const response = await apiClient.get(`/api/calendar/status/open-months`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            openMonths.value = response.data.openMonths; // Nyitott hónapok eltárolása
            openMonthsCount.value = response.data.count;

            if (openMonths.value.length > 0) {
                const latestOpenMonth = openMonths.value[openMonths.value.length - 1]; // Az utolsó nyitott hónap
                formattedOpenMonth.value = new Date(latestOpenMonth.year, latestOpenMonth.month - 1)
                    .toLocaleDateString("hu-HU", { year: "numeric", month: "long" });

                toast.success(`A legfrissebb nyitott hónap: ${formattedOpenMonth.value}`);
            } else {
                toast.warning("Jelenleg nincs nyitott hónap!");
            }
        } catch (error) {
            toast.error("Nem sikerült lekérni a nyitott hónapokat.");
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
        currentDate,
        openMonths,
        openMonthsCount,
        formattedOpenMonth,
        checkCalendarStatus,
        fetchOpenMonths,
        openCalendar,
        closeCalendar,
    };
}
