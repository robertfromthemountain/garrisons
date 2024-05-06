<script setup>
import { reactive } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const form = reactive({
  name: "",
  email: "",
  repeatEmail: "",
  phoneNumber: "",
  password: "",
  repeatPassword: "",
});
const nameRules = [
  (value) => !!value || "Name is required.",
  (value) =>
    (value && /^[A-Z][a-z]*/.test(value)) ||
    "Name must start with an uppercase letter.",
  (value) => (value && value.length >= 2) || "Min 2 characters",
];

const emailRules = [
  (value) => !!value || "Email is required.",
  (value) =>
    (value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) ||
    "Invalid email format.",
];

const repeatEmailRules = [
  (value) => !!value || "Repeat email is required.",
  (value) => value === form.email || "Emails must match.",
];

const phoneRules = [
  (value) => !!value || "Required.",
  (value) =>
    (value && value.length >= 9 && /\d/.test(value)) ||
    "Phone number is at least 9 digits!",
];

const passwordRules = [
  (value) => !!value || "Password is required.",
  (value) =>
    (value && value.length >= 8) || "Password must be at least 8 characters.",
  (value) =>
    (value && /\d/.test(value)) || "Password must include at least one number.",
  (value) =>
    (value && /[!@#$%^&*(),.?":{}|<>]/.test(value)) ||
    "Password must include at least one special character.",
  (value) =>
    (value && /[A-Z]/.test(value)) ||
    "Password must include at least one uppercase letter.",
  (value) =>
    (value && /[a-z]/.test(value)) ||
    "Password must include at least one lowercase letter.",
];

const repeatPasswordRules = [
  (value) => !!value || "Repeat password is required.",
  (value) => value === form.password || "Passwords must match.",
];

const fields = [
  {
    label: t("inputFields.name"),
    placeholder: "John Doe",
    model: "name",
    rules: nameRules,
  },
  {
    label: t("inputFields.email"),
    placeholder: "johndoe@mail.com",
    model: "email",
    rules: emailRules,
  },
  {
    label: t("inputFields.repeatEmail"),
    model: "repeatEmail",
    rules: repeatEmailRules,
  },
  {
    label: t("inputFields.phoneNumber"),
    placeholder: "06301231234",
    model: "phoneNumber",
    rules: phoneRules,
  },
  { label: t("inputFields.password"), model: "password", rules: passwordRules },
  {
    label: t("inputFields.repeatPassword"),
    model: "repeatPassword",
    rules: repeatPasswordRules,
  },
];
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