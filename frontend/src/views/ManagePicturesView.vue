<template>
  <div>
    <h1 class="text-center title-garrisons pt-1">Pictures</h1>
    <!-- <v-divider></v-divider> -->
    <!-- Add your form and service management logic here -->
     <AdminPictures></AdminPictures>
  </div>
</template>
  
  <script>
import AdminPictures from "@/components/AdminPictures.vue";
import { useI18n } from "vue-i18n";
export default {
  name: "ManagePicturesView",
  components: {
    AdminPictures,
  },
  setup() {
    const { t } = useI18n();
    return {
      t,
    };
  },
};
</script>
  