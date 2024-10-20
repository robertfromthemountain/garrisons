<script setup>
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import portraitImage from "../assets/images/portrait_2_transparent.png";
import { useDisplay } from "vuetify";

const { xs, sm, md, lg, xl, xxl, smAndDown, mdAndUp } = useDisplay();
const { t } = useI18n();
</script>

<template>
  <section>
    <v-row
      no-gutters
      class="d-flex hero-bg-color pt-10 elevation-8 justify-center"
    >
      <!-- Title and Contact Info -->
      <v-col cols="12" md="5" align-self="center" class="mb-4">
        <div>
          <p class="text-garrisons float-in-animation">
            {{ t("hero.subtitle") }}<span
              class="mdi mdi-emoticon-wink"
            ></span>
          </p>
          <h1
            class="text-uppercase hero-title text-center text-md-start font-weight-bold hero-title-color float-left-animation-1"
          >
            Garrison's Haircraft
            <br />
            & Barbershop
          </h1>
        </div>
        <div>
          <p
            class="hero-subtitle-size hero-subtitle-color text-center text-md-start float-left-animation-2"
          >
            <v-icon class="text-garrisons-3 pe-2" icon="mdi-phone"></v-icon
            >{{ t("global.tel") }}
          </p>
          <p
            class="hero-subtitle-size hero-subtitle-color text-center text-md-start float-left-animation-3"
          >
            <v-icon
              class="text-garrisons-3 pe-2"
              icon="mdi-email-outline"
            ></v-icon
            >{{ t("global.email") }}
          </p>
        </div>
      </v-col>

      <!-- Button -->
      <v-col cols="6" md="2" align-self="end" class="">
        <RouterLink
          :to="isLoggedIn ? '/booking' : '/guestBooking'"
          class="clear"
        >
          <v-btn
            block
            size="large"
            rounded="lg"
            class="hero-button elevation-5 py-md-7"
          >
            {{ t("hero.button") }}
          </v-btn>
        </RouterLink>
      </v-col>

      <!-- Hero Image -->
      <v-col
        v-show="mdAndUp && !smAndDown"
        cols="12"
        md="5"
        align-self="end"
        class="text-center"
      >
        <v-img
          aspect-ratio="4/3"
          :src="portraitImage"
          alt="Hero image."
          class="hero-image"
          contain
        >
          <template v-slot:placeholder>
            <div class="d-flex align-center justify-center fill-height">
              <v-progress-circular
                color="grey-lighten-4"
                indeterminate
              ></v-progress-circular>
            </div>
          </template>
        </v-img>
      </v-col>
    </v-row>
  </section>
</template>

<style scoped>
.hero-bg-color {
  background-color: #201b18;
  padding-left: 10%;
  padding-right: 10%;
  /* min-height: 30vh; */
  /* Reduce padding on smaller screens */
  @media (max-width: 600px) {
    padding-left: 5%;
    padding-right: 5%;
  }
}

.hero-title-color {
  color: #6a4e35;
  text-shadow: 6px 6px 12px rgba(0, 0, 0, 0.8);
  font-size: 7vh;
  font-weight: bolder;
  /* Adjust font size for mobile */
  @media (max-width: 1386px) {
    font-size: 5vh;
  }
}

.hero-subtitle-size {
  font-size: x-large;
  text-transform: uppercase;
  /* Adjust subtitle size for mobile */
  @media (max-width: 600px) {
    font-size: 1rem;
  }
}

.hero-subtitle-color {
  color: #d3d2cd;
  text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.8);
}

.hero-image {
  opacity: 70%;
  max-width: 100%; /* Ensure the image fits within mobile screen */
  height: auto;
}

.clear {
  text-decoration: none;
  color: inherit;
}

/* Button Styling */
.hero-button {
  background-color: #8f6a48;
  color: #d3d2cd;
  font-size: xx-large;
  text-transform: uppercase;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  cursor: pointer;
}

.float-in-animation {
  opacity: 0;
  transform: translateX(-100%);
  animation: float-in 1s forwards;
}
@keyframes float-in {
  to {
    opacity: 0.5;
    transform: translateX(0);
  }
}

/* Animation for floating from the left */
.float-left-animation-1 {
  opacity: 0;
  transform: translateX(-100%);
  animation: float-left 1s forwards;
}

.float-left-animation-2 {
  opacity: 0;
  transform: translateX(-100%);
  animation: float-left 1s forwards;
  animation-delay: 0.1s;
}

.float-left-animation-3 {
  opacity: 0;
  transform: translateX(-100%);
  animation: float-left 1s forwards;
  animation-delay: 0.2s;
}
@keyframes float-left {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
