<template>
    <div>
      <h1 class="text-center title-garrisons pt-1">{{t('dashboard.manageUsers.title')}}</h1>
      <!-- <v-divider></v-divider> -->
      <AdminUsers></AdminUsers>
       <!-- <UsersDataTable></UsersDataTable> -->
    </div>
  </template>
  
  <script>
  import AdminUsers from '@/components/AdminUsers.vue';
  import UsersDataTable from '@/components/UsersDataTable.vue';
  import { useI18n } from 'vue-i18n';
  export default {
    name: 'ManageUsersView',
    components:{
      AdminUsers,
      UsersDataTable,
    },
    setup() {
    const { t } = useI18n();
    return {
      t,
    };
  },
  }
  </script>
  