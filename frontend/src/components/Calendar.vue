<template>
  <div class="bg-dark-garrisons pa-8 elevation-5 rounded">
    <!-- FullCalendar component -->
    <FullCalendar :options="calendarOptions" />

    <v-dialog v-model="showFirstDialog" max-width="500">
      <v-card class="bg-garrisons text-garrisons">
        <v-card-title>
          <h2 class="headline title-garrisons">
            {{ t("dialog.bookDialog.title1") }}
          </h2>
        </v-card-title>
        <v-divider class="mx-3"></v-divider>
        <v-card-text>
          <v-select
            class=""
            v-model="selectedService"
            :items="services"
            :item-value="(service) => service"
            item-text="title"
            :label="t('dialog.bookDialog.selectTitle')"
            density="compact"
            clearable
            v-if="services.length > 0"
          ></v-select>
          <p v-else>{{ t("dialog.bookDialog.noServices") }}</p>
          <p>
            <strong>{{ t("dialog.date") }}</strong>
            {{ selectedSlot.usableDate }}
          </p>
          <p class="pb-2">
            <strong>{{ t("dialog.time") }}</strong>
            {{ selectedSlot.usableTime }}
          </p>
          <div v-if="selectedService">
            <p v-if="$store.getters.isLoggedIn">
              <strong>Logged in user ID (ONLY FOR DEBUG):</strong> {{ userId }}
            </p>
            <p v-if="$store.getters.isLoggedIn">
              <strong>{{ t("dialog.userName") }}</strong>
              {{ firstName + " " + lastName }}
            </p>
            <p v-if="$store.getters.isLoggedIn" class="pb-2">
              <strong>{{ t("dialog.userEmail") }}</strong> {{ email }}
            </p>
            <p>
              <strong>{{ t("dialog.service") }}</strong>
              {{ selectedService.title }}
            </p>
            <p>
              <strong>{{ t("dialog.service") }}</strong>
              {{ selectedService.id }}
            </p>
            <p>
              <strong>{{ t("dialog.duration") }}</strong>
              {{ selectedService.duration }} {{ t("dialog.duration2") }}
            </p>
            <p>
              <strong>{{ t("dialog.price") }}</strong>
              {{ selectedService.price }} {{ t("dialog.price2") }}
            </p>
          </div>
        </v-card-text>
        <v-divider class="mx-3"></v-divider>
        <v-card-actions class="ma-2">
          <v-btn class="text-garrisons" variant="tonal" @click="closeDialog">{{
            t("dialog.button.cancel")
          }}</v-btn>
          <v-spacer></v-spacer>
          <v-btn class="text-garrisons bg-green" @click="checkOverlap">{{
            t("dialog.button.next")
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showConfirmationDialog" max-width="500">
      <v-card class="bg-garrisons text-garrisons">
        <v-card-title>
          <h2 class="headline title-garrisons">
            {{ t("dialog.bookDialog.title1") }}
          </h2>
        </v-card-title>
        <v-divider class="mx-3"></v-divider>
        <v-card-text>
          <p>
            <strong>{{ t("dialog.userName") }}</strong>
            {{ firstName + " " + lastName }}
          </p>
          <p>
            <strong>{{ t("dialog.userEmail") }}</strong> {{ email }}
          </p>
          <p>
            <strong>{{ t("dialog.userPhone") }}</strong> {{ phone }}
          </p>
          <p>
            <strong>{{ t("dialog.service") }}</strong>
            {{ selectedService.title }}
          </p>
          <p>
            <strong>{{ t("dialog.service") }}</strong>
            {{ selectedService.id }}
          </p>
          <p>
            <strong>{{ t("dialog.date") }}</strong>
            {{ selectedSlot.usableDate }}
          </p>
          <p>
            <strong>{{ t("dialog.time") }}</strong>
            {{ selectedSlot.usableTime }}
          </p>
          <p>
            <strong>{{ t("dialog.price") }}</strong>
            {{ selectedService.price }} {{ t("dialog.price2") }}
          </p>
        </v-card-text>
        <v-divider class="mx-3"></v-divider>
        <v-card-actions class="ma-2">
          <v-btn
            class="text-garrisons"
            variant="tonal"
            @click="confirmationDialogCancel"
            >{{ t("dialog.button.cancel") }}</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn class="text-garrisons bg-green" @click="finalizeBooking">{{
            t("dialog.button.requestBook")
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>


<script>
import FullCalendar from "@fullcalendar/vue3";
import useUserCalendar from "@/composables/useUserCalendar.js";

export default {
  components: {
    FullCalendar,
  },
  mixins: [useUserCalendar],
  setup(props, context) {
    // Since we're using the setup function, let's get t directly from the mixin
    const { t } = useUserCalendar.setup();

    return {
      t,
    };
  },
};
</script>

<style scoped>
.bg-dark-garrisons {
  background-color: #201b18;
}

.v-dialog {
  z-index: 1000;
}
</style>
