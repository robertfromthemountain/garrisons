<template>
  <section fluid class="mx-auto my-12 references-bg-color">

    <v-row v-if="loading" class="d-flex justify-center">
      <v-skeleton-loader
          type="text"
          class="title-skeleton-loader"
        ></v-skeleton-loader>
    </v-row>

    <v-row v-else class="d-flex justify-center">
      <h2 class="references-title">{{ t("references.title") }}</h2>
    </v-row>

    <v-row class="mb-10">
      <v-sheet class="mx-auto" max-width="95vw">
        <v-slide-group class="px-4 bg-garrisons" show-arrows>
          <v-slide-group-item
            v-for="(reference, index) in references"
            :key="index"
          >
            <v-card
              class="mx-3 elevation-5 references-border bg-garrisons"
              height="300"
              width="300"
              :disabled="loading"
              @click="openLightbox(index)"
            >
              <template v-if="loading">
                <div class="d-flex justify-center align-center h-100 bg-grey">
                  <v-progress-circular
                    indeterminate
                    color="#8f6a48"
                    size="30"
                  ></v-progress-circular>
                  <!-- <v-skeleton-loader type="image" width="100%" height="100%"></v-skeleton-loader> -->
                </div>
              </template>
              <template v-else>
                <v-img
                  :src="reference.image_path"
                  :alt="reference.alt || 'Reference Work'"
                  height="100%"
                  width="100%"
                  class="fill-height rounded"
                  cover
                ></v-img>
              </template>
            </v-card>
          </v-slide-group-item>
        </v-slide-group>
      </v-sheet>
    </v-row>

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
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import apiClient from "@/utils/apiClient";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

// Reactive state variables
const references = ref([]);
const isLightboxOpen = ref(false);
const currentImageIndex = ref(0);
const currentImage = ref("");
const loading = ref(true); // Loading state for images

// Fetch the newest 15 images from the backend
const fetchReferences = async () => {
  loading.value = true;
  try {
    const response = await apiClient.get("/api/images", {
      params: {
        page: 1,
        limit: 15, // Fetch only the newest 15 images
        sort: "created_at", // Assuming you sort by created_at timestamp in the backend
        order: "desc", // Newest images first
      },
    });
    references.value = response.data;
  } catch (error) {
    console.error("Error fetching references:", error);
  } finally {
    setTimeout(() => {
      loading.value = false; // Simulate a delay before displaying the images
    }, 300); // 1.5 sec delay for loading
  }
};

// Open lightbox and display the clicked image
const openLightbox = (index) => {
  currentImageIndex.value = index;
  currentImage.value = references.value[currentImageIndex.value].image_path;
  isLightboxOpen.value = true;
};

// Go to the previous image
const prevImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--;
    currentImage.value = references.value[currentImageIndex.value].image_path;
  }
};

// Go to the next image
const nextImage = () => {
  if (currentImageIndex.value < references.value.length - 1) {
    currentImageIndex.value++;
    currentImage.value = references.value[currentImageIndex.value].image_path;
  }
};

// Fetch references when the component is mounted
onMounted(fetchReferences);
</script>

<style scoped>
.image-viewer {
  background-color: #26211ef0;
}

.references-title {
  font-size: xx-large;
  color: #8f6a48;
  text-shadow: 6px 6px 12px rgba(0, 0, 0, 0.8);
  text-align: start;
  margin-bottom: 20px;
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

.title-skeleton-loader {
  width: 11vw;
  height: 100px;
  background-color: #26211e;
}
</style>