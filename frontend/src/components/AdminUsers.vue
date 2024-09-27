<template>
  <div>
    <h2 class="text-center subtitle-garrisons text-subtitle-1 text-uppercase">
      {{ t("dashboard.manageUsers.subtitle") }}
    </h2>

    <!-- Search Input -->
    <v-text-field
      v-model="searchQuery"
      label="Search Users"
      class="mb-4"
      clearable
      placeholder="Search by first name, last name, email, etc."
    ></v-text-field>

    <!-- Display Users Table -->
    <v-divider></v-divider>
    <v-table height="100vh" fixed-header class="bg-garrisons">
      <thead class="bg-garrisons">
        <tr>
          <th>ID</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Role</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <!-- Loop through filtered users -->
        <tr v-for="(user, index) in filteredUsers" :key="user.id">
          <td>{{ user.id }}</td>

          <td v-if="!isEditing[index]">{{ user.firstName }}</td>
          <td v-else><input v-model="editUserData.firstName" /></td>

          <td v-if="!isEditing[index]">{{ user.lastName }}</td>
          <td v-else><input v-model="editUserData.lastName" /></td>

          <td v-if="!isEditing[index]">{{ user.role }}</td>
          <td v-else><input v-model="editUserData.role" /></td>

          <td v-if="!isEditing[index]">{{ user.email }}</td>
          <td v-else><input v-model="editUserData.email" type="email" /></td>

          <td v-if="!isEditing[index]">{{ user.phoneNumber }}</td>
          <td v-else>
            <input v-model="editUserData.phoneNumber" type="tel" />
          </td>

          <td>
            <div v-if="!isEditing[index]">
              <button @click="startEdit(index, user)">Edit</button>
              <button @click="openDeleteModal(user.id)">Delete</button>
            </div>
            <div v-else>
              <button @click="saveEdit(index)">Save</button>
              <button @click="cancelEdit(index)">Cancel</button>
            </div>
          </td>
        </tr>
      </tbody>
    </v-table>

    <!-- Delete Confirmation Modal -->
    <v-dialog v-model="isModalOpen" max-width="600" persistent>
      <v-card class="bg-garrisons text-garrisons">
        <v-card-title
          ><h2 class="headline title-garrisons">
            Confirm Deletion
          </h2></v-card-title
        >
        <v-divider></v-divider>
        <v-card-text>
          <h3>
            Are you sure you want to delete this user? This action cannot be
            undone.
          </h3>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn @click="closeModal">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn class="bg-red-lighten-1 text-garrisons" @click="confirmDelete"
            >Delete</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import axios from "axios";
import { reactive, ref, computed, onMounted } from "vue";
import { useToast } from "vue-toastification";

const { t } = useI18n();
const toast = useToast();

const users = ref([]);
const isModalOpen = ref(false); // Modal visibility control
const selectedUserId = ref(null); // Holds the ID of the user to be deleted
const searchQuery = ref(""); // Search query for filtering users
const isEditing = reactive({}); // Tracks which row is being edited
const editUserData = reactive({
  id: null,
  firstName: "",
  lastName: "",
  role: "",
  email: "",
  phoneNumber: "",
});

// Function to display toast notifications
const showToast = (message, type = "success") => {
  if (type === "success") toast.success(message);
  else if (type === "error") toast.error(message);
  else if (type === "warning") toast.warning(message);
  else if (type === "info") toast.info(message);
};

// Function to handle errors
const handleError = (customMessage, error) => {
  const errorMsg = error?.response?.data?.message || customMessage;
  showToast(errorMsg, "error");
};

// Fetch users from the API
const fetchUsers = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/users");
    users.value = response.data;
  } catch (error) {
    handleError("Error fetching users", error);
  }
};

// Computed property to filter users based on search query
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value;
  const query = searchQuery.value.toLowerCase();
  return users.value.filter((user) =>
    ["firstName", "lastName", "email", "role", "phoneNumber"].some((key) =>
      String(user[key]).toLowerCase().includes(query)
    )
  );
});

// Function to start editing a user
const startEdit = (index, user) => {
  isEditing[index] = true;
  Object.assign(editUserData, user);
};

// Function to cancel editing
const cancelEdit = (index) => {
  isEditing[index] = false;
};

// Function to save changes to a user
const saveEdit = async (index) => {
  try {
    await axios.put(
      `http://localhost:5000/api/users/${editUserData.id}`,
      editUserData
    );
    users.value[index] = { ...editUserData };
    isEditing[index] = false;
    showToast("User updated successfully!");
  } catch (error) {
    handleError("Error updating user", error);
  }
};

// Open the delete confirmation modal
const openDeleteModal = (id) => {
  selectedUserId.value = id;
  isModalOpen.value = true;
};

// Close the delete confirmation modal
const closeModal = () => {
  isModalOpen.value = false;
};

// Confirm the deletion of a user
const confirmDelete = async () => {
  try {
    await axios.delete(
      `http://localhost:5000/api/users/${selectedUserId.value}`
    );
    users.value = users.value.filter((u) => u.id !== selectedUserId.value);
    showToast("User deleted successfully!");
    closeModal();
  } catch (error) {
    handleError("Error deleting user", error);
  }
};

onMounted(fetchUsers);
</script>

<style scoped>
@import "@/assets/styles/dashboard.css";
</style>
