<script setup>
import { useRegisterForm } from "@/composables/register.js";

const { form, fields, t } = useRegisterForm();
</script>

<template>
  <div class="mx-auto w-25">
    <h1 class="text-center text-h4 font-weight-light text-uppercase mt-5">
      {{ t("button.register") }}
    </h1>

    <form @submit.prevent="register">
      <v-text-field
        v-for="field in fields"
        :key="field.label"
        :rules="field.rules"
        :placeholder="field.placeholder"
        v-model="form[field.model]"
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