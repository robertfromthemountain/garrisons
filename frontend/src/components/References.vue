<script setup>
</script>

<template>
  <section fluid class="mx-auto mt-10 references-bg-color">
    <v-row class="d-flex justify-center"><h2 class="references-title">Munkáim</h2></v-row>
    <v-row>
      <v-sheet class="mx-auto" max-width="800">
        <v-slide-group
          v-model="model"
          class="pa-4 references-bg-color"
          selected-class="bg-success"
          show-arrows
        >
          <v-slide-group-item
            v-for="n in 15"
            :key="n"
            v-slot="{ isSelected, toggle, selectedClass }"
          >
            <v-card
              :class="['ma-4', selectedClass]"
              color="grey-lighten-1"
              height="200"
              width="100"
              @click="toggle"
            >
              <div class="d-flex fill-height align-center justify-center">
                <v-scale-transition>
                  <v-icon
                    v-if="isSelected"
                    color="white"
                    icon="mdi-close-circle-outline"
                    size="48"
                  ></v-icon>
                </v-scale-transition>
              </div>
            </v-card>
          </v-slide-group-item>
        </v-slide-group>
      </v-sheet>
    </v-row>
  </section>
</template>

<style scoped>
.references-bg-color {
  background-color: #26211e;
}

.references-title{
    font-size: xx-large;
  color: #6a4e35;
  text-shadow: 6px 6px 12px rgba(0, 0, 0, 0.8);
  margin-bottom: 20px;
}
</style>