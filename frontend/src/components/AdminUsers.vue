<template>
  <div>
    <h2 class="text-center subtitle-garrisons text-subtitle-1 text-uppercase">
      {{ t("dashboard.manageUsers.subtitle") }}
    </h2>

    <!-- Display Users Table -->
    <v-table height="100vh" fixed-header class="bg-garrisons mt-5">
      <thead class="bg-garrisons">
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>
            <v-text-field
              v-model="searchQuery"
              label="Search Users"
              density="compact"
              clearable
              placeholder="Search by first name, last name, email, etc."
              append-inner-icon="mdi-magnify"
              :disabled="isAnyRowEditing"
            ></v-text-field>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in filteredUsers" :key="user.id">
          <td v-if="!isEditing[index]">
            {{ user.firstName + " " + user.lastName }}
          </td>
          <td v-else>
            <input v-model="editUserData.firstName" placeholder="First Name" />
            <input v-model="editUserData.lastName" placeholder="Last Name" />
          </td>

          <td v-if="!isEditing[index]">{{ user.email }}</td>
          <td v-else>
            <input
              v-model="editUserData.email"
              type="email"
              placeholder="Email"
            />
          </td>

          <td v-if="!isEditing[index]">{{ user.phoneNumber }}</td>
          <td v-else>
            <input
              v-model="editUserData.phoneNumber"
              type="tel"
              placeholder="Phone Number"
            />
          </td>

          <td>
            <div v-if="!isEditing[index]">
              <!-- Disable buttons when any row is being edited -->
              <v-btn
                density="compact"
                class=" btn-garrisons text-garrisons text-start"
                @click="startEdit(index, user)"
                :disabled="isAnyRowEditing"
                ><v-icon class="pe-2">mdi-pencil</v-icon>Edit</v-btn
              >
              <v-btn
                density="compact"
                class=" bg-red-darken-1 text-garrisons"
                @click="openDeleteModal(user.id)"
                :disabled="isAnyRowEditing"
              >
                <v-icon class="pe-2">mdi-trash-can-outline</v-icon>Delete
              </v-btn>
            </div>
            <div v-else>
              <v-btn
                density="compact"
                class=" bg-green text-garrisons"
                @click="saveEdit(index)"
                :disabled="
                  !editUserData.firstName ||
                  !editUserData.lastName ||
                  !editUserData.email ||
                  !editUserData.phoneNumber
                "
              >
                <v-icon class="pe-2">mdi-content-save-all</v-icon>Save
              </v-btn>
              <v-btn
                density="compact"
                class=" bg-red-darken-1 text-garrisons"
                @click="cancelEdit(index)"
                ><v-icon class="pe-2">mdi-cancel</v-icon>Cancel</v-btn
              >
            </div>
          </td>
        </tr>
      </tbody>
    </v-table>

    <!-- Delete Confirmation Modal -->
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
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const users = ref([]);
const searchQuery = ref("");
const isDeleteModalOpen = ref(false);
const selectedUserId = ref(null);
const isEditing = ref({}); // Track which row is being edited
const editUserData = ref({
  id: null,
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
});
const toast = useToast();

// Check if any row is being edited
const isAnyRowEditing = computed(() =>
  Object.values(isEditing.value).includes(true)
);

// Fetch users from the backend
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
  selectedUserId.value = userId;
  isDeleteModalOpen.value = true;
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
  isEditing.value[index] = true;
  editUserData.value = { ...user };
};

// Cancel editing and revert changes
const cancelEdit = (index) => {
  isEditing.value[index] = false;
};

// Save edited user data
const saveEdit = async (index) => {
  try {
    await axios.put(
      `http://localhost:5000/api/users/${editUserData.value.id}`,
      editUserData.value
    );
    users.value[index] = { ...editUserData.value };
    isEditing.value[index] = false;
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
