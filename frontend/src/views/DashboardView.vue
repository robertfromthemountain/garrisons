<template>
  <v-app>
    <v-navigation-drawer app>
      <v-list>
        <v-list-item class="title-garrisons" :title="t('dashboard.title')" />
        <v-divider></v-divider>

        <v-list-item
          link
          :title="t('dashboard.manageEvents.title')"
          to="/dashboard/manageEvents"
        ></v-list-item>
        <v-list-item
          link
          title="Pending Events"
          to="/dashboard/pendingEvents"
        ></v-list-item>
        <v-list-item
          link
          title="Services"
          to="/dashboard/manageServices"
        ></v-list-item>
        <v-list-item
          link
          title="Users"
          to="/dashboard/manageUsers"
        ></v-list-item>
        <v-list-item
          link
          title="Modified Events"
          to="/dashboard/modifiedEvents"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- The main content where your child routes will be displayed -->
    <v-main class="bg-garrisons">
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { useI18n } from 'vue-i18n';
export default {
  name: "DashboardView",
  created() {
    this.$router.push("/dashboard/manageEvents");
  },
  setup(){
    const { t } = useI18n();
    return{
      t,
    }
  },
};
</script>

<style>
.v-navigation-drawer {
  background-color: #201b18;
  border-right: 4px solid #6a4e35;
}
</style>