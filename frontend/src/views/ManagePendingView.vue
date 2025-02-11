<template>
  <div>
    <h1 class="text-center title-garrisons pt-1">{{ t("dashboard.managePendingEvents.title") }}</h1>
    <!-- <v-divider></v-divider> -->
    <AdminPendingEvents></AdminPendingEvents>
    <!-- Add your form and service management logic here -->
  </div>
</template>
  
  <script>
import AdminPendingEvents from "@/components/AdminPendingEvents.vue";
import { useI18n } from "vue-i18n";
export default {
  name: "ManagePendingView",
  components: {
    AdminPendingEvents,
  },
  setup() {
    const { t } = useI18n();
    return {
      t,
    };
  },
};
</script>
  