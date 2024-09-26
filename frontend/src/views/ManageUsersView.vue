<template>
    <div>
      <h1 class="text-center title-garrisons pt-1">{{t('dashboard.manageUsers.title')}}</h1>
      <!-- <v-divider></v-divider> -->
      <AdminUsers></AdminUsers>
    </div>
  </template>
  
  <script>
  import AdminUsers from '@/components/AdminUsers.vue';
  import { useI18n } from 'vue-i18n';
  export default {
    name: 'ManageUsersView',
    components:{
      AdminUsers,
    },
    setup() {
    const { t } = useI18n();
    return {
      t,
    };
  },
  }
  </script>
  