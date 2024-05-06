import { reactive } from "vue";
import { useI18n } from "vue-i18n";

export function useRegisterForm() {
    const { t } = useI18n();

    const form = reactive({
        firstName: '',
        lastName: '',
        email: '',
        repeatEmail: '',
        phoneNumber: '',
        password: '',
        repeatPassword: ''
    });

    const firstNameRules = [
        (value) => !!value || t("validation.firstNameReq"),
        (value) => /^[A-Z][a-z]*/.test(value) || t("validation.nameMustStartUppercase"),
        (value) => (value && value.length >= 3) || t("validation.minCharacters"),
    ];

    const lastNameRules = [
        (value) => !!value || t("validation.lastNameReq"),
        (value) => /^[A-Z][a-z]*/.test(value) || t("validation.nameMustStartUppercase"),
        (value) => (value && value.length >= 3) || t("validation.minCharacters"),
    ];

    const emailRules = [
        (value) => !!value || t("validation.emailRequired"),
        (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || t("validation.invalidEmailFormat"),
    ];

    const repeatEmailRules = [
        (value) => !!value || t("validation.repeatEmailRequired"),
        (value) => value === form.email || t("validation.emailsMustMatch")
    ];

    const phoneRules = [
        (value) => !!value || t("validation.phoneRequired"),
        (value) => (value.length >= 9 && /^\d+$/.test(value)) || t("validation.phoneMinDigits"),
    ];

    const passwordRules = [
        (value) => !!value || t("validation.passwordRequired"),
        (value) => (value.length >= 8) || t("validation.passwordMinLength"),
        (value) => /\d/.test(value) || t("validation.passwordMustIncludeNumber"),
        (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value) || t("validation.passwordSpecialChar"),
        (value) => /[A-Z]/.test(value) || t("validation.passwordUppercaseLetter"),
        (value) => /[a-z]/.test(value) || t("validation.passwordLowercaseLetter"),
    ];

    const repeatPasswordRules = [
        (value) => !!value || t("validation.repeatPasswordRequired"),
        (value) => value === form.password || t("validation.passwordMustMatch")
    ];

    const fields = [
        { label: t("inputFields.firstName"), placeholder: "John", model: 'firstName', rules: firstNameRules },
        { label: t("inputFields.lastName"), placeholder: "Doe", model: 'lastName', rules: lastNameRules },
        { label: t("inputFields.email"), placeholder: "johndoe@mail.com", model: 'email', rules: emailRules },
        { label: t("inputFields.repeatEmail"), model: 'repeatEmail', rules: repeatEmailRules },
        { label: t("inputFields.phoneNumber"), placeholder: "06301231234", model: 'phoneNumber', rules: phoneRules },
        { label: t("inputFields.password"), model: 'password', rules: passwordRules },
        { label: t("inputFields.repeatPassword"), model: 'repeatPassword', rules: repeatPasswordRules },
    ];

    return { form, fields, t };
}