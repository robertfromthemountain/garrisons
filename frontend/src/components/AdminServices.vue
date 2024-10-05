<template>
  <div>
    <h2 class="text-center subtitle-garrisons text-subtitle-1 text-uppercase">
      {{ t("dashboard.manageServices.subtitle") }}
    </h2>
    <!-- <v-divider></v-divider> -->
    <v-progress-linear
      v-if="loading"
      indeterminate
      color="primary"
      class="mb-4"
    ></v-progress-linear>
    <!-- Display Services Table -->
    <v-table height="100vh" fixed-header class="bg-garrisons mt-5">
      <thead class="bg-garrisons">
        <tr>
          <!-- <th>ID</th> -->
          <th>
      <v-icon class="me-2">mdi-label-outline</v-icon>Title
    </th>
    <th>
      <v-icon class="me-2">mdi-cash-multiple</v-icon>Price
    </th>
    <th>
      <v-icon class="me-2">mdi-timer-outline</v-icon>Duration
    </th>
          <th>
            <v-text-field
              v-model="searchQuery"
              label="Search Services"
              density="compact"
              placeholder="Search by title, price, or duration"
              append-inner-icon="mdi-magnify"
              
            ></v-text-field>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="service in filteredServices" :key="service.id" class="text-start">
          <td>{{ service.title }}</td>
          <td>{{ service.price }}</td>
          <td>{{ service.duration }}</td>
          <td>
            <v-btn
              density="compact"
              class="btn-garrisons text-garrisons text-start"
              :disabled="loading"
              @click="openEditModal(service)"
            >
              <v-icon class="pe-2">mdi-pencil</v-icon>Edit
            </v-btn>
            <v-btn
              density="compact"
              class="bg-red-darken-1 text-garrisons"
              :disabled="loading"
              @click="openDeleteModal(service.id)"
            >
              <v-icon class="pe-2">mdi-trash-can-outline</v-icon>Delete
            </v-btn>
          </td>
        </tr>

        <!-- Row for Adding a New Service -->
        <tr>
          <!-- <td colspan="4" class="text-center">Add a new service</td> -->
          <td colspan="4" class="text-center">
            <v-btn
              density="compact"
              class="bg-green text-garrisons"
              @click="openAddModal"
              :disabled="loading"
            >
              <v-icon class="pe-2">mdi-plus</v-icon>Add Service
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>

    <!-- Edit Service Dialog -->
    <v-dialog v-model="isEditModalOpen" max-width="400px">
      <v-card class="bg-garrisons text-garrisons">
        <v-card-title>
          <h2 class="headline title-garrisons">
            <span class="mdi mdi-pencil-box"></span>
            Edit Service
          </h2>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-text-field
            density="compact"
            label="Title"
            v-model="editServiceData.title"
            prepend-inner-icon="mdi-label-outline"
            clearable
            required
          ></v-text-field>
          <v-text-field
            density="compact"
            label="Price"
            v-model="editServiceData.price"
            prepend-inner-icon="mdi-currency-usd"
            type="number"
            clearable
            required
          ></v-text-field>
          <v-text-field
            density="compact"
            label="Duration (in minutes)"
            v-model="editServiceData.duration"
            prepend-inner-icon="mdi-timer-outline"
            type="number"
            clearable
            required
          ></v-text-field>
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
            :disabled="
              !editServiceData.title ||
              !editServiceData.price ||
              !editServiceData.duration ||
              loading
            "
            @click="saveEdit"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Add New Service Dialog -->
    <v-dialog v-model="isAddModalOpen" max-width="400px">
      <v-card class="bg-garrisons text-garrisons">
        <v-card-title>
          <h2 class="headline title-garrisons">
            <span class="mdi mdi-plus"></span>
            Add New Service
          </h2>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-text-field
            density="compact"
            label="Title"
            v-model="newService.title"
            prepend-inner-icon="mdi-label-outline"
            clearable
            required
          ></v-text-field>
          <v-text-field
            density="compact"
            label="Price"
            v-model="newService.price"
            prepend-inner-icon="mdi-currency-usd"
            type="number"
            clearable
            required
          ></v-text-field>
          <v-text-field
            density="compact"
            label="Duration (in minutes)"
            v-model="newService.duration"
            prepend-inner-icon="mdi-timer-outline"
            type="number"
            clearable
            required
          ></v-text-field>
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
            :disabled="
              !newService.title ||
              !newService.price ||
              !newService.duration ||
              loading
            "
            @click="addService"
          >
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Confirmation Modal for Deleting Service -->
    <ConfirmDeleteModal
      :isOpen="isDeleteModalOpen"
      :selectedEventId="selectedServiceId"
      title="Delete Service"
      message="Are you sure you want to delete this service? This action cannot be undone."
      @cancel="closeDeleteModal"
      @confirm="confirmDelete"
      @update:isOpen="(val) => (isDeleteModalOpen = val)"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import apiClient from "@/utils/apiClient";
