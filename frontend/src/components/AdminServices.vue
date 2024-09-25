<template>
    <div>
      <h2>Service Management</h2>
  
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
          <!-- Loop through existing services -->
          <tr v-for="(service, index) in services" :key="service.id">
            <td>{{ service.id }}</td>
            <td v-if="!isEditing[index]">{{ service.title }}</td>
            <td v-else><input v-model="editServiceData.title" /></td>
  
            <td v-if="!isEditing[index]">{{ service.price }}</td>
            <td v-else><input v-model="editServiceData.price" type="number" /></td>
  
            <td v-if="!isEditing[index]">{{ service.duration }}</td>
            <td v-else><input v-model="editServiceData.duration" type="number" /></td>
  
            <td>
              <div v-if="!isEditing[index]">
                <button @click="startEdit(index, service)">Edit</button>
                <button @click="deleteService(service.id)">Delete</button>
              </div>
              <div v-else>
                <button @click="saveEdit(index)">Save</button>
                <button @click="cancelEdit(index)">Cancel</button>
              </div>
            </td>
          </tr>
  
          <!-- Editable row for adding a new service -->
          <tr>
            <td>New</td>
            <td><input v-model="newService.title" placeholder="Enter title" /></td>
            <td><input v-model="newService.price" type="number" placeholder="Enter price" /></td>
            <td><input v-model="newService.duration" type="number" placeholder="Enter duration" /></td>
            <td>
              <button @click="addService">Add</button>
            </td>
          </tr>
        </tbody>
      </v-table>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  import { reactive, ref, onMounted } from "vue";
  
  export default {
    setup() {
      const services = ref([]);
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
  
      // Fetch all services from backend
      const fetchServices = async () => {
        try {
          const response = await axios.get("http://localhost:5000/api/services");
          services.value = response.data; // Populate services with data from API
        } catch (error) {
          console.error("Error fetching services:", error);
        }
      };
  
      // Start editing a specific service row
      const startEdit = (index, service) => {
        isEditing[index] = true; // Set this row to be in edit mode
        editServiceData.id = service.id;
        editServiceData.title = service.title;
        editServiceData.price = service.price;
        editServiceData.duration = service.duration;
      };
  
      // Cancel editing for a specific row
      const cancelEdit = (index) => {
        isEditing[index] = false; // Exit edit mode for this row
      };
  
      // Save changes for the edited row
      const saveEdit = async (index) => {
        try {
          await axios.put(`http://localhost:5000/api/services/${editServiceData.id}`, editServiceData);
          services.value[index] = { ...editServiceData }; // Update the row with new data
          isEditing[index] = false; // Exit edit mode
        } catch (error) {
          console.error("Error updating service:", error);
        }
      };
  
      // Add a new service
      const addService = async () => {
        try {
          if (!newService.title || !newService.price || !newService.duration) {
            alert("All fields are required");
            return;
          }
          const response = await axios.post("http://localhost:5000/api/services", newService);
          services.value.push(response.data); // Add new service to the list
          // Clear the new service form
          newService.title = "";
          newService.price = null;
          newService.duration = null;
        } catch (error) {
          console.error("Error adding service:", error);
        }
      };
  
      // Delete a service
      const deleteService = async (id) => {
        try {
          if (confirm("Are you sure you want to delete this service?")) {
            await axios.delete(`http://localhost:5000/api/services/${id}`);
            services.value = services.value.filter((s) => s.id !== id); // Remove from list
          }
        } catch (error) {
          console.error("Error deleting service:", error);
        }
      };
  
      // Fetch services when the component is mounted
      onMounted(fetchServices);
  
      return {
        services,
        isEditing,
        editServiceData,
        newService,
        startEdit,
        cancelEdit,
        saveEdit,
        addService,
        deleteService,
      };
    },
  };
  </script>
  
  <style scoped>
  /* Add any styles you need here */
  th,
  td {
    font-size: large;
  }
  
  input {
    width: 100%;
  }
  
  form {
    font-size: large;
    margin-bottom: 20px;
  }
  </style>
  