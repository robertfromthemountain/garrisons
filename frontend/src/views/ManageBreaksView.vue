<template>
    <div>
      <h1 class="text-center title-garrisons pt-1">Manage Breaks</h1>
      <!-- <v-divider></v-divider> -->
      <AdminBreaks></AdminBreaks>
    </div>
  </template>
  
  <script>
  import AdminBreaks from '@/components/AdminBreaks.vue';
  export default {
    name: 'ManageBreaksView',
    components: {
      AdminBreaks,
    }
  }
  </script>
  