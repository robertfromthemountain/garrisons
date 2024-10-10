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
        class=""
      >
        <v-card
          height="300"
          width="300"
          @click="openLightbox(index)"
          :disabled="loading"
          color="#201b18"
        >
          <template v-if="loading">
            <div class="d-flex justify-center align-center h-100">
              <v-progress-circular
                indeterminate
                color="#8f6a48"
                size="30"
              ></v-progress-circular>
            </div>
          </template>
          <template v-else>
            <v-img
              :src="image.image_path"
              height="100%"
              width="100%"
              class="fill-height"
              cover
            ></v-img>
          </template>
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

    <!-- Lightbox Dialog for viewing images -->
    <v-dialog v-model="isLightboxOpen" max-width="70%">
      <v-card class="image-viewer">
        <div class="lightbox-wrapper">
          <!-- Previous Arrow Button -->
          <v-btn
            class="prev-arrow text-garrisons"
            variant="plain"
            icon
            @click="prevImage"
          >
            <v-icon large>mdi-chevron-left</v-icon>
          </v-btn>

          <!-- Current Image -->
          <v-img
            :src="currentImage"
            class="lightbox-image"
            max-height="600px"
            max-width="100%"
          ></v-img>

          <!-- Next Arrow Button -->
          <v-btn
            class="next-arrow text-garrisons"
            variant="plain"
            icon
            @click="nextImage"
          >
            <v-icon large>mdi-chevron-right</v-icon>
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
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

// Lightbox-related variables
const isLightboxOpen = ref(false);
const currentImageIndex = ref(0);
const currentImage = ref("");

// Loading state for skeletons
const loading = ref(true);

// Function to fetch images from the backend
const fetchImages = async () => {
  loading.value = true;
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
  } finally {
    // Delay loading state change to ensure the skeleton loader stays for 1.5 seconds
    setTimeout(() => {
      loading.value = false;
    }, 300); // delay here
  }
};

// Open lightbox and display the clicked image
const openLightbox = (index) => {
  currentImageIndex.value = index;
  currentImage.value = images.value[currentImageIndex.value].image_path;
  isLightboxOpen.value = true;
};

// Go to the previous image
const prevImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--;
    currentImage.value = images.value[currentImageIndex.value].image_path;
  }
};

// Go to the next image
const nextImage = () => {
  if (currentImageIndex.value < images.value.length - 1) {
    currentImageIndex.value++;
    currentImage.value = images.value[currentImageIndex.value].image_path;
  }
};

// Fetch images when the component is mounted
onMounted(fetchImages);
</script>

<style scoped>
.image-viewer {
  background-color: #26211ef0;
}

.lightbox-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-image {
  max-width: 80%;
  max-height: 600px;
  object-fit: contain;
}

.prev-arrow,
.next-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
}

.prev-arrow {
  left: 10px;
}

.next-arrow {
  right: 10px;
}
</style>
