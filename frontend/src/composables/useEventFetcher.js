// src/composables/useEventFetcher.js
import { ref } from 'vue';
import apiClient from '@/utils/apiClient';
import { useLoading } from '@/composables/dashboard/useLoading';

/**
 * A useEventFetcher composable célja, hogy lekérje a rendszerben 
 * használt eseményeket (regular és pending események) és elérhetővé tegye
 * őket több komponens számára.
 *
 * @returns {Object} - Egy objektum, amely tartalmazza:
 *   - events: A reaktív eseménylista (ref tömb).
 *   - fetchAllEvents: Függvény, amely az eseményeket lekéri az API-ról és frissíti az events ref-et.
 */
export function useEventFetcher(calendarEvents, services, calendarOptions) {
    // Használjuk a központi loading state-et
    const { startLoading, stopLoading } = useLoading();

    /**
     * Lekéri az eseményeket az API-ról.
     * A függvény egyszerre két végpontról (regular és pending események) kér le adatokat,
     * majd ezek eredményét kombinálja egyetlen tömbbé.
     */
    async function fetchAllEvents() {
        startLoading();
        try {
            const token = sessionStorage.getItem("accessToken");
            if (!token) throw new Error("No token available");

            // Egyszerre kérjük le a regular és pending eseményeket
            const [regularEventsResponse, pendingEventsResponse] = await Promise.all([
                apiClient.get("http://localhost:5000/api/events/getEvents", {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                apiClient.get("http://localhost:5000/api/events/getPendingEvents", {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);

            // Kombináljuk a két lekérdezés eredményét
            calendarEvents.value = [
                ...regularEventsResponse.data,
                ...pendingEventsResponse.data,
            ];
            console.log("Fetched all events:", calendarEvents.value);
        } catch (error) {
            console.error("Error fetching all events:", error);
        } finally {
            stopLoading();
        }
    }

    async function fetchServices() {
        startLoading();
        try {
            const token = sessionStorage.getItem("accessToken");
            if (!token) throw new Error("No token available");

            const response = await apiClient.get("http://localhost:5000/api/services", {
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token in headers
                },
            });
            services.value = response.data;
        } catch (error) {
            console.error("Error fetching services:", error);
        } finally {
            stopLoading();
        }
    }

    /**
 * Átalakítja az API-ból érkező üzleti órákat FullCalendar formátumba.
 *
 * @param {Array} businessHours - Az API-ból kapott üzleti órák tömbje.
 * @returns {Array} - Az átalakított üzleti órák tömbje.
 */
    function mapBusinessHours(businessHours) {
        return businessHours.map((hour) => ({
            daysOfWeek: [hour.daysOfWeek], // Az API-ból kapott nap számát tömbbe tesszük
            startTime: hour.startTime.slice(0, 5), // 'HH:mm' formátumra vágjuk
            endTime: hour.endTime.slice(0, 5),
        }));
    }

    /**
     * Lekéri az üzleti órákat az API-ról, majd átalakítja őket a mapBusinessHours függvénnyel.
     *
     * @returns {Array} - Az átalakított üzleti órák tömbje.
     */
    async function fetchBusinessHours() {
        startLoading();
        try {
            const response = await apiClient.get("http://localhost:5000/api/business-hours");
            console.log("Raw business hours:", response.data);

            // Átalakítjuk a lekért adatokat a mapBusinessHours függvénnyel
            calendarOptions.businessHours = mapBusinessHours(response.data);
        } catch (error) {
            console.error("Error fetching business hours:", error);
        } finally {
            stopLoading();
        }
    }

    return { fetchAllEvents, fetchServices, fetchBusinessHours };
}
