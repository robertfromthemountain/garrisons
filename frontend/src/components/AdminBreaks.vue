<template>
  <div>
    <h2 class="text-center subtitle-garrisons text-subtitle-1 text-uppercase">
      {{ t("dashboard.managebreaks.subtitle") }}
    </h2>
    <v-progress-linear
      v-if="loading"
      indeterminate
      color="primary"
      class="mb-4"
    ></v-progress-linear>

    <!-- Display Breaks Table -->
    <v-table height="100vh" fixed-header class="bg-garrisons mt-5">
      <thead class="bg-garrisons">
        <tr>
          <th>ID</th>
          <th><v-icon class="me-2">mdi-label-outline</v-icon>Title</th>
          <th><v-icon class="me-2">mdi-timer-outline</v-icon>Duration</th>
          <th><v-icon class="me-2">mdi-check-circle-outline</v-icon>All Day</th>
          <th><v-icon class="me-2">mdi-cog-outline</v-icon>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="breakItem in filteredBreaks"
          :key="breakItem.id"
          class="text-start"
        >
          <td>{{ breakItem.id }}</td>
          <td>{{ breakItem.title }}</td>
          <td>{{ breakItem.duration }}</td>
          <td>{{ breakItem.all_day ? "Yes" : "No" }}</td>
          <td>
            <v-btn
              density="compact"
              class="btn-garrisons text-garrisons text-start"
              :disabled="loading"
              @click="openEditModal(breakItem)"
            >
              <v-icon class="pe-2">mdi-pencil</v-icon>Edit
            </v-btn>
            <v-btn
              density="compact"
              class="bg-red-darken-1 text-garrisons"
              :disabled="loading"
              @click="openDeleteModal(breakItem.id)"
            >
              <v-icon class="pe-2">mdi-trash-can-outline</v-icon>Delete
            </v-btn>
          </td>
        </tr>

        <!-- Row for Adding a New Break -->
        <tr>
          <td colspan="5" class="text-center">
            <v-btn
              density="compact"
              class="bg-green text-garrisons"
              @click="openAddModal"
              :disabled="loading"
            >
              <v-icon class="pe-2">mdi-plus</v-icon>Add Break
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>

    <!-- Edit Break Dialog -->
    <v-dialog v-model="isEditModalOpen" max-width="400px">
      <v-card class="bg-garrisons text-garrisons">
        <v-card-title>
          <h2 class="headline title-garrisons">
            <span class="mdi mdi-pencil-box"></span> Edit Break
          </h2>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-text-field
            density="compact"
            label="Title"
            v-model="editBreakData.title"
            prepend-inner-icon="mdi-label-outline"
            clearable
            required
          ></v-text-field>
          <v-text-field
            density="compact"
            label="Duration (in minutes)"
            v-model="editableDuration"
            :disabled="editBreakData.all_day"
            prepend-inner-icon="mdi-timer-outline"
            type="number"
            clearable
            required
          ></v-text-field>
          <v-switch
            label="All Day"
            v-model="editBreakData.all_day"
            @change="handleAllDayToggle(editBreakData)"
            prepend-inner-icon="mdi-check-circle-outline"
          ></v-switch>
        </v-card-text>
        <v-card-actions>
          <v-btn
            class="bg-red-darken-1 text-garrisons ms-2"
            density="comfortable"
            :disabled="loading"
            @click="closeEditModal"
          >
            Cancel
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            class="bg-green text-garrisons"
            density="comfortable"
            :disabled="loading"
            @click="saveEdit"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Add New Break Dialog -->
    <v-dialog v-model="isAddModalOpen" max-width="400px">
      <v-card class="bg-garrisons text-garrisons">
        <v-card-title>
          <h2 class="headline title-garrisons">
            <span class="mdi mdi-plus"></span> Add New Break
          </h2>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-text-field
            density="compact"
            label="Title"
            v-model="newBreak.title"
            prepend-inner-icon="mdi-label-outline"
            clearable
            required
          ></v-text-field>
          <v-text-field
            density="compact"
            label="Duration (in minutes)"
            v-model="newEditableDuration"
            :disabled="newBreak.all_day"
            prepend-inner-icon="mdi-timer-outline"
            type="number"
            clearable
            required
          ></v-text-field>
          <v-switch
            label="All Day"
            v-model="newBreak.all_day"
            @change="handleAllDayToggle(newBreak)"
            prepend-inner-icon="mdi-check-circle-outline"
          ></v-switch>
        </v-card-text>
        <v-card-actions>
          <v-btn
            class="bg-red-darken-1 text-garrisons ms-2"
            density="comfortable"
            :disabled="loading"
            @click="closeAddModal"
          >
            Cancel
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            class="bg-green text-garrisons"
            density="comfortable"
            :disabled="loading"
            @click="addBreak"
          >
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
// Correct variable names from 'break' to 'breakItem' or 'breakData'
import { ref, computed, onMounted } from "vue";
import apiClient from "@/utils/apiClient";
import { useToast } from "vue-toastification";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const token = sessionStorage.getItem("accessToken");
const breaks = ref([]);
const searchQuery = ref("");
const loading = ref(false);
// Edit break form data
const editBreakData = ref({
  id: null,
  title: "",
  duration: null,
  all_day: false,
});
// New break form data
const newBreak = ref({
  title: "",
  duration: null,
  all_day: false,
});
const isDeleteModalOpen = ref(false); // Control the modal visibility
const selectedBreakId = ref(null); // Store the ID of the break to be deleted
const isEditModalOpen = ref(false); // Control the edit modal visibility
const isAddModalOpen = ref(false); // Control the add modal visibility
const toast = useToast();

