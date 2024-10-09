<template>
  <v-container>
    <v-row>
      <!-- Display 4 images per row, with 4 rows maximum per page -->
      <v-col
        v-for="(image, index) in images"
        :key="index"
        cols="12"
        sm="6"
        md="3"
      >
        <v-card height="300" width="300">
          <v-img
            :src="image.image_path"
            height="100%"
            width="100%"
            class="fill-height"
            cover
          ></v-img>
        </v-card>
      </v-col>
    </v-row>

    <!-- Conditional Pagination Display -->
    <div v-if="totalImages > 16" class="text-center">
      <v-pagination
        v-model="currentPage"
        :length="totalPages"
        :total-visible="3"
        @input="fetchImages"
        color="primary"
      ></v-pagination>
    </div>
  </v-container>
</template>
  
  <script setup>
import { ref, onMounted } from "vue";
import apiClient from "@/utils/apiClient";

// Reactive state variables
const images = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const totalImages = ref(0);
const itemsPerPage = 16; // Maximum 16 images per page (4 rows x 4 images per row)

// Function to fetch images from the backend
const fetchImages = async () => {
  try {
    const response = await apiClient.get(`/api/images`, {
      params: {
        page: currentPage.value,
        limit: itemsPerPage,
      },
    });

    images.value = response.data;
    totalImages.value = response.data.total; // Assuming total image count from the API
    totalPages.value = Math.ceil(totalImages.value / itemsPerPage);
  } catch (error) {
    console.error("Error fetching images:", error);
  }
};

// Fetch images when the component is mounted
onMounted(fetchImages);
</script>
  