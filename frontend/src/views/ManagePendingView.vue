<template>
    <div>
      <h1>Manage Pending Events</h1>
      <v-divider></v-divider>
      <AdminPendingEvents></AdminPendingEvents>
      <!-- Add your form and service management logic here -->
    </div>
  </template>
  
  <script>
  import AdminPendingEvents from '@/components/AdminPendingEvents.vue';
  export default {
    name: 'ManagePendingView',
    components: {
        AdminPendingEvents,
    }
  }
  </script>
  