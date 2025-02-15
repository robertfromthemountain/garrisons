// Importáljuk a Vue-ból a 'computed' függvényt,
// amellyel reaktív, számított (computed) értékeket hozhatunk létre.
import { computed } from "vue";

/**
 * A useSlotDateTimeFormatter egy olyan composable függvény,
 * amely a FullCalendar naptár komponensből kiválasztott slot (időpont) 
 * dátumát és idejét alakítja át felhasználó számára olvasható formátumra.
 *
 * @param {Object} selectedSlot - Egy ref, amely tartalmazza a kiválasztott slot adatait.
 *                                Elvárjuk, hogy ez az objektum legalább két tulajdonsággal rendelkezzen:
 *                                - date: a kiválasztott dátum
 *                                - time: a kiválasztott idő
 *
 * @returns {Object} - Visszatér egy objektummal, amely tartalmazza:
 *                     - formattedDate: a formázott dátum (computed property)
 *                     - formattedTime: a formázott idő (computed property)
 */
export function useSlotDateTimeFormatter(selectedSlot) {
  /*
  Ebben a blokkon belül hozzuk létre a formázott dátumot és időt,
  amelyeket később felhasználhatunk a felhasználó számára készült dialógusokban,
  vagy más komponensekben.
  */

  // Létrehozunk egy computed property-t a formázott dátumhoz.
  // Ha a selectedSlot.value.date értéke meg van adva, akkor azt a Intl.DateTimeFormat segítségével
  // formázzuk a 'hu-HU' lokalizációnak megfelelően (Év, hónap és nap), UTC időzónában.
  // Ha nincs megadva a dátum, akkor üres stringet ad vissza.
  const formattedDate = computed(() => {
    return selectedSlot.value.date
      ? new Intl.DateTimeFormat("hu-HU", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          timeZone: "UTC",
        }).format(new Date(selectedSlot.value.date))
      : "";
  });

  // Létrehozunk egy computed property-t a formázott időhöz.
  // Ha a selectedSlot.value.time értéke meg van adva, akkor azt a Intl.DateTimeFormat segítségével
  // formázzuk a 'hu-HU' lokalizációnak megfelelően (óra és perc), szintén UTC időzónában.
  // Ha nincs megadva az idő, akkor üres stringet ad vissza.
  const formattedTime = computed(() => {
    return selectedSlot.value.time
      ? new Intl.DateTimeFormat("hu-HU", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "UTC",
        }).format(new Date(selectedSlot.value.time))
      : "";
  });

  // A függvény visszatér egy objektummal, amely tartalmazza a formázott dátumot és időt.
  // Ezeket a computed property-ket a komponensek belsejében bármikor felhasználhatjuk,
  // ahol szükséges a felhasználó számára olvasható dátum és idő megjelenítése.
  return { formattedDate, formattedTime };
}
