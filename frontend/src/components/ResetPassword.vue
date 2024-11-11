<template>
  <div class="mx-auto responsive-input">
    <h1
      class="text-center text-h4 font-weight-light text-uppercase mt-5 text-color"
    >
      <span class="mdi mdi-lock-reset"></span>
      {{ t("login.forgotPassword.title2") }}
    </h1>
    <form @submit.prevent="submitNewPassword">
      <v-text-field
        v-model="newPassword"
        density="compact"
        :type="passwordVisible ? 'text' : 'password'"
        :append-inner-icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append-inner="passwordVisible = !passwordVisible"
        :label="t('inputFields.newPassword')"
        :rules="passwordRules"
        clearable
        :disabled="isLoading"
        :loading="isLoading"
        hide-details="auto"
        prepend-inner-icon="mdi-lock-outline"
        class="my-5"
      ></v-text-field>

      <v-text-field
        v-model="confirmPassword"
        density="compact"
        :loading="isLoading"
        :disabled="isLoading"
        hide-details="auto"
        :type="visible ? 'text' : 'password'"
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append-inner="visible = !visible"
        :label="t('inputFields.newPasswordRepeat')"
        :rules="repeatPasswordRules"
        clearable
        prepend-inner-icon="mdi-lock-outline"
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
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import apiClient from "@/utils/apiClient";
import { useToast } from "vue-toastification";

const { t } = useI18n();
const toast = useToast();
const router = useRouter();
const route = useRoute();

const newPassword = ref("");
const confirmPassword = ref("");
const passwordVisible = ref(false);
const visible = ref(false);
const isLoading = ref(false);

const passwordRules = [
  (value) => !!value || t("validation.passwordRequired"),
  (value) => value.length >= 8 || t("validation.passwordMinLength"),
  (value) => /\d/.test(value) || t("validation.passwordMustIncludeNumber"),
  (value) =>
    /[!@#$%^&*(),.?":{}|<>]/.test(value) || t("validation.passwordSpecialChar"),
  (value) => /[A-Z]/.test(value) || t("validation.passwordUppercaseLetter"),
  (value) => /[a-z]/.test(value) || t("validation.passwordLowercaseLetter"),
];

const repeatPasswordRules = [
  (value) => !!value || t("validation.repeatPasswordRequired"),
  (value) => value === newPassword.value || t("validation.passwordMustMatch"),
];

// Submit new password
const submitNewPassword = async () => {
  if (!newPassword.value || !confirmPassword.value) {
    toast.error(t("validation.fillAllFields"));
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    toast.error(t("validation.passwordMustMatch"));
    return;
  }

  isLoading.value = true;

  // Get the token from the URL
  const token = route.query.token;

  try {
    // Send new password and token to the backend
    await apiClient.post("http://localhost:5000/reset-password", {
      token,
      newPassword: newPassword.value,
    });

    toast.success(t("login.forgotPassword.resetPassword.success"));
    router.push("/login");
  } catch (error) {
    toast.error(t("login.forgotPassword.resetPassword.error"));
  } finally {
    isLoading.value = false;
  }
};
</script>
  
  <style>
.reset-password-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
}
.submit-btn {
  background-color: #8f6a48;
  color: #fff;
}
</style>
  