// Handle the toggle of the all_day switch
const handleAllDayToggle = (breakData) => {
  if (breakData.all_day) {
    breakData.duration = null; // Clear duration when all_day is true
  }
};

// Fetch breaks from backend
const fetchBreaks = async () => {
  if (!token) {
    showToast("You are not logged in. Please log in again.", "error");
    return;
  }
  loading.value = true;
  try {
    const response = await apiClient.get("http://localhost:5000/api/breaks", {
      headers: { Authorization: `Bearer ${token}` },
    });
    breaks.value = response.data;
  } catch (error) {
    console.error("Error fetching breaks", error);
  } finally {
    loading.value = false;
  }
};

// Open edit modal and load selected break data
const openEditModal = (breakItem) => {
  editBreakData.value = { ...breakItem }; // Load break data into the modal
  isEditModalOpen.value = true;
};

// Close edit modal
const closeEditModal = () => {
  isEditModalOpen.value = false;
};

// Open add modal
const openAddModal = () => {
  newBreak.value = { title: "", duration: null, all_day: null }; // Reset the new break data
  isAddModalOpen.value = true;
};

// Close add modal
const closeAddModal = () => {
  isAddModalOpen.value = false;
};

// Open delete confirmation modal
const openDeleteModal = (breakId) => {
  selectedBreakId.value = breakId; // Set the ID for deletion
  isDeleteModalOpen.value = true; // Open modal
};

// Close delete modal
const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
};

// Confirm the deletion of the break
const confirmDelete = async (id) => {
  console.log("Break ID to delete:", id);
  if (!token) {
    showToast("You are not logged in. Please log in again.", "error");
    return;
  }
  loading.value = true;
  try {
    await apiClient.delete(`http://localhost:5000/api/breaks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    breaks.value = breaks.value.filter((breakItem) => breakItem.id !== id);
    toast.success("Break deleted successfully!");
    closeDeleteModal();
  } catch (error) {
    toast.error("Failed to delete break.");
    console.error("Error deleting break:", error);
  } finally {
    loading.value = false;
  }
};

// Save edited break data from modal
const saveEdit = async () => {
  if (!token) {
    toast.error("You are not logged in. Please log in again.");
    return;
  }
  loading.value = true;
  try {
    await apiClient.put(
      `http://localhost:5000/api/breaks/${editBreakData.value.id}`,
      editBreakData.value,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const index = breaks.value.findIndex(
      (s) => s.id === editBreakData.value.id
    );
    breaks.value[index] = { ...editBreakData.value }; // Update the break list
    isEditModalOpen.value = false;
    toast.success("Break updated successfully!");
  } catch (error) {
    toast.error("Failed to update break.");
    console.error("Error updating break:", error);
  } finally {
    loading.value = false;
  }
};

// Add a new break from modal
const addBreak = async () => {
  if (!token) {
    toast.error("You are not logged in. Please log in again.");
    return;
  }
  loading.value = true;
  try {
    const response = await apiClient.post(
      "http://localhost:5000/api/breaks",
      newBreak.value,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    breaks.value.push(response.data); // Add new break to the list
    toast.success("New break added successfully!");
    closeAddModal();
  } catch (error) {
    toast.error("Error adding break");
    console.error("Error adding break:", error);
  } finally {
    loading.value = false;
  }
};

// Computed property to filter breaks based on search query
const filteredBreaks = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return breaks.value.filter((breakItem) =>
    ["title", "duration", "all_day"].some((key) =>
      String(breakItem[key]).toLowerCase().includes(query)
    )
  );
});

// Create a computed property for the duration input to control the binding
const editableDuration = computed({
  get() {
    return editBreakData.value.all_day ? null : editBreakData.value.duration;
  },
  set(value) {
    if (!editBreakData.value.all_day) {
      editBreakData.value.duration = value;
    }
  },
});

// Similarly for the new break
const newEditableDuration = computed({
  get() {
    return newBreak.value.all_day ? null : newBreak.value.duration;
  },
  set(value) {
    if (!newBreak.value.all_day) {
      newBreak.value.duration = value;
    }
  },
});

// Fetch breaks on component mount
onMounted(fetchBreaks);
</script>

<style scoped>
@import "@/assets/styles/dashboard.css";
</style>
