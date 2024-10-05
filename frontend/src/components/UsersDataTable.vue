<template>
    <v-data-table
      :items-per-page="itemsPerPage"
      :headers="headers"
      :items="paginatedItems"
      :items-length="totalItems"
      :loading="loading"
      class="elevation-1"
      @update:options="updateOptions"
    >
      <template v-slot:tfoot>
        <tr>
          <td>
            <v-text-field
              v-model="firstName"
              class="ma-2"
              density="compact"
              placeholder="Search first name..."
              hide-details
            ></v-text-field>
          </td>
          <td>
            <v-text-field
              v-model="lastName"
              class="ma-2"
              density="compact"
              placeholder="Search last name..."
              hide-details
            ></v-text-field>
          </td>
          <td>
            <v-text-field
              v-model="role"
              class="ma-2"
              density="compact"
              placeholder="Search role..."
              hide-details
            ></v-text-field>
          </td>
        </tr>
      </template>
    </v-data-table>
  </template>
  
  <script>
import apiClient from '@/utils/apiClient';
  export default {
    data() {
      return {
        itemsPerPage: 5, // Default items per page
        options: {}, // This will manage pagination and sorting options
        headers: [
          { text: 'ID', value: 'id', align: 'start', sortable: true },
          { text: 'First Name', value: 'firstName', align: 'start', sortable: true },
          { text: 'Last Name', value: 'lastName', align: 'start', sortable: true },
          { text: 'Email', value: 'email', align: 'start', sortable: true },
          { text: 'Phone', value: 'phoneNumber', align: 'start', sortable: true },
          { text: 'Role', value: 'role', align: 'start', sortable: true },
        ],
        allItems: [], // This will hold all users data from the API
        filteredItems: [], // This will hold the filtered data based on search
        paginatedItems: [], // Items displayed on the current page
        loading: true,
        totalItems: 0, // Total number of filtered items
        firstName: '', // Search field for first name
        lastName: '', // Search field for last name
        role: '', // Search field for role
      };
    },
    watch: {
      // Watch for changes in the search fields and re-filter the data
      firstName() {
        this.filterItems();
      },
      lastName() {
        this.filterItems();
      },
      role() {
        this.filterItems();
      },
      // Watch for options update
      options: {
        handler() {
          this.paginateItems();
        },
        deep: true,
      },
    },
    created() {
      this.fetchUsers();
    },
    methods: {
      async fetchUsers() {
        // Check if the user is logged in
        if (!this.$store.getters.isLoggedIn) return;
  
        // Get the token from the Vuex store
        const token = this.$store.getters.accessToken;
  
        // Decode the payload from the JWT token
        const payload = JSON.parse(atob(token.split(".")[1]));
  
        // Check if the token has expired
        const currentTime = Math.floor(Date.now() / 1000);
        if (payload.exp < currentTime) {
          console.log("Token has expired");
          return;
        }
  
        // If the token is valid, fetch the users from the backend
        try {
          const response = await apiClient.get("http://localhost:5000/api/users", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          // Exclude password from the data
          this.allItems = response.data.map(user => {
            const { password, ...userWithoutPassword } = user; // Remove password
            return userWithoutPassword;
          });
  
          this.totalItems = this.allItems.length;
          this.filterItems(); // Filter and paginate the items after fetching
          this.loading = false;
        } catch (error) {
          console.error("Error fetching users:", error);
          this.loading = false;
        }
      },
      filterItems() {
        // Filter the users based on firstName, lastName, and role
        let filtered = this.allItems.filter((user) => {
          return (
            (!this.firstName || user.firstName.toLowerCase().includes(this.firstName.toLowerCase())) &&
            (!this.lastName || user.lastName.toLowerCase().includes(this.lastName.toLowerCase())) &&
            (!this.role || user.role.toLowerCase().includes(this.role.toLowerCase()))
          );
        });
        this.totalItems = filtered.length;
        this.filteredItems = filtered;
        this.paginateItems(); // Paginate the filtered items
      },
      paginateItems() {
        // Apply pagination to filtered items
        const start = (this.options.page - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        this.paginatedItems = this.filteredItems.slice(start, end);
      },
      updateOptions(newOptions) {
        this.options = newOptions; // Update pagination and sorting options
      },
    },
  };
  </script>
  