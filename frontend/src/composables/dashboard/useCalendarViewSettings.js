// src/composables/useCalendarViewSettings.js

import { computed, watch } from "vue";
import { useDisplay } from "vuetify";

/*
  Ez a composable célja, hogy a FullCalendar megjelenítéséhez szükséges
  képernyőméretfüggő beállításokat biztosítsa:
  
  - reactiveAspectRatio: A naptár aspektus arányát számolja ki a képernyőméret alapján.
  - reactiveInitialView: Az alapértelmezett naptár nézetet határozza meg (pl. napnézet kis képernyőn, heti nézet nagyobb képernyőn).
  
  Emellett figyeli a reactiveInitialView változását, és ha a naptár referenciája elérhető,
  automatikusan módosítja a naptár nézetét a FullCalendar API segítségével.
  
  FONTOS: A composable paraméterként megkívánja a FullCalendar komponensre mutató ref-et,
  amely lehetővé teszi, hogy a naptár API-jával módosításokat hajtsunk végre.
*/

export function useCalendarViewSettings(calendarRef) {
  // A useDisplay hook visszaadja a képernyőméretre vonatkozó reaktív értékeket
  const { xs, sm, md, lg, xl, xxl } = useDisplay();

  // Számoljuk ki a naptár aspektus arányát a képernyőméret alapján
  const reactiveAspectRatio = computed(() => {
    if (xs.value) return 0.6; // Kis képernyő: kisebb arány
    if (sm.value) return 1;   // Kis-közepes képernyő: 1:1 arány
    if (md.value) return 1.5; // Közepes képernyő: 1.5:1 arány
    if (lg.value) return 2;   // Nagy képernyő: 2:1 arány
    if (xl.value || xxl.value) return 2.5; // Extra nagy képernyő: 2.5:1 arány
    return 2.5; // Fallback érték
  });

  // Határozzuk meg a naptár alapértelmezett nézetét a képernyőméret alapján
  const reactiveInitialView = computed(() => {
    if (xs.value) return "timeGridDay"; // Kis képernyőn napnézet
    return "timeGridWeek";              // Egyéb esetben heti nézet
  });

  // Figyeljük a reactiveInitialView változását, és ha változik, módosítjuk a naptár nézetét
  watch(reactiveInitialView, (newView) => {
    if (calendarRef.value) {
      // A FullCalendar API segítségével váltjuk át az aktuális nézetet
      calendarRef.value.getApi().changeView(newView);
    }
  });

  // Visszatérünk a computed property-kkel, hogy a komponensben felhasználhasd őket
  return { reactiveAspectRatio, reactiveInitialView, xs, sm, md, lg, xl, xxl };
}
