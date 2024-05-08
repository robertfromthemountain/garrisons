<script setup>
import { useLogin } from "@/composables/login.js";

const { email, password, isLoading, loginUser, t } = useLogin();
</script>

<template>
  <div class="mx-auto w-25">
    <h1 class="text-center text-h4 font-weight-light text-uppercase mt-5">
      {{ t("button.login") }}
    </h1>
    <form @submit.prevent="loginUser">
      <v-text-field
        :label="t('inputFields.email')"
        v-model="email"
        type="email"
        hide-details="auto"
        class="my-5"
      ></v-text-field>

      <v-text-field
        :label="t('inputFields.password')"
        v-model="password"
        type="password"
        :loading="isLoading"
        hide-details="auto"
        class="my-5"
      ></v-text-field>

      <v-btn :disabled="isLoading" density="default" block type="submit">
        {{ t("inputFields.submit") }}
      </v-btn>
    </form>
  </div>
</template>

<style scoped>
</style>
