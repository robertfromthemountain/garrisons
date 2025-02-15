// src/composables/useNotifier.js
import { useToast } from "vue-toastification";

/**
 * useNotifier composable
 *
 * Ez a composable kizárólag az üzenetek (toast-ok) megjelenítését kezeli,
 * különböző típusokban: success, error, warning, info.
 *
 * Használata:
 *   import { useNotifier } from "@/composables/useNotifier";
 *   const { showToast } = useNotifier();
 *   showToast("Sikeres művelet!", "success");
 *
 * @returns {Object} - { showToast } egy függvényt, amellyel megjelenítheted a toast üzeneteket.
 */
export function useNotifier() {
  // Inicializáljuk a toast-ot a vue-toastification hook segítségével
  const toast = useToast();

  /**
   * Megjelenít egy toast üzenetet a megadott üzenettel és típussal.
   *
   * @param {string} message - A megjelenítendő üzenet.
   * @param {string} [type="success"] - Az üzenet típusa: "success", "error", "warning", "info".
   */
  const showToast = (message, type = "success") => {
    switch (type) {
      case "success":
        toast.success(message);
        break;
      case "error":
        toast.error(message);
        break;
      case "warning":
        toast.warning(message);
        break;
      case "info":
        toast.info(message);
        break;
      default:
        toast(message);
    }
  };

  // Visszaadjuk a showToast függvényt, így bárhol felhasználhatod az alkalmazásban
  return { showToast };
}
