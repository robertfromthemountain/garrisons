<template>
  <div>
    <h1 class="text-center title-garrisons pt-1">{{t('dashboard.manageEvents.title')}}</h1>
    <v-divider></v-divider>
    <AdminCalendar class="h-50"></AdminCalendar>
  </div>
</template>
  
  <script>
import AdminCalendar from "@/components/AdminCalendar.vue";
import { useI18n } from "vue-i18n";
export default {
  name: "ManageEventsView",
  components: {
    AdminCalendar,
  },
  setup() {
    const { t } = useI18n();
    return {
      t,
    };
  },
};
</script>
  