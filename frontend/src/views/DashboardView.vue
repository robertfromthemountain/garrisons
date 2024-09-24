<template>
  <v-app>
    <v-navigation-drawer app>
      <v-list>
        <v-list-item title="Admin Dashboard" />
        <v-divider></v-divider>

        <v-list-item link title="Services" to="/dashboard/manageServices"></v-list-item>
        <v-list-item link title="Events" to="/dashboard/manageEvents"></v-list-item>
        <v-list-item link title="Users" to="/dashboard/manageUsers"></v-list-item>
        <v-list-item link title="News" to="/dashboard/manageNews"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- The main content where your child routes will be displayed -->
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "DashboardView",
};
</script>

