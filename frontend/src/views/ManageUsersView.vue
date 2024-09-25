<template>
    <div>
      <h1>Manage Users</h1>
      <v-divider></v-divider>
      <AdminUsers></AdminUsers>
    </div>
  </template>
  
  <script>
  import AdminUsers from '@/components/AdminUsers.vue';
  export default {
    name: 'ManageUsersView',
    components:{
      AdminUsers,
    }
  }
  </script>
  