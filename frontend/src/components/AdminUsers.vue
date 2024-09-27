<template>
  <div>
    <h2 class="text-center subtitle-garrisons text-subtitle-1 text-uppercase">
      {{ t("dashboard.manageUsers.subtitle") }}
    </h2>
    <v-col cols="12" lg="3">
    <v-text-field
      v-model="searchQuery"
      label="Search Users"
      class="mt-5 rounded-pill"
      clearable
      placeholder="Search by first name, last name, email, etc."
      append-inner-icon="mdi-magnify"
    ></v-text-field>
  </v-col>

    <v-divider></v-divider>

    <!-- Display Users Table -->
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

          <!-- Editable First Name -->
          <td v-if="!isEditing[index]">{{ user.firstName }}</td>
          <td v-else>
            <input v-model="editUserData.firstName" placeholder="First Name" />
          </td>

          <!-- Editable Last Name -->
          <td v-if="!isEditing[index]">{{ user.lastName }}</td>
          <td v-else>
            <input v-model="editUserData.lastName" placeholder="Last Name" />
          </td>

          <!-- Editable Role -->
          <td v-if="!isEditing[index]">{{ user.role }}</td>
          <td v-else>
            <input v-model="editUserData.role" placeholder="Role" />
          </td>

          <!-- Editable Email -->
          <td v-if="!isEditing[index]">{{ user.email }}</td>
          <td v-else>
            <input
              v-model="editUserData.email"
              type="email"
              placeholder="Email"
            />
          </td>

          <!-- Editable Phone -->
          <td v-if="!isEditing[index]">{{ user.phoneNumber }}</td>
          <td v-else>
            <input
              v-model="editUserData.phoneNumber"
              type="tel"
              placeholder="Phone Number"
            />
          </td>

          <!-- Actions: Edit/Delete or Save/Cancel -->
          <td>
            <div v-if="!isEditing[index]">
              <button @click="startEdit(index, user)">Edit</button>
              <button @click="openDeleteModal(user.id)">Delete</button>
            </div>
            <div v-else>
              <button
                @click="saveEdit(index)"
                :disabled="
                  !editUserData.firstName ||
                  !editUserData.lastName ||
                  !editUserData.email ||
                  !editUserData.phoneNumber
                "
              >
                Save
              </button>
              <button @click="cancelEdit(index)">Cancel</button>
            </div>
          </td>
        </tr>
      </tbody>
    </v-table>

    <!-- Pass custom title and message to the modal -->
    <ConfirmDeleteModal
      :isOpen="isDeleteModalOpen"
      :selectedEventId="selectedUserId"
      title="Delete User"
      message="Are you sure you want to delete this user? This action cannot be undone."
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
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal.vue"; // Import your modal
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const users = ref([]);
const searchQuery = ref("");
const isDeleteModalOpen = ref(false); // Control the modal visibility
const selectedUserId = ref(null); // Store the ID of the user to be deleted
const isEditing = ref({}); // Track which row is being edited
const editUserData = ref({
  id: null,
  firstName: "",
  lastName: "",
  role: "",
  email: "",
  phoneNumber: "",
}); // Store the currently editing user's data
const toast = useToast();

// Fetch users from backend
const fetchUsers = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/users");
    users.value = response.data;
  } catch (error) {
    console.error("Error fetching users", error);
  }
};

// Open delete confirmation modal
const openDeleteModal = (userId) => {
  selectedUserId.value = userId; // Set the ID for deletion
  isDeleteModalOpen.value = true; // Open modal
};

// Close delete modal
const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
};

// Confirm the deletion of the user
const confirmDelete = async (id) => {
  try {
    await axios.delete(`http://localhost:5000/api/users/${id}`);
    users.value = users.value.filter((user) => user.id !== id);
    toast.success("User deleted successfully!");
    closeDeleteModal();
  } catch (error) {
    toast.error("Failed to delete user.");
    console.error("Error deleting user:", error);
  }
};

// Start editing a user
const startEdit = (index, user) => {
  isEditing.value[index] = true; // Track that this row is being edited
  editUserData.value = { ...user }; // Store current user data to edit
};

// Cancel editing and revert changes
const cancelEdit = (index) => {
  isEditing.value[index] = false; // Exit edit mode without saving
};

// Save edited user data
const saveEdit = async (index) => {
  try {
    await axios.put(
      `http://localhost:5000/api/users/${editUserData.value.id}`,
      editUserData.value
    );
    users.value[index] = { ...editUserData.value }; // Update the user in the list
    isEditing.value[index] = false; // Exit edit mode
    toast.success("User updated successfully!");
  } catch (error) {
    toast.error("Failed to update user.");
    console.error("Error updating user:", error);
  }
};

// Computed property to filter users based on search query
const filteredUsers = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return users.value.filter((user) =>
    ["firstName", "lastName", "email", "role", "phoneNumber"].some((key) =>
      String(user[key]).toLowerCase().includes(query)
    )
  );
});

// Fetch users on component mount
onMounted(fetchUsers);
</script>

<style scoped>
@import "@/assets/styles/dashboard.css";
</style>
