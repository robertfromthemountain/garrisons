<script setup>
import { useLogin } from "@/composables/login";

const {
  email,
  password,
  emailRules,
  passwordRules,
  isLoading,
  loginUser,
  t,
  visible,
  showForgotPassword,
} = useLogin();

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
      <span class="mdi mdi-login"></span> {{ t("button.login") }}
    </h1>
    <form @submit.prevent="loginUser">
      <v-text-field
        clearable
        density="compact"
        :label="t('inputFields.email')"
        :rules="emailRules"
        :disabled="isLoading"
        :loading="isLoading"
        v-model="email"
        type="email"
        hide-details="auto"
        class="my-5 input-field-font"
        prepend-inner-icon="mdi-email-outline"
      ></v-text-field>

      <v-text-field
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="visible ? 'text' : 'password'"
        density="compact"
        :label="t('inputFields.password')"
        :rules="passwordRules"
        v-model="password"
        :disabled="isLoading"
        :loading="isLoading"
        hide-details="auto"
        :class="showForgotPassword ? 'mt-5 input-field-font' : 'mt-5 mb-6 input-field-font'"
        clearable
        @click:append-inner="visible = !visible"
        prepend-inner-icon="mdi-lock-outline"
      ></v-text-field>

      <!-- Forgot Password Link -->
      <div v-if="showForgotPassword" class="text-end">
        <RouterLink to="/forgot-password" class="clear">
          {{ t("login.forgotPassword.link") }}
        </RouterLink>
      </div>

      <v-btn
        :disabled="isLoading"
        density="default"
        block
        type="submit"
        class="login-btn-color"
      >
        {{ t("inputFields.submit") }}
      </v-btn>

      <p v-if="showLink" class="mt-10 text-center">
        {{ t("text.needToRegister1") }}
        <RouterLink to="/register" class="clear">{{
          t("button.needToRegBtn")
        }}</RouterLink>
        {{ t("text.needToRegister2") }}
      </p>
    </form>
  </div>
</template>

<style>
.text-color {
  color: #d3d2cd;
}
.login-btn-color {
  color: #d3d2cd;
  background-color: #8f6a48;
}

v-text-field{
  font-family: 'Courier New', Courier, monospace;
}

.forgot-password-link {
  color: #8f6a48;
  font-weight: bold;
  text-decoration: underline;
}
</style>
