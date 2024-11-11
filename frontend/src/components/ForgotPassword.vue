<template>
  <div class="mx-auto responsive-input">
    <h1
      class="text-center text-h4 font-weight-light text-uppercase mt-5 text-color"
    >
      <span class="mdi mdi-email-outline"></span> {{ t("login.forgotPassword.title1") }}
    </h1>
    <form @submit.prevent="submitForgotPassword">
      <v-text-field
        v-model="forgotPasswordEmail"
        :rules="emailRules"
        :loading="isLoading"
        :disabled="isLoading"
        density="compact"
        :label="t('inputFields.email')"
        type="email"
        clearable
        prepend-inner-icon="mdi-email-outline"
        hide-details="auto"
        class="my-5"
      ></v-text-field>

      <v-btn
        :loading="isLoading"
        :disabled="isLoading"
        block
        type="submit"
        class="submit-btn"
      >
        {{ t("login.forgotPassword.submitButton") }}
      </v-btn>
    </form>
  </div>
</template>
  
  <script setup>
import { useLogin } from "@/composables/login";
const { forgotPasswordEmail, emailRules, isLoading, forgotPassword, t } =
  useLogin();

const submitForgotPassword = async () => {
  await forgotPassword();
};
</script>
  
  <style>
.forgot-password-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
}

.submit-btn {
  background-color: #8f6a48;
  color: #d3d2cd;
}
</style>
  