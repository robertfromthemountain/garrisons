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
    <v-table
      v-if="mdAndUp && !smAndDown"
      height="100vh"
      fixed-header
      class="bg-garrisons mt-5"
    >
      <thead class="bg-garrisons">
        <tr>
          <th>
            <v-icon class="me-2">mdi-account-outline</v-icon>
            {{ t("dashboard.manageUsers.table.name") }}
          </th>
          <th>
            <v-icon class="me-2">mdi-security</v-icon>
            {{ t("dashboard.manageUsers.table.role") }}
          </th>
          <th>
            <v-icon class="me-2">mdi-email-outline</v-icon>
            {{ t("dashboard.manageUsers.table.email") }}
          </th>
          <th>
            <v-icon class="me-2">mdi-phone-outline</v-icon>
            {{ t("dashboard.manageUsers.table.phone") }}
          </th>
          <th>
            <v-icon class="me-2">mdi-information-outline</v-icon>
            {{ t("dashboard.manageUsers.table.status") }}
          </th>
          <th>
            <v-text-field
              v-model="searchQuery"
              :label="t('dashboard.manageUsers.table.search')"
              density="compact"
              :placeholder="t('dashboard.manageUsers.table.searchPlaceholder')"
              append-inner-icon="mdi-magnify"
              :disabled="isAnyRowEditing"
              class="input-field-font"
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
          <td>{{ user.status }}</td>
          <td class="d-flex align-center">
            <v-btn
              density="compact"
              class="btn-garrisons text-garrisons text-start"
              @click="openEditModal(user)"
              :disabled="loading"
            >
              <v-icon class="pe-2">mdi-pencil</v-icon
              >{{ t("dashboard.manageUsers.table.buttons.edit") }}
            </v-btn>
            <v-btn
              density="compact"
              class="bg-red-darken-1 text-garrisons"
              @click="openDeleteModal(user.id)"
              :disabled="loading"
            >
              <v-icon class="pe-2">mdi-trash-can-outline</v-icon
              >{{ t("dashboard.manageUsers.table.buttons.delete") }}
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>

    <!-- Display User Cards for smAndDown -->
    <v-row v-if="smAndDown && !mdAndUp" class="d-flex justify-start px-10 my-5">
      <v-col
        cols="12"
        xs="12"
        sm="6"
        v-for="user in filteredUsers"
        :key="user.id"
      >
        <v-card class="bg-dark-garrisons elevation-5">
          <v-card-title>
            <v-icon class="me-1 text-garrisons-2">mdi-account-outline</v-icon
            ><span class="text-garrisons">{{
              user.firstName + " " + user.lastName
            }}</span>
          </v-card-title>
          <v-card-subtitle>
            <v-icon class="me-1 text-garrisons-3">mdi-security</v-icon
            >{{ user.role }}
          </v-card-subtitle>
          <v-card-text>
            <div class="mb-1">
              <v-icon class="me-1 text-garrisons-3">mdi-email-outline</v-icon
              ><span class="text-garrisons">{{ user.email }}</span>
            </div>
            <div class="mb-1">
              <v-icon class="me-1 text-garrisons-3">mdi-phone-outline</v-icon
              ><span class="text-garrisons">{{ user.phoneNumber }}</span>
            </div>
            <div>
              <v-icon class="me-1 text-garrisons-3"
                >mdi-information-outline</v-icon
              ><span class="text-garrisons">{{ user.status }}</span>
            </div>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn
              density="compact"
              class="bg-green text-garrisons ms-2"
              :disabled="loading"
              @click="openEditModal(user)"
            >
              <v-icon class="pe-2">mdi-pencil</v-icon
              >{{ t("dashboard.manageUsers.table.buttons.edit") }}
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              density="compact"
              class="bg-red-darken-1 text-garrisons"
              :disabled="loading"
              @click="openDeleteModal(user.id)"
            >
              <v-icon class="pe-2">mdi-trash-can-outline</v-icon
              >{{ t("dashboard.manageUsers.table.buttons.delete") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Edit User Dialog -->
    <v-dialog v-model="isEditModalOpen" max-width="400px">
      <v-card class="bg-garrisons text-garrisons">
        <v-card-title>
          <h2 class="headline title-garrisons">
            <span class="mdi mdi-account-edit"></span>
            {{ t("dashboard.manageUsers.modal.title") }}
          </h2></v-card-title
        >
        <v-divider></v-divider>
        <v-card-text>
          <v-text-field
            density="compact"
            :label="
              t('dashboard.manageUsers.modal.textFields.labels.firstName')
            "
            v-model="editUserData.firstName"
            prepend-inner-icon="mdi-account-outline"
            clearable
            required
            class="input-field-font"
          ></v-text-field>
          <v-text-field
            density="compact"
            :label="t('dashboard.manageUsers.modal.textFields.labels.lastName')"
            prepend-inner-icon="mdi-account-outline"
            v-model="editUserData.lastName"
            clearable
            required
            class="input-field-font"
          ></v-text-field>
          <v-select
            :label="t('dashboard.manageUsers.modal.textFields.labels.role')"
            v-model="editUserData.role"
            prepend-inner-icon="mdi-security"
            :items="roles"
            density="compact"
            required
            class="input-field-font"
          ></v-select>
          <v-text-field
            density="compact"
            :label="t('dashboard.manageUsers.modal.textFields.labels.email')"
            v-model="editUserData.email"
            prepend-inner-icon="mdi-email-outline"
            type="email"
            clearable
            required
            class="input-field-font"
          ></v-text-field>
          <v-text-field
            density="compact"
            :label="
              t('dashboard.manageUsers.modal.textFields.labels.phoneNumber')
            "
            v-model="editUserData.phoneNumber"
            prepend-inner-icon="mdi-phone-outline"
            type="tel"
            clearable
            required
            class="input-field-font"
          ></v-text-field>
          <v-select
            :label="t('dashboard.manageUsers.modal.textFields.labels.status')"
            v-model="editUserData.status"
            :items="statuses"
            prepend-inner-icon="mdi-information-outline"
            density="compact"
            required
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-btn
            class="bg-red-darken-1 text-garrisons ms-2"
            density="comfortable"
            :disabled="loading"
            @click="closeEditModal"
          >
            {{ t("dashboard.manageUsers.modal.buttons.cancel") }}
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
            {{ t("dashboard.manageUsers.modal.buttons.save") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Modal -->
    <ConfirmDeleteModal
      :isOpen="isDeleteModalOpen"
      :selectedEventId="selectedUserId"
      :title="t('dashboard.manageUsers.deleteModal.title')"
      :message="t('dashboard.manageUsers.deleteModal.message')"
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
import { useDisplay } from "vuetify";

const { t } = useI18n();
const token = sessionStorage.getItem("accessToken");
const users = ref([]);
const searchQuery = ref("");
const isDeleteModalOpen = ref(false);
const selectedUserId = ref(null);
const isEditModalOpen = ref(false);
const loading = ref(false);
const { mdAndUp, smAndDown } = useDisplay();
const roles = ref(["admin", "user"]);
const statuses = ref(["pending", "confirmed", "banned"]); // Add statuses for dropdown
const editUserData = ref({
  id: null,
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  status: "",
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
    showToast(t("dashboard.token.error.tokenError"), "error");
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
    toast.success(t("dashboard.toast.success.userUpdate"));
  } catch (error) {
    toast.error(t("dashboard.toast.error.userUpdate"));
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
    showToast(t("dashboard.toast.error.tokenError"), "error");
    return;
  }
  loading.value = true;
  try {
    await apiClient.delete(`http://localhost:5000/api/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    users.value = users.value.filter((user) => user.id !== id);
    toast.success(t("dashboard.toast.success.userDelete"));
    closeDeleteModal();
  } catch (error) {
    toast.error(t("dashboard.toast.error.userDelete"));
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