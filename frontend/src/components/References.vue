<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const references = [
  {
    src: new URL("@/assets/images/hc_1.jpg", import.meta.url).href,
    alt: "Reference Work 1",
  },
  {
    src: new URL("@/assets/images/hc_2.jpg", import.meta.url).href,
    alt: "Reference Work 1",
  },
  {
    src: new URL("@/assets/images/hc_3.jpg", import.meta.url).href,
    alt: "Reference Work 1",
  },
  {
    src: new URL("@/assets/images/hc_4.jpg", import.meta.url).href,
    alt: "Reference Work 1",
  },
  {
    src: new URL("@/assets/images/hc_5.jpg", import.meta.url).href,
    alt: "Reference Work 1",
  },
  {
    src: new URL("@/assets/images/hc_6.jpg", import.meta.url).href,
    alt: "Reference Work 1",
  },
  {
    src: new URL("@/assets/images/hc_7.jpg", import.meta.url).href,
    alt: "Reference Work 1",
  },
  // Add more images here
];

// Model to track the selected slide
const model = ref(0);
</script>

<template>
  <section fluid class="mx-auto mt-10 references-bg-color">
    <v-row class="d-flex justify-center">
      <h2 class="references-title">{{t('references.title')}}</h2>
    </v-row>
    <v-row>
      <v-sheet class="mx-auto" max-width="80vw">
        <v-slide-group
          v-model="model"
          class="pa-4 bg-garrisons"
          selected-class="bg-success"
          show-arrows
        >
          <v-slide-group-item
            v-for="(reference, index) in references"
            :key="index"
            v-slot="{ toggle }"
          >
            <v-card
              :class="['mx-3 elevation-5 references-border', selectedClass]"
              color="grey-lighten-1"
              height="300"
              width="300"
              @click="toggle"
            >
              <!-- Image for the reference work -->
              <v-img
                :src="reference.src"
                :alt="reference.alt"
                height="100%"
                width="100%"
                class="fill-height rounded"
                cover
              ></v-img>
            </v-card>
          </v-slide-group-item>
        </v-slide-group>
      </v-sheet>
    </v-row>
  </section>
</template>

<style scoped>
.references-border {
  border: 1px solid #8f6a48;
}
.references-title {
  font-size: xx-large;
  color: #6a4e35;
  text-shadow: 6px 6px 12px rgba(0, 0, 0, 0.8);
  margin-bottom: 20px;
}

.v-card {
  position: relative;
  overflow: hidden;
}

.v-img {
  object-fit: cover;
}

.v-icon {
  position: absolute;
}
</style>