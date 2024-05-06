<script setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const fields = [
  { label: t("inputFields.email") },
  { label: t("inputFields.password") },
];
</script>

<template>
  <div class="mx-auto w-25">
    <h1 class="text-center text-h4 font-weight-light text-uppercase mt-5">
      {{ t("button.login") }}
    </h1>
    <form @submit.prevent="login">
      <v-text-field
        v-for="field in fields"
        :key="field.label"
        hide-details="auto"
        :label="field.label"
        class="my-5"
      ></v-text-field>

      <v-btn density="default" block @click="login">{{
        t("inputFields.submit")
      }}</v-btn>
    </form>
  </div>
</template>

<style>
</style>