import { useLoading } from "@/composables/dashboard/useLoading";
import { useNotifier } from "@/composables/dashboard/useNotifier";
import apiClient from "@/utils/apiClient";

/**
 * A useEventActions composable két függvényt exportál:
 * - denyEvent: A kiválasztott esemény elutasítását (deny) végzi el.
 * - deleteEvent: A kiválasztott esemény törlését végzi el.
 *
 * Ezek a függvények feltételezik, hogy a szükséges reaktív változók (például loading,
 * selectedEvent, calendarEvents) és segédfüggvények (fetchAllEvents, closeEventDialog,
 * showToast, handleError) a komponensedből átadásra kerülnek.
 *
 * @param {Object} deps - Azok a függőségek, amelyeket a függvények használni fognak.
 * @param {Ref<boolean>} deps.loading - Reaktív változó a loading állapot kezelésére.
 * @param {Ref<Object>} deps.selectedEvent - A kiválasztott esemény (pl. a dialogban megjelenített esemény).
 * @param {Ref<Array>} deps.calendarEvents - A naptár eseményeit tartalmazó tömb.
 * @param {Function} deps.fetchAllEvents - Függvény az események újrafetch-eléséhez.
 * @param {Function} deps.closeEventDialog - Függvény a dialog bezárásához.
 *
 * @returns {Object} - { denyEvent, deleteEvent }
 */
export function useEventActions({
    selectedEvent,
    calendarEvents,
    fetchAllEvents,
    closeEventDialog,
}) {
    console.log("selectedEvent:", selectedEvent); // ellenőrizd, hogy nem undefined
    // Használjuk a központi loading state‑et a useLoading composable segítségével
    const { loading, startLoading, stopLoading } = useLoading();

    // Központi visszajelzőrendszer használata
    const { showToast } = useNotifier();

    /**
     * Elutasítja a kiválasztott eseményt.
     * Ellenőrzi, hogy van-e token, majd meghívja az API-t,
     * és ha sikeres, frissíti az eseménylistát és bezárja a dialogot.
     */
    async function denyEvent() {
        const token = sessionStorage.getItem("accessToken");
        if (!token) {
            showToast("You are not logged in. Please log in again.", "info");
            return;
        }
        startLoading();
        try {
            const response = await apiClient.get(
                `http://localhost:5000/api/events/deletePendingEvent/${selectedEvent.value.id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.status === 200) {
                showToast("Event successfully denied.");
                await fetchAllEvents();
                closeEventDialog();
            } else {
                throw new Error("Failed to deny event.");
            }
        } catch (error) {
            showToast(("Error denying event: " + error.message), "error");
        } finally {
            stopLoading();
        }
    }

    /**
     * Törli a kiválasztott eseményt.
     * Lekéri a token-t, majd meghívja az API törlési végpontját.
     * Siker esetén frissíti az eseménylistát, bezárja a dialogot, és megjelenít egy üzenetet.
     */
    async function deleteEvent() {
        startLoading();
        try {
            const token = sessionStorage.getItem("accessToken");
            if (!token) throw new Error("No token available");

            const response = await apiClient.delete(
                `http://localhost:5000/api/events/deleteEvent/${selectedEvent.value.id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.status !== 200) {
                throw new Error("Failed to delete event");
            }

            // Frissítjük az eseménylistát úgy, hogy eltávolítjuk a törölt eseményt
            calendarEvents.value = calendarEvents.value.filter(
                (event) => event.id !== selectedEvent.value.id
            );

            closeEventDialog();
            showToast("Event deleted successfully");
        } catch (error) {
            console.log(("Error deleting event: " + error.message), "error");
            showToast(("Error deleting event: " + error.message), "error");
        } finally {
            stopLoading();
        }
    }

    async function confirmEvent() {
        const token = sessionStorage.getItem("accessToken");
        if (!token) {
            showToast("You are not logged in. Please log in again.", "info");
            return;
        }
        startLoading();
        try {
            console.log("Token being sent:", token);
            const response = await apiClient.get(
                `http://localhost:5000/api/events/confirmEvent/${selectedEvent.value.id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.status === 200) {
                showToast("Event successfully confirmed.", "success");
                await fetchAllEvents();
                closeEventDialog();
            } else {
                throw new Error("Failed to confirm event.");
            }
        } catch (error) {
            showToast("Error confirming event: " + error.message, "error");
        } finally {
            stopLoading();
        }
    }

    return { denyEvent, deleteEvent, confirmEvent };
}
