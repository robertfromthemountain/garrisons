<template>
  <div>
    <h1 class="text-center title-garrisons pt-1">{{t('dashboard.manageServices.title')}}</h1>
    <!-- <v-divider></v-divider> -->
    <AdminServices></AdminServices>
  </div>
</template>
  
  <script>
import AdminServices from "@/components/AdminServices.vue";
import { useI18n } from "vue-i18n";
export default {
  name: "ManageServicesView",
  components: {
    AdminServices,
  },
  setup() {
    const { t } = useI18n();
    return {
      t,
    };
  },
};
</script>
  