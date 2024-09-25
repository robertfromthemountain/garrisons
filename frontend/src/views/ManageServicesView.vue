<template>
  <div>
    <h1>Manage Services</h1>
    <v-divider></v-divider>
    <AdminServices></AdminServices>
  </div>
</template>
  
  <script>
import AdminServices from "@/components/AdminServices.vue";
export default {
  name: "ManageServicesView",
  components: {
    AdminServices,
  },
};
</script>
  