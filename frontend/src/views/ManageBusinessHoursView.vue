<template>
    <div>
      <h1 class="text-center title-garrisons pt-1">Manage Business Hours</h1>
      <!-- <v-divider></v-divider> -->
       <AdminBusinessHours></AdminBusinessHours>
    </div>
  </template>
  
  <script>
  import AdminBusinessHours from '@/components/AdminBusinessHours.vue';
  export default {
    name: 'ManageBusinessHoursView',
    components: {
        AdminBusinessHours,
    }
  }
  </script>
  