<script setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const rules = [
  (value) => !!value || "Required.",
  (value) => (value && value.length >= 3) || "Min 3 characters",
];

const fields = [
  { label: t("inputFields.name") },
  { label: t("inputFields.email") },
  { label: t("inputFields.repeatEmail") },
  { label: t("inputFields.phoneNumber") },
  { label: t("inputFields.password") },
  { label: t("inputFields.repeatPassword") },
];
</script>

<template>
  <div class="mx-auto w-25">
    <h1 class="text-center text-h3 font-weight-light text-uppercase mt-5">
      {{ t("button.register") }}
    </h1>

    <form @submit.prevent="register">
      <v-text-field
        v-for="field in fields"
        :key="field.label"
        :rules="rules"
        hide-details="auto"
        :label="field.label"
        class="my-5"
      ></v-text-field>

      <v-btn density="default" block @click="register">{{
        t("inputFields.submit")
      }}</v-btn>
    </form>
  </div>
</template>

<style>
</style>