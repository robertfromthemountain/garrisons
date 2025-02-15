import { useEventActions } from "@/composables/dashboard/useEventActions";
import { ref } from "vue";

export function useDialogManager(deps) {
    // Reaktív állapotok a modalok megjelenítéséhez
    const isDeleteModalOpen = ref(false);
    const actionType = ref("");
    const modalTitle = ref("");
    const modalMessage = ref("");
    
    const showModificationDialog = ref(false);
    const showFirstDialog = ref(false);
    const showConfirmationDialog = ref(false);
    const showEventDialog = ref(false);

    // Integráljuk a useEventActions függvényeket a megkapott deps-eken keresztül.
    // A deps objektum tartalmazza a szükséges reaktív változókat és függvényeket,
    // amelyeket a useEventActions igényel.
    const { denyEvent, deleteEvent } = useEventActions(deps);

    /**
    * Megnyitja a törléshez vagy elutasításhoz tartozó modal-t,
    * és beállítja a megfelelő címeket és üzeneteket az action alapján.
    *
    * @param {string} action - Az akció típusa ("deny" vagy "delete").
    */
    const openDeleteModal = (action) => {
        actionType.value = action;
        if (action === "deny") {
            modalTitle.value = "Deny Event";
            modalMessage.value = "Are you sure you want to deny this event?";
        } else if (action === "delete") {
            modalTitle.value = "Delete Event";
            modalMessage.value = "Are you sure you want to delete this event?";
        }
        isDeleteModalOpen.value = true;
    };

    /**
     * Bezárja a törléshez tartozó modal-t.
     */
    const closeDeleteModal = () => {
        isDeleteModalOpen.value = false;
    };

    /**
    * A modalban történő megerősítési műveletet kezeli.
    * Itt például további akciókat is elindíthatsz az actionType alapján,
    * de itt egyszerűen csak bezárja a modal-t.
    */
    const handleConfirm = () => {
        if (actionType.value === "deny") {
            denyEvent();
        } else if (actionType.value === "delete") {
            deleteEvent();
        }

        closeDeleteModal(); // Close modal after action
    };

    return {
        // Reaktív állapotok
        isDeleteModalOpen,
        actionType,
        modalTitle,
        modalMessage,
        showModificationDialog,
        showFirstDialog,
        showConfirmationDialog,
        showEventDialog,
        // Függvények
        openDeleteModal,
        closeDeleteModal,
        handleConfirm,
    };
}