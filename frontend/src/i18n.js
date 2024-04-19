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