<template>
  <div class="mx-auto w-25">
    <h1 class="text-center text-h4 font-weight-light text-uppercase mt-5 text-color">
      {{ t("button.register") }}
    </h1>

    <form @submit.prevent="submitForm">
      <v-text-field
        density="compact"
        clearable
        v-for="field in fields"
        :key="field.label"
        :rules="field.rules"
        :placeholder="field.placeholder"
        :type="field.type"
        v-model="form[field.model]"
        hide-details="auto"
        :label="field.label"
        class="my-5"
      ></v-text-field>

      <!-- Add reCAPTCHA container with explicit id -->
      <div id="recaptcha-container" class="rounded mb-5 d-flex justify-center"></div>

      <v-btn density="default" block @click="submitForm" class="login-btn-color">
        {{ t("inputFields.submit") }}
      </v-btn>

      <p class="mt-10">
        {{ t("text.alreadyHaveAccount1") }}
        <RouterLink to="/login" class="clear">{{
          t("button.alreadyHaveAccountBtn")
        }}</RouterLink>
        {{ t("text.alreadyHaveAccount2") }}
      </p>
    </form>
  </div>
</template>

<script setup>
import { useRegisterForm } from "@/composables/register.js";

// Destructure the returned values from useRegisterForm
const { form, fields, t, submitForm } = useRegisterForm();
</script>
