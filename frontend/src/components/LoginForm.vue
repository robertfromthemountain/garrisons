<script setup>
import { useLogin } from "@/composables/login.js";

const { email, password, isLoading, loginUser, t } = useLogin();
</script>

<template>
  <div class="mx-auto w-25">
    <h1 class="text-center text-h4 font-weight-light text-uppercase mt-5 text-color">
      {{ t("button.login") }}
    </h1>
    <form @submit.prevent="loginUser">
      <v-text-field
      clearable
      density="compact"
        :label="t('inputFields.email')"
        v-model="email"
        type="email"
        hide-details="auto"
        class="my-5"
      ></v-text-field>

      <v-text-field
      clearable
      density="compact"
        :label="t('inputFields.password')"
        v-model="password"
        type="password"
        :loading="isLoading"
        hide-details="auto"
        class="my-5"
      ></v-text-field>

      <v-btn :disabled="isLoading" density="default" block type="submit" class="login-btn-color">
        {{ t("inputFields.submit") }}
      </v-btn>

      <p class="mt-10">
        {{
          t("text.needToRegister1")
        }}
        <RouterLink to="/register" class="clear">{{
          t("button.needToRegBtn")
        }}</RouterLink>
        {{
          t("text.needToRegister2")
        }}
      </p>
    </form>
  </div>
</template>

<style>
.text-color{
  color: #d3d2cd;
}
.login-btn-color{
  color: #d3d2cd;
background-color: #8f6a48;
}
</style>
