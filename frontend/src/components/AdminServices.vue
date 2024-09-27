<template>
  <div>
    <h2 class="text-center subtitle-garrisons text-subtitle-1 text-uppercase">
      {{ t("dashboard.manageServices.subtitle") }}
    </h2>
    <v-divider></v-divider>
    <!-- Search Input for Services -->
    <v-col cols="12" lg="3">
      <v-text-field
        v-model="searchQuery"
        label="Search Services"
        class="mt-5 rounded-pill"
        clearable
        placeholder="Search by title, price, or duration"
        append-inner-icon="mdi-magnify"
      ></v-text-field>
    </v-col>

    <!-- Display Services Table -->
    <v-table height="100vh" fixed-header class="bg-garrisons">
      <thead class="bg-garrisons">
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Price</th>
          <th>Duration</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <!-- Loop through filtered services -->
        <tr v-for="(service, index) in filteredServices" :key="service.id">
          <!-- Display ID -->
          <td>{{ service.id }}</td>

          <!-- Editable Title -->
          <td v-if="!isEditing[index]">{{ service.title }}</td>
          <td v-else>
            <input v-model="editServiceData.title" placeholder="Title" />
          </td>

          <!-- Editable Price -->
          <td v-if="!isEditing[index]">{{ service.price }}</td>
          <td v-else>
            <input
              v-model="editServiceData.price"
              type="number"
              placeholder="Price"
            />
          </td>

          <!-- Editable Duration -->
          <td v-if="!isEditing[index]">{{ service.duration }}</td>
          <td v-else>
            <input
              v-model="editServiceData.duration"
              type="number"
              placeholder="Duration"
            />
          </td>

          <!-- Actions: Edit/Delete or Save/Cancel -->
          <td>
            <div v-if="!isEditing[index]">
              <button @click="startEdit(index, service)">Edit</button>
              <button @click="openDeleteModal(service.id)">Delete</button>
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

        <!-- Row for Adding a New Service -->
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
import axios from "axios";
import { useToast } from "vue-toastification";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const services = ref([]);
const searchQuery = ref("");
const isEditing = ref({}); // Track which row is being edited
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
const toast = useToast();

// Fetch services from backend
const fetchServices = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/services");
    services.value = response.data;
  } catch (error) {
    console.error("Error fetching services", error);
  }
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
  console.log(id);
  try {
    await axios.delete(`http://localhost:5000/api/services/${id}`);
    services.value = services.value.filter((service) => service.id !== id);
    toast.success("Service deleted successfully!");
    closeDeleteModal();
  } catch (error) {
    toast.error("Failed to delete service.");
    console.error("Error deleting service:", error);
  }
};

// Start editing a service
const startEdit = (index, service) => {
  isEditing.value[index] = true; // Track that this row is being edited
  editServiceData.value = { ...service }; // Store current service data to edit
};

// Cancel editing and revert changes
const cancelEdit = (index) => {
  isEditing.value[index] = false; // Exit edit mode without saving
};

// Save edited service data
const saveEdit = async (index) => {
  try {
    await axios.put(
      `http://localhost:5000/api/services/${editServiceData.value.id}`,
      editServiceData.value
    );
    services.value[index] = { ...editServiceData.value }; // Update the service in the list
    isEditing.value[index] = false; // Exit edit mode
    toast.success("Service updated successfully!");
  } catch (error) {
    toast.error("Failed to update service.");
    console.error("Error updating service:", error);
  }
};

// Add a new service
const addService = async () => {
  try {
    if (
      !newService.value.title ||
      !newService.value.price ||
      !newService.value.duration
    ) {
      toast.warning("All fields are required");
      return;
    }
    const response = await axios.post(
      "http://localhost:5000/api/services",
      newService.value
    );
    services.value.push(response.data); // Add new service to the list
    toast.success("New service added successfully!");

    // Clear the new service form
    newService.value = { title: "", price: null, duration: null };
  } catch (error) {
    toast.error("Error adding service");
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
