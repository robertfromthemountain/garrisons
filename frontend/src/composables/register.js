import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { reactive } from "vue";
import { useI18n } from "vue-i18n";
import apiClient from '@/utils/apiClient';
import { useToast } from 'vue-toastification';

export function useRegisterForm() {
    const { t } = useI18n();
    const toast = useToast();
    const passwordVisible = ref(false);
    const repeatPasswordVisible = ref(false);
    const isLoading = ref(false);

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
        { label: t("inputFields.firstName"), placeholder: "John", model: 'firstName', rules: firstNameRules, type: "text", innerIcon: "mdi-account-outline" },
        { label: t("inputFields.lastName"), placeholder: "Doe", model: 'lastName', rules: lastNameRules, type: "text", innerIcon: "mdi-account-outline" },
        { label: t("inputFields.email"), placeholder: "johndoe@mail.com", model: 'email', rules: emailRules, type: "email", innerIcon: "mdi-email-outline" },
        { label: t("inputFields.repeatEmail"), model: 'repeatEmail', rules: repeatEmailRules, type: "email", innerIcon: "mdi-email-sync-outline" },
        { label: t("inputFields.phoneNumber"), placeholder: "06301231234", model: 'phoneNumber', rules: phoneRules, type: "tel", innerIcon: "mdi-phone-outline" },
        { label: t("inputFields.password"), model: 'password', rules: passwordRules, type: "password", innerIcon: "mdi-lock-outline" },
        { label: t("inputFields.repeatPassword"), model: 'repeatPassword', rules: repeatPasswordRules, type: "password", innerIcon: "mdi-shield-sync-outline" },
    ];

    const router = useRouter();

    const register = async () => {
        let missingFields = [];

        // Check if any required fields are empty
        fields.forEach(field => {
            const value = form[field.model];
            if (!value) {
                missingFields.push(field.label);  // Collect the label of the empty field
            }
        });

        // If there are missing fields, show a toast and don't submit the form
        if (missingFields.length > 0) {
            toast.error(`Please fill in the following fields: ${missingFields.join(', ')}`);
            return;  // Stop the form submission
        }

        isLoading.value = true;

        try {
            // Proceed with registration if all required fields are filled
            const response = await apiClient.post('http://localhost:5000/api/auth/register', form);

            // Handle success response
            if (response.status === 201) {
                toast.success('Verification email sent! Please check your email.');
                router.push('/login');
            }
        } catch (error) {
            // Catching backend errors and displaying the message using toast
            if (error.response) {
                const { status, data } = error.response;
                switch (status) {
                    case 400:
                        // Specific handling for validation errors
                        if (data.errors) {
                            data.errors.forEach(err => {
                                toast.error(`${err.message}`);
                            });
                        } else {
                            toast.error(data.message || 'Bad Request. Please check your input.');
                        }
                        break;

                    case 404:
                        toast.error('Not Found. The requested resource could not be found.');
                        break;

                    case 500:
                        toast.error(data.message || 'Server error. Please try again later.');
                        break;

                    default:
                        toast.error('An unexpected error occurred. Please try again.');
                }
            } else if (error.request) {
                // The request was made, but no response was received
                toast.error('No response from server. Please try again later.');
            } else {
                // Something happened in setting up the request
                toast.error('Error occurred during registration. Please try again.');
            }
        } finally {
            isLoading.value = false;
        }
    };

    return { form, fields, t, register, passwordVisible, repeatPasswordVisible, isLoading };
}