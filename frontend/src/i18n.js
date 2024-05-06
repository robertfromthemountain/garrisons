import { createI18n } from "vue-i18n";

const messages = {
    en: {
        link: {
            home: "Home",
            booking: "Booking",
            rules: "Rules",
            references: "References"
        },
        button: {
            login: "Sign In",
            register: "Sign Up",
            dashboard: "Dashboard"
        },
        inputFields: {
            name: "Name",
            email: "Email",
            repeatEmail: "Repeat Email",
            phoneNumber: "Phone Number",
            password: "Password",
            repeatPassword: "Repeat Password",
            submit: "Submit"
        },
        messages: {
            nameRequired: "Name is required!",
            emailRequired: "Email is required!",
            passwordRequired: "Password is required!",
            phoneRequired: "Phone number is required!",
            minLength: "Must be at least 8 characters!",
            invalidEmail: "Email is invalid!",
            emailMismatch: "Emails are not matching!",
            passwordStrength: "The password must contain at least one number, one special character, one lowercase, and one uppercase character!",
            passwordMismatch: "Passwords doesn't match!",
            invalidPhoneNumber: "Phone number is invalid!"
        }
    },
    hu: {
        link: {
            home: "Főoldal",
            booking: "Foglalás",
            rules: "Szabályzat",
            references: "Munkáim"
        },
        button: {
            login: "Bejelentkezés",
            register: "Regisztráció",
            dashboard: "Dashboard"
        },
        inputFields: {
            name: "Név",
            email: "Email",
            repeatEmail: "Email Újra",
            phoneNumber: "Telefonszám",
            password: "Jelszó",
            repeatPassword: "Jelszó Újra",
            submit: "Küldés"
        },
        messages: {
            required: "Kötelező",
            minLength: "A jelszó legalább 8 karakterből kell álljon!",
            invalidEmail: "Érvénytelen email cím!",
            emailMismatch: "Az email cymek nem egyeznek!",
            passwordStrength: "A jelszónak tartalmaznia kell legalább egy számot, egy speciális karaktert, egy kisbetűt és egy nagybetűt!",
            passwordMismatch: "A jelszavak nem egyeznek!",
            invalidPhoneNumber: "Érvénytelen telefonszám!"
        }
    }
};

const i18n = createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages,
});

export default i18n;