// src/composables/useCalendarOptions.js
import { reactive, computed } from "vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import enLocale from "@fullcalendar/core/locales/en-gb";
import huLocale from "@fullcalendar/core/locales/hu";

/**
 * A useCalendarOptions composable létrehozza a FullCalendar konfigurációs objektumát.
 *
 * @param {Object} params - Paraméterek, amelyek befolyásolják a konfigurációt:
 *   - locale: Ref a jelenleg használt lokalizációhoz (pl. "hu-HU").
 *   - reactiveInitialView: Computed property a kezdeti nézet meghatározásához.
 *   - reactiveAspectRatio: Computed property a naptár aspektus arányához.
 *   - modifying: Ref, amely jelzi, hogy a szerkesztési mód aktív-e.
 *   - xs: Ref a kis képernyő állapotához.
 *   - calendarEvents: Ref a naptár eseményeit tartalmazó tömbhöz.
 *   - handleEventDrop: Függvény az esemény áthelyezés kezeléséhez.
 *   - handleEventClick: Függvény az eseményre kattintás kezeléséhez.
 *   - enableModification: Függvény a szerkesztési mód engedélyezéséhez.
 *   - showModificationModal: Függvény a módosítás dialógus megjelenítéséhez.
 *   - resetModifications: Függvény a módosítások visszaállításához.
 *   - handleDateClick: Függvény a dátum klikk kezeléséhez.
 *
 * @returns {Object} - A calendarOptions reaktív objektuma.
 */
export function useCalendarOptions({
  locale,
  reactiveInitialView,
  reactiveAspectRatio,
  modifying,
  xs,
  calendarEvents,
  handleEventDrop,
  handleEventClick,
  enableModification,
  showModificationModal,
  resetModifications,
  handleDateClick,
}) {
  const calendarOptions = reactive({
    timeZone: "UTC",
    weekends: false,
    locales: [huLocale, enLocale],
    locale: locale.value,
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
    slotEventOverlap: false,
    allDaySlot: false,
    initialView: reactiveInitialView.value,
    slotDuration: "00:15:00",
    slotMinTime: "08:00:00",
    slotMaxTime: "17:00:00",
    editable: false,
    eventDurationEditable: false,
    eventResizableFromEnd: false,
    eventDrop: handleEventDrop,
    eventClick: handleEventClick,
    aspectRatio: reactiveAspectRatio,
    nowIndicator: true,
    customButtons: {
      editCalendar: {
        text: "Szerkesztés",
        click() {
          enableModification();
        },
      },
      saveChanges: {
        text: "Mentés",
        click() {
          showModificationModal();
        },
      },
      cancelChanges: {
        text: "Mégsem",
        click() {
          resetModifications();
        },
      },
    },
    headerToolbar: computed(() => ({
      left: !modifying.value ? "editCalendar" : "",
      center: !xs.value ? "title" : "",
      right: modifying.value ? "saveChanges,cancelChanges" : "prev,today,next",
    })),
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
    eventTimeFormat: {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    },
    businessHours: true,
    dateClick: handleDateClick,
    events: calendarEvents,
  });

  return calendarOptions;
}
