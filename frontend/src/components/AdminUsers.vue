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
              <button @click="deleteUser(user.id)">Delete</button>
            </div>
            <div v-else>
              <button @click="saveEdit(index)">Save</button>
              <button @click="cancelEdit(index)">Cancel</button>
            </div>
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>


<script>
import { useI18n } from "vue-i18n";
import axios from "axios";
import { reactive, ref, computed, onMounted } from "vue";

export default {
  setup() {
    const { t } = useI18n();

    const users = ref([]);
    const searchQuery = ref(""); // Add search query
    const isEditing = reactive({}); // Track which row is being edited
    const editUserData = reactive({
      id: null,
      firstName: "",
      lastName: "",
      role: "",
      email: "",
      phoneNumber: "",
    });

    // Fetch all users from backend
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users");
        users.value = response.data;
      } catch (error) {
        console.error("Error fetching users:", error);
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

    // Start editing a specific user row
    const startEdit = (index, user) => {
      isEditing[index] = true;
      Object.assign(editUserData, user);
    };

    // Cancel editing for a specific row
    const cancelEdit = (index) => {
      isEditing[index] = false;
    };

    // Save changes for the edited user
    const saveEdit = async (index) => {
      try {
        await axios.put(
          `http://localhost:5000/api/users/${editUserData.id}`,
          editUserData
        );
        users.value[index] = { ...editUserData };
        isEditing[index] = false;
      } catch (error) {
        console.error("Error updating user:", error);
      }
    };

    // Delete a user
    const deleteUser = async (id) => {
      try {
        if (confirm("Are you sure you want to delete this user?")) {
          await axios.delete(`http://localhost:5000/api/users/${id}`);
          users.value = users.value.filter((u) => u.id !== id);
        }
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    };

    onMounted(fetchUsers);

    return {
      t,
      users,
      searchQuery, // Return search query
      filteredUsers, // Return filtered users
      isEditing,
      editUserData,
      startEdit,
      cancelEdit,
      saveEdit,
      deleteUser,
    };
  },
};
</script>
  
<style scoped>
@import "@/assets/styles/dashboard.css";
</style>
  