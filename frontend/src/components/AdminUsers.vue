<template>
  <div>
    <h2 class="text-center subtitle-garrisons text-subtitle-1 text-uppercase">
      {{ t("dashboard.manageUsers.subtitle") }}
    </h2>
    <v-progress-linear
      v-if="loading"
      indeterminate
      color="primary"
      class="mb-4"
    ></v-progress-linear>
    <!-- Display Users Table -->
    <v-table height="100vh" fixed-header class="bg-garrisons mt-5">
      <thead class="bg-garrisons">
        <tr>
          <th>
            <v-icon class="me-2">mdi-account-outline</v-icon>
            Name
          </th>
          <th>
            <v-icon class="me-2">mdi-security</v-icon>
            Role
          </th>
          <th>
            <v-icon class="me-2">mdi-email-outline</v-icon>
            Email
          </th>
          <th>
            <v-icon class="me-2">mdi-phone-outline</v-icon>
            Phone
          </th>
          <th>
            <v-text-field
              v-model="searchQuery"
              label="Search Users"
              density="compact"
              placeholder="Search by first name, last name, email, etc."
              append-inner-icon="mdi-magnify"
              :disabled="isAnyRowEditing"
            ></v-text-field>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in filteredUsers" :key="user.id" class="text-start">
          <td>
            {{ user.firstName + " " + user.lastName }}
          </td>
          <td>{{ user.role }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.phoneNumber }}</td>
          <td>
            <v-btn
              density="compact"
              class="btn-garrisons text-garrisons text-start"
              @click="openEditModal(user)"
              :disabled="loading"
            >
              <v-icon class="pe-2">mdi-pencil</v-icon>Edit
            </v-btn>
            <v-btn
              density="compact"
              class="bg-red-darken-1 text-garrisons"
              @click="openDeleteModal(user.id)"
              :disabled="loading"
            >
              <v-icon class="pe-2">mdi-trash-can-outline</v-icon>Delete
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>

    <!-- Edit User Dialog -->
    <v-dialog v-model="isEditModalOpen" max-width="400px">
      <v-card class="bg-garrisons text-garrisons">
        <v-card-title>
          <h2 class="headline title-garrisons">
            <span class="mdi mdi-account-edit"></span>
            {{ t("title") }}
          </h2></v-card-title
        >
        <v-divider></v-divider>
        <v-card-text>
          <v-text-field
            density="compact"
            label="First Name"
            v-model="editUserData.firstName"
            prepend-inner-icon="mdi-account-outline"
            clearable
            required
          ></v-text-field>
          <v-text-field
            density="compact"
            label="Last Name"
            prepend-inner-icon="mdi-account-outline"
            v-model="editUserData.lastName"
            clearable
            required
          ></v-text-field>
          <v-select
            label="Role"
            v-model="editUserData.role"
            prepend-inner-icon="mdi-security"
            :items="roles"
            density="compact"
            required
          ></v-select>
          <v-text-field
            density="compact"
            label="Email"
            v-model="editUserData.email"
            prepend-inner-icon="mdi-email-outline"
            type="email"
            clearable
            required
          ></v-text-field>
          <v-text-field
            density="compact"
            label="Phone Number"
            v-model="editUserData.phoneNumber"
            prepend-inner-icon="mdi-phone-outline"
            type="tel"
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
              !editUserData.firstName ||
              !editUserData.lastName ||
              !editUserData.role ||
              !editUserData.email ||
              !editUserData.phoneNumber ||
              loading
            "
            @click="saveEdit"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
import apiClient from "@/utils/apiClient";
import { useToast } from "vue-toastification";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const token = sessionStorage.getItem("accessToken");
const users = ref([]);
const searchQuery = ref("");
const isDeleteModalOpen = ref(false);
const selectedUserId = ref(null);
const isEditModalOpen = ref(false);
const loading = ref(false);
const roles = ref(["admin", "user"]);
const editUserData = ref({
  id: null,
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
});
const toast = useToast();

// Open edit modal and load selected user data
const openEditModal = (user) => {
  editUserData.value = { ...user }; // Load user data into the modal
  isEditModalOpen.value = true;
};

// Close edit modal
const closeEditModal = () => {
  isEditModalOpen.value = false;
};

// Save user data from modal
const saveEdit = async () => {
  if (!token) {
    showToast("You are not logged in. Please log in again.", "error");
    return;
  }
  loading.value = true;
  try {
    await apiClient.put(
      `http://localhost:5000/api/users/${editUserData.value.id}`,
      editUserData.value,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const index = users.value.findIndex((u) => u.id === editUserData.value.id);
    users.value[index] = { ...editUserData.value }; // Update the user list
    isEditModalOpen.value = false;
    toast.success("User updated successfully!");
  } catch (error) {
    toast.error("Failed to update user.");
    console.error("Error updating user:", error);
  } finally {
    loading.value = false;
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
  if (!token) {
    showToast("You are not logged in. Please log in again.", "error");
    return;
  }
  loading.value = true;
  try {
    await apiClient.delete(`http://localhost:5000/api/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    users.value = users.value.filter((user) => user.id !== id);
    toast.success("User deleted successfully!");
    closeDeleteModal();
  } catch (error) {
    toast.error("Failed to delete user.");
    console.error("Error deleting user:", error);
  } finally {
    loading.value = false;
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
const fetchUsers = async () => {
  try {
    const response = await apiClient.get("http://localhost:5000/api/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    users.value = response.data;
  } catch (error) {
    console.error("Error fetching users", error);
  }
};
onMounted(fetchUsers);
</script>

<style scoped>
@import "@/assets/styles/dashboard.css";
</style>