<template>
  <div>
    <h1>Manage Events</h1>
    <v-divider></v-divider>
    <AdminCalendar class="h-50"></AdminCalendar>
  </div>
</template>
  
  <script>
import AdminCalendar from "@/components/AdminCalendar.vue";
export default {
  name: "ManageEventsView",
  components: {
    AdminCalendar,
  },
};
</script>
  