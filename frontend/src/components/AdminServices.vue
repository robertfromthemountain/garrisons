<template>
  <div>
    <h2 class="text-center subtitle-garrisons text-subtitle-1 text-uppercase">
      {{ t("dashboard.manageServices.subtitle") }}
    </h2>

    <!-- Search Input for Services -->
    <v-text-field
      v-model="searchQuery"
      label="Search Services"
      class="mb-4"
      clearable
      placeholder="Search by title, price, or duration"
    ></v-text-field>

    <v-divider></v-divider>

    <!-- Display Services Table -->
    <v-table height="100vh" fixed-header class="bg-garrisons">
      <thead class="bg-garrisons">
        <tr>
          <th class="text-left bg-garrisons">ID</th>
          <th class="text-left">Title</th>
          <th class="text-left">Price</th>
          <th class="text-left">Duration</th>
          <th class="text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        <!-- Loop through filtered services -->
        <tr v-for="(service, index) in filteredServices" :key="service.id">
          <td>{{ service.id }}</td>
          <td v-if="!isEditing[index]">{{ service.title }}</td>
          <td v-else>
            <input v-model="editServiceData.title" placeholder="Title" />
          </td>

          <td v-if="!isEditing[index]">{{ service.price }}</td>
          <td v-else>
            <input
              v-model="editServiceData.price"
              type="number"
              placeholder="Price"
            />
          </td>

          <td v-if="!isEditing[index]">{{ service.duration }}</td>
          <td v-else>
            <input
              v-model="editServiceData.duration"
              type="number"
              placeholder="Duration"
            />
          </td>

          <td>
            <div v-if="!isEditing[index]">
              <button @click="startEdit(index, service)">Edit</button>
              <button @click="deleteService(service.id)">Delete</button>
            </div>
            <div v-else>
              <button
                @click="saveEdit(index)"
                :disabled="
                  !editServiceData.title ||
                  !editServiceData.price ||
                  !editServiceData.duration
                "
              >
                Save
              </button>
              <button @click="cancelEdit(index)">Cancel</button>
            </div>
          </td>
        </tr>

        <!-- Editable row for adding a new service -->
        <tr>
          <td>New</td>
          <td>
            <input v-model="newService.title" placeholder="Enter title" />
          </td>
          <td>
            <input
              v-model="newService.price"
              type="number"
              placeholder="Enter price"
            />
          </td>
          <td>
            <input
              v-model="newService.duration"
              type="number"
              placeholder="Enter duration"
            />
          </td>
          <td>
            <button
              @click="addService"
              :disabled="
                !newService.title || !newService.price || !newService.duration
              "
            >
              Add
            </button>
          </td>
        </tr>
      </tbody>
    </v-table>

    <!-- Import and use the confirmation modal -->
    <ConfirmationModal
      :isOpen="isModalOpen"
      :selectedEventId="selectedServiceId"
      @confirm="handleConfirmDelete"
      @cancel="closeModal"
      @update:isOpen="closeModal"
    />
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import axios from "axios";
import { reactive, ref, computed, onMounted } from "vue";
import { useToast } from "vue-toastification";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal.vue";

const { t } = useI18n();
const toast = useToast();
const services = ref([]);
const isModalOpen = ref(false);  // Controls modal visibility
const selectedServiceId = ref(null);  // Holds the selected service ID for deletion
const searchQuery = ref(""); // Add search query for filtering services
const isEditing = reactive({}); // Track which row is being edited
const editServiceData = reactive({
  id: null,
  title: "",
  price: null,
  duration: null,
});
const newService = reactive({
  title: "",
  price: null,
  duration: null,
});

const showToast = (message, type = "success") => {
  if (type === "success") toast.success(message);
  else if (type === "error") toast.error(message);
  else if (type === "warning") toast.warning(message);
  else if (type === "info") toast.info(message);
};

const handleError = (customMessage, error) => {
  const errorMsg = error?.response?.data?.message || customMessage;
  showToast(errorMsg, "error");
};

// Function to open the delete modal and set the service ID
const openDeleteModal = (id) => {
  selectedServiceId.value = id;  // Store the ID of the service to be deleted
  isModalOpen.value = true;  // Open the confirmation modal
};

// Function to close the modal
const closeModal = () => {
  isModalOpen.value = false;
};

// Fetch all services from backend
const fetchServices = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/services");
    services.value = response.data; // Populate services with data from API
  } catch (error) {
    handleError("Error fetching services", error);
  }
};

// Computed property to filter services based on search query
const filteredServices = computed(() => {
  if (!searchQuery.value) return services.value;
  const query = searchQuery.value.toLowerCase();
  return services.value.filter((service) =>
    ["title", "price", "duration"].some((key) =>
      String(service[key]).toLowerCase().includes(query)
    )
  );
});

// Start editing a specific service row
const startEdit = (index, service) => {
  isEditing[index] = true; // Set this row to be in edit mode
  Object.assign(editServiceData, service);
};

// Cancel editing for a specific row
const cancelEdit = (index) => {
  isEditing[index] = false; // Exit edit mode for this row
};

// Save changes for the edited row
const saveEdit = async (index) => {
  try {
    await axios.put(
      `http://localhost:5000/api/services/${editServiceData.id}`,
      editServiceData
    );
    services.value[index] = { ...editServiceData }; // Update the row with new data
    isEditing[index] = false; // Exit edit mode
    showToast("Service updated successfully!");
  } catch (error) {
    handleError("Error updating service", error);
  }
};

// Add a new service
const addService = async () => {
  try {
    if (!newService.title || !newService.price || !newService.duration) {
      showToast("All fields are required", "warning");
      return;
    }
    const response = await axios.post(
      "http://localhost:5000/api/services",
      newService
    );
    services.value.push(response.data); // Add new service to the list
    showToast("New service added successfully!");

    // Clear the new service form
    newService.title = "";
    newService.price = null;
    newService.duration = null;
  } catch (error) {
    handleError("Error adding service", error);
  }
};

// Function to handle the confirmed deletion
const handleConfirmDelete = async (id) => {
  try {
    await axios.delete(`http://localhost:5000/api/services/${id}`);
    services.value = services.value.filter((service) => service.id !== id);
    toast.success("Service deleted successfully!");
    closeModal();
  } catch (error) {
    toast.error(`Error deleting service: ${error.message}`);
  }
};


// Fetch services when the component is mounted
onMounted(fetchServices);
</script>

<style scoped>
@import "@/assets/styles/dashboard.css";
</style>
