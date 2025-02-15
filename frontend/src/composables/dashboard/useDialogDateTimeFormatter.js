/**
 * A useDialogDateTimeFormatter egy olyan composable függvény,
 * amely segít a dátumok és idők formázásában oly módon, hogy azok
 * a felhasználók számára könnyen olvashatóak legyenek a dialógusokban.
 *
 * Ezt a függvényt akkor érdemes használni, amikor egy adott dátumot vagy időt
 * szeretnénk megjeleníteni a felhasználói felületen egy előre definiált formátumban.
 */
export function useDialogDateTimeFormatter() {
    /**
     * Dátum formázása a felhasználó számára.
     *
     * Ez a függvény megkap egy dátumot (string vagy Date objektum formátumban),
     * majd ellenőrzi, hogy érvényes-e. Ha érvényes, akkor a dátumot a "hu-HU"
     * lokalizáció szabályai szerint formázza: év numerikus formában, hónap és nap pedig kétjegyű formátumban.
     * Az időzóna itt fixen "UTC" (koordinált világidő).
     *
     * @param {string | Date} date - A formázandó dátum.
     * @returns {string} - A formázott dátum, vagy üres string, ha a bemenet nem megfelelő.
     */
    const formatDate = (date) => {
      // Ha a date paraméter nincs megadva vagy hamis értékű, akkor azonnal üres stringet adunk vissza.
      if (!date) return "";
  
      // Az inputot Date objektummá konvertáljuk.
      const parsedDate = new Date(date);
      // Ellenőrizzük, hogy az átalakított dátum érvényes-e. Ha nem, hibát írunk a konzolra és üres stringet adunk vissza.
      if (isNaN(parsedDate)) {
        console.error("Invalid date provided:", date);
        return "";
      }
  
      // A dátum formázása a 'hu-HU' lokalizáció szabályai szerint.
      // Az év numerikus, a hónap és a nap pedig kétjegyű formátumban jelenik meg.
      // Az időzóna fixen "UTC".
      return new Intl.DateTimeFormat("hu-HU", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: "UTC",
      }).format(parsedDate);
    };
  
    /**
     * Idő formázása a felhasználó számára.
     *
     * Ez a függvény megkap egy időt (string vagy Date objektum formátumban),
     * majd ellenőrzi, hogy érvényes-e. Ha érvényes, akkor a megadott időt a "hu-HU"
     * lokalizáció szabályai szerint formázza: az óra és perc kétjegyű formátumban.
     * Az időzónát opcionálisan megadhatjuk, alapértelmezetten "UTC"-re van állítva.
     *
     * @param {string | Date} time - A formázandó idő.
     * @param {string} timeZone - (Opcionális) Időzóna, alapértelmezetten "UTC".
     * @returns {string} - A formázott idő, vagy üres string, ha a bemenet nem megfelelő.
     */
    const formatTime = (time, timeZone = "UTC") => {
      // Ha a time paraméter nincs megadva vagy hamis értékű, akkor azonnal üres stringet adunk vissza.
      if (!time) return "";
  
      // Az inputot Date objektummá konvertáljuk.
      const parsedTime = new Date(time);
      // Ellenőrizzük, hogy az átalakított idő érvényes-e. Ha nem, hibát írunk a konzolra és üres stringet adunk vissza.
      if (isNaN(parsedTime)) {
        console.error("Invalid time provided:", time);
        return "";
      }
  
      // Az idő formázása a 'hu-HU' lokalizáció szabályai szerint.
      // Az óra és perc kétjegyű formátumban jelenik meg, és az időzónát a paraméter alapján határozzuk meg.
      return new Intl.DateTimeFormat("hu-HU", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone,
      }).format(parsedTime);
    };
  
    // A függvény visszatér egy objektummal, amely tartalmazza a két formázó segédfüggvényt:
    // - formatDate: a dátum formázásához
    // - formatTime: az idő formázásához
    return { formatDate, formatTime };
  }
  