<script setup>
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import portraitImage from "../assets/images/portrait_2_transparent.png";

const { t } = useI18n();
</script>

<template>
  <section>
    <v-row no-gutters class="d-flex hero-bg-color pt-10 elevation-8">
      <v-col cols="5" align-self="center">
        <div>
          <h1 class="text-uppercase text-h3 font-weight-bold hero-title-color">
            {{ t("hero.title") }}
          </h1>
        </div>
        <div>
          <p class="hero-subtitle-size hero-subtitle-color">
            <v-icon class="hero-title-color pe-2" icon="mdi-phone"></v-icon
            >{{ t("button.tel") }}
          </p>
          <p class="hero-subtitle-size hero-subtitle-color">
            <v-icon class="hero-title-color pe-2" icon="mdi-email-outline"></v-icon
            >{{ t("button.email") }}
          </p>
        </div>
      </v-col>

      <v-col cols="2" align-self="end">
        <RouterLink to="/booking" class="clear"><v-btn
          block
          size="x-large"
          rounded="lg"
          class="hero-button elevation-5"
          >{{ t("button.book") }}</v-btn
        ></RouterLink>
      </v-col>

      <v-col cols="5" align-self="end">
        <v-img
          aspect-ratio="4/3"
          :src="portraitImage"
          alt="Hero image."
          class="hero-image"
          ><template v-slot:placeholder>
            <div class="d-flex align-center justify-center fill-height">
              <v-progress-circular
                color="grey-lighten-4"
                indeterminate
              ></v-progress-circular>
            </div> </template
        ></v-img>
      </v-col>
    </v-row>
    <v-row class="d-flex justify-center pa-0 ma-0"> </v-row>
    <v-row> </v-row>
  </section>
</template>

<style scoped>
.hero-bg-color {
  background-color: #201b18;
  padding-left: 10%;
  padding-right: 10%;
}
.hero-title-color {
  color: #6a4e35;
  text-shadow: 6px 6px 12px rgba(0, 0, 0, 0.8);
}
.hero-subtitle-size {
  font-size: x-large;
  text-transform: uppercase;
}
.hero-subtitle-color {
  color: #d3d2cd;
  text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.8);
}
.hero-image {
  opacity: 70%;
}
.hero-button {
  background-color: #8f6a48;
  color: #d3d2cd;
  padding: 25px 0px 25px 0px;
  font-size: xx-large;
  text-transform: uppercase;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  cursor: pointer;
}
.clear{
    text-decoration: none;
    color: inherit;
}
</style>