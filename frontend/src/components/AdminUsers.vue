<template>
    <div>
      <h2>User Management</h2>
  
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
          <!-- Loop through existing users -->
          <tr v-for="(user, index) in users" :key="user.id">
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
            <td v-else><input v-model="editUserData.phoneNumber" type="tel" /></td>
  
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
  
          <!-- Editable row for adding a new user -->
          <tr>
            <td>New</td>
            <td><input v-model="newUser.firstName" placeholder="First Name" /></td>
            <td><input v-model="newUser.lastName" placeholder="Last Name" /></td>
            <td><input v-model="newUser.role" placeholder="Role" /></td>
            <td><input v-model="newUser.email" type="email" placeholder="Email" /></td>
            <td><input v-model="newUser.phoneNumber" type="tel" placeholder="Phone" /></td>
            <td>
              <button @click="addUser">Add</button>
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
      const users = ref([]);
      const isEditing = reactive({}); // Track which row is being edited
      const editUserData = reactive({
        id: null,
        firstName: "",
        lastName: "",
        role: "",
        email: "",
        phoneNumber: "",
      });
      const newUser = reactive({
        firstName: "",
        lastName: "",
        role: "",
        email: "",
        phoneNumber: "",
        password: "",
      });
  
      // Fetch all users from backend
      const fetchUsers = async () => {
        try {
          const response = await axios.get("http://localhost:5000/api/users");
          users.value = response.data; // Populate users with data from API
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };
  
      // Start editing a specific user row
      const startEdit = (index, user) => {
        isEditing[index] = true; // Set this row to be in edit mode
        Object.assign(editUserData, user);
      };
  
      // Cancel editing for a specific row
      const cancelEdit = (index) => {
        isEditing[index] = false; // Exit edit mode for this row
      };
  
      // Save changes for the edited user
      const saveEdit = async (index) => {
        try {
          await axios.put(`http://localhost:5000/api/users/${editUserData.id}`, editUserData);
          users.value[index] = { ...editUserData }; // Update the row with new data
          isEditing[index] = false; // Exit edit mode
        } catch (error) {
          console.error("Error updating user:", error);
        }
      };
  
      // Add a new user
      const addUser = async () => {
        try {
          if (!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.phone || !newUser.password) {
            alert("All fields are required");
            return;
          }
          const response = await axios.post("http://localhost:5000/api/users", newUser);
          users.value.push(response.data); // Add new user to the list
          // Clear the new user form
          Object.assign(newUser, { firstName: "", lastName: "", role: "", email: "", phoneNumber: "", password: "" });
        } catch (error) {
          console.error("Error adding user:", error);
        }
      };
  
      // Delete a user
      const deleteUser = async (id) => {
        try {
          if (confirm("Are you sure you want to delete this user?")) {
            await axios.delete(`http://localhost:5000/api/users/${id}`);
            users.value = users.value.filter((u) => u.id !== id); // Remove from list
          }
        } catch (error) {
          console.error("Error deleting user:", error);
        }
      };
  
      // Fetch users when the component is mounted
      onMounted(fetchUsers);
  
      return {
        users,
        isEditing,
        editUserData,
        newUser,
        startEdit,
        cancelEdit,
        saveEdit,
        addUser,
        deleteUser,
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
  