import { useToast } from "vue-toastification";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const token = sessionStorage.getItem("accessToken");
const services = ref([]);
const searchQuery = ref("");
const isEditing = ref({}); // Track which row is being edited
const loading = ref(false);
const editServiceData = ref({
  id: null,
  title: "",
  price: null,
  duration: null,
}); // Store the currently editing service's data
const newService = ref({
  title: "",
  price: null,
  duration: null,
});
const isDeleteModalOpen = ref(false); // Control the modal visibility
const selectedServiceId = ref(null); // Store the ID of the service to be deleted
const isEditModalOpen = ref(false); // Control the edit modal visibility
const isAddModalOpen = ref(false); // Control the add modal visibility
const toast = useToast();

// Fetch services from backend
const fetchServices = async () => {
  if (!token) {
    showToast("You are not logged in. Please log in again.", "error");
    return;
  }
  loading.value = true;
  try {
    const response = await apiClient.get("http://localhost:5000/api/services", {
      headers: { Authorization: `Bearer ${token}` },
    });
    services.value = response.data;
  } catch (error) {
    console.error("Error fetching services", error);
  } finally {
    loading.value = false;
  }
};

// Open edit modal and load selected service data
const openEditModal = (service) => {
  editServiceData.value = { ...service }; // Load service data into the modal
  isEditModalOpen.value = true;
};

// Close edit modal
const closeEditModal = () => {
  isEditModalOpen.value = false;
};

// Open add modal
const openAddModal = () => {
  newService.value = { title: "", price: null, duration: null }; // Reset the new service data
  isAddModalOpen.value = true;
};

// Close add modal
const closeAddModal = () => {
  isAddModalOpen.value = false;
};

// Open delete confirmation modal
const openDeleteModal = (serviceId) => {
  selectedServiceId.value = serviceId; // Set the ID for deletion
  isDeleteModalOpen.value = true; // Open modal
};

// Close delete modal
const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
};

// Confirm the deletion of the service
const confirmDelete = async (id) => {
  console.log("Service ID to delete:", id);
  if (!token) {
    showToast("You are not logged in. Please log in again.", "error");
    return;
  }
  loading.value = true;
  try {
    await apiClient.delete(`http://localhost:5000/api/services/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    services.value = services.value.filter((service) => service.id !== id);
    toast.success("Service deleted successfully!");
    closeDeleteModal();
  } catch (error) {
    toast.error("Failed to delete service.");
    console.error("Error deleting service:", error);
  } finally {
    loading.value = false;
  }
};

// Save edited service data from modal
const saveEdit = async () => {
  if (!token) {
    toast.error("You are not logged in. Please log in again.");
    return;
  }
  loading.value = true;
  try {
    await apiClient.put(
      `http://localhost:5000/api/services/${editServiceData.value.id}`,
      editServiceData.value,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const index = services.value.findIndex(
      (s) => s.id === editServiceData.value.id
    );
    services.value[index] = { ...editServiceData.value }; // Update the service list
    isEditModalOpen.value = false;
    toast.success("Service updated successfully!");
  } catch (error) {
    toast.error("Failed to update service.");
    console.error("Error updating service:", error);
  } finally {
    loading.value = false;
  }
};

// Add a new service from modal
const addService = async () => {
  if (!token) {
    toast.error("You are not logged in. Please log in again.");
    return;
  }
  loading.value = true;
  try {
    const response = await apiClient.post(
      "http://localhost:5000/api/services",
      newService.value,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    services.value.push(response.data); // Add new service to the list
    toast.success("New service added successfully!");
    closeAddModal();
  } catch (error) {
    toast.error("Error adding service");
    console.error("Error adding service:", error);
  } finally {
    loading.value = false;
  }
};

// Computed property to filter services based on search query
const filteredServices = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return services.value.filter((service) =>
    ["title", "price", "duration"].some((key) =>
      String(service[key]).toLowerCase().includes(query)
    )
  );
});

// Fetch services on component mount
onMounted(fetchServices);
</script>

<style scoped>
@import "@/assets/styles/dashboard.css";
</style>
