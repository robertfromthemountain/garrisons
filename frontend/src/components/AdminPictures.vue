<template>
  <div>
    <h2 class="text-center subtitle-garrisons text-subtitle-1 text-uppercase">
      Here you can upload pictures to the references page.
    </h2>

    <v-progress-linear
      v-if="loading"
      indeterminate
      color="primary"
      class="mb-4"
    ></v-progress-linear>

    <div class="d-flex justify-center">
      <v-col cols="12" md="8">
        <v-card class="pa-5 ma-5 bg-dark-garrisons elevation-8">
          <v-form @submit.prevent="uploadImages" class="text-center">
            <v-file-input
              v-model="images"
              label="Click here to select images"
              accept="image/*"
              density="compact"
              :multiple="true"
              :disabled="loading"
            ></v-file-input>

            <v-btn
              :disabled="loading || !(images?.length)"
              type="submit"
              density="compact"
              class="bg-green text-garrisons"
            >
              Upload Images
            </v-btn>
          </v-form>
        </v-card>
      </v-col>
    </div>

    <!-- Display images in a grid with delete functionality -->
    <v-container>
      <v-row>
        <!-- Display 4 images per row -->
        <v-col
          v-for="(image, index) in displayedImages"
          :key="index"
          cols="6"
          xs="6"
          sm="4"
          md="3"
          lg="3"
          xl="3"
          xxl="2"
          class="d-flex justify-center"
        >
          <div class="d-flex justify-center">
            <v-card
              :height="cardHeight"
              :width="cardWidth"
              class="relative-position image-container"
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

              <!-- Overlay with Delete Button (Using CSS hover) -->
              <div class="overlay">
                <v-btn
                  class="mx-auto bg-red-lighten-1 text-white"
                  @click="confirmDelete(image.id)"
                >
                  Delete
                </v-btn>
              </div>
            </v-card>
          </div>
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

    <!-- Confirm Delete Modal -->
    <ConfirmDeleteModal
      :isOpen="isDeleteModalOpen"
      :title="'Delete Image'"
      :message="'Are you sure you want to delete this image?'"
      @confirm="deleteImage"
      @cancel="isDeleteModalOpen = false"
    />
  </div>
</template>
  
  <script setup>
import { ref, onMounted, computed } from "vue";
import apiClient from "@/utils/apiClient";
import { useToast } from "vue-toastification";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal.vue"; // Import the confirm modal component
import { useDisplay } from "vuetify";

// Access token for authorization
const token = sessionStorage.getItem("accessToken");
const loading = ref(false);
const toast = useToast();
const images = ref([]); // Images for upload
const displayedImages = ref([]); // Images to display
const currentPage = ref(1);
const totalPages = ref(1);
const totalImages = ref(0);
const itemsPerPage = 16; // Maximum 16 images per page
const isDeleteModalOpen = ref(false);
const selectedImageId = ref(null); // Track the selected image for deletion
const { xs, sm, md, lg, xl, xxl } = useDisplay();

// Function to determine card height and width dynamically based on screen size
const cardHeight = computed(() => {
  if (xs.value) return "150"; // Small screens
  if (sm.value) return "175"; // Medium screens
  if (md.value) return "200"; // Medium screens
  if (lg.value) return "250"; // Large screens
  if (xl.value || xxl.value) return "250"; // Extra-large screens
  return "250"; // Fallback
});

const cardWidth = computed(() => {
  if (xs.value) return "150"; // Small screens
  if (sm.value) return "175"; // Medium screens
  if (md.value) return "200"; // Medium screens
  if (lg.value) return "250"; // Large screens
  if (xl.value || xxl.value) return "250"; // Extra-large screens
  return "250"; // Fallback
});

// Function to upload multiple images
const uploadImages = async () => {
  if (!token) {
    toast.error("Authorization token is missing.");
    return;
  }

  if (!images.value.length) {
    toast.error("Please select images to upload.");
    return;
  }

  const formData = new FormData();
  for (let i = 0; i < images.value.length; i++) {
    const file = images.value[i];

    if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
      toast.error("Only JPG, PNG, and GIF images are allowed.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB.");
      return;
    }

    formData.append("images", file); // Append each image
  }

  loading.value = true;
  try {
    const response = await apiClient.post("/api/images/upload-images", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    toast.success("Images uploaded successfully!");
    fetchImages(); // Refresh the displayed images after successful upload
  } catch (error) {
    toast.error("Image upload failed. Please try again.");
  } finally {
    loading.value = false;
    images.value = [];
  }
};

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
    displayedImages.value = response.data;
    totalImages.value = response.data.total;
    totalPages.value = Math.ceil(totalImages.value / itemsPerPage);
  } catch (error) {
    toast.error("Error fetching images.");
  } finally {
    setTimeout(() => {
      loading.value = false; // Simulate a delay before displaying the images
    }, 300); // 1.5 sec delay for loading
  }
};

// Open confirm delete modal
const confirmDelete = (imageId) => {
  selectedImageId.value = imageId;
  isDeleteModalOpen.value = true;
};

// Delete image
const deleteImage = async () => {
  try {
    await apiClient.delete(`/api/images/${selectedImageId.value}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success("Image deleted successfully!");
    fetchImages(); // Refresh the images after deletion
  } catch (error) {
    toast.error("Failed to delete image.");
  } finally {
    isDeleteModalOpen.value = false;
  }
};

// Fetch images when the component is mounted
onMounted(fetchImages);
</script>
  
<style scoped>
.image-container {
  position: relative;
  width: 100%;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  opacity: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.3s ease;
}

.image-container:hover .overlay {
  opacity: 1;
}
</style>