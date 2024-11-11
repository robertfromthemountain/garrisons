<script setup>
import { useRegisterForm } from "@/composables/register.js";

const {
  form,
  fields,
  t,
  register,
  passwordVisible,
  repeatPasswordVisible,
  isLoading,
} = useRegisterForm();

// Add a prop to control the visibility of the register link
const props = defineProps({
  showLink: {
    type: Boolean,
    default: true, // Show register link by default
  },
});
</script>

<template>
  <div class="mx-auto responsive-input">
    <h1
      class="text-center text-h4 font-weight-light text-uppercase mt-5 text-color"
    >
      <span class="mdi mdi-account-plus-outline"></span>
      {{ t("button.register") }}
    </h1>

    <form @submit.prevent="register">
      <v-text-field
        density="compact"
        v-for="field in fields"
        :key="field.label"
        :rules="field.rules"
        :placeholder="field.placeholder"
        :prepend-inner-icon="field.innerIcon"
        :loading="isLoading"
        :disabled="isLoading"
        clearable
        :type="
          field.model === 'password'
            ? passwordVisible
              ? 'text'
              : 'password'
            : field.model === 'repeatPassword'
            ? repeatPasswordVisible
              ? 'text'
              : 'password'
            : field.type
        "
        v-model="form[field.model]"
        hide-details="auto"
        :label="field.label"
        class="my-5"
        :append-inner-icon="
          field.model === 'password'
            ? passwordVisible
              ? 'mdi-eye-off'
              : 'mdi-eye'
            : field.model === 'repeatPassword'
            ? repeatPasswordVisible
              ? 'mdi-eye-off'
              : 'mdi-eye'
            : ''
        "
        @click:append-inner="
          field.model === 'password'
            ? (passwordVisible = !passwordVisible)
            : field.model === 'repeatPassword'
            ? (repeatPasswordVisible = !repeatPasswordVisible)
            : null
        "
      ></v-text-field>

      <v-btn
        density="default"
        block
        @click="register"
        class="login-btn-color"
        :disabled="isLoading"
        >{{ t("inputFields.submit") }}</v-btn
      >

      <p v-if="showLink" class="mt-10 text-center">
        {{ t("text.alreadyHaveAccount1") }}
        <RouterLink to="/login" class="clear">{{
          t("button.alreadyHaveAccountBtn")
        }}</RouterLink>
        {{ t("text.alreadyHaveAccount2") }}
      </p>
    </form>
  </div>
</template>

<style>
</style>