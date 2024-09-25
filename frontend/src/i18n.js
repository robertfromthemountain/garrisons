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
            dashboard: "Dashboard",
            logout: "Logout",
            needToRegBtn: "Sign Up",
            alreadyHaveAccountBtn: "Sign In",
            book: "Booking",
            tel: "+36 (30) 999 3211",
            email: "info@garrisons.hu",
            calendarEdit: "Edit calendar"

        },
        inputFields: {
            firstName: "First Name",
            lastName: "Last Name",
            email: "Email",
            repeatEmail: "Repeat Email",
            phoneNumber: "Phone Number",
            password: "Password",
            repeatPassword: "Repeat Password",
            submit: "Submit"
        },
        validation: {
            firstNameReq: "First name is required!",
            lastNameReq: "Last name is required!",
            nameMustStartUppercase: "Name must start with an uppercase letter.",
            minCharacters: "Min 3 characters",
            emailRequired: "Email is required.",
            invalidEmailFormat: "Invalid email format.",
            repeatEmailRequired: "Repeat email is required.",
            emailsMustMatch: "Emails must match.",
            phoneRequired: "Phone number is required.",
            phoneMinDigits: "Phone number is at least 9 digits!",
            passwordRequired: "Password is required.",
            passwordMinLength: "Password must be at least 8 characters.",
            passwordMustIncludeNumber: "Password must include at least one number.",
            passwordSpecialChar: "Password must include at least one special character.",
            passwordUppercaseLetter: "Password must include at least one uppercase letter.",
            passwordLowercaseLetter: "Password must include at least one lowercase letter.",
            repeatPasswordRequired: "Repeat password is required.",
            passwordMustMatch: "Passwords must match."
        },
        text: {
            needToRegister1: "Dont have an account?",
            needToRegister2: "here.",
            alreadyHaveAccount1: "Already have an account?",
            alreadyHaveAccount2: "here."
        },
        hero: {
            title: "Garrison's haircraft and barbershop"
        },
        dialog: {
            date: "Date:",
            time: "Time",
            service: "Service:",
            duration: "Duration:",
            duration2: "minutes",
            price: "Price:",
            price2: "HUF",
            userName: "Booking name:",
            userEmail: "Email:",
            userPhone: "Phone number:",
            bookDialog: {
                title1: "Book an Appointment",
                title2: "Confirm Your Appointment",
                selectTitle: "Choose a Service",
                noServices: "No services available at the moment."
            },
            button: {
                save: "Save",
                cancel: "Cancel",
                next: "Next",
                requestBook: "Request Appointment"
            }
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
            dashboard: "Dashboard",
            needToRegBtn: "Regisztrálj",
            alreadyHaveAccountBtn: "Lépj be",
            book: "Foglalás",
            tel: "+36 (30) 999 3211",
            email: "info@garrisons.hu"
        },
        inputFields: {
            firstName: "Keresztnév",
            lastName: "Vezetéknév",
            email: "Email",
            repeatEmail: "Email Újra",
            phoneNumber: "Telefonszám",
            password: "Jelszó",
            repeatPassword: "Jelszó Újra",
            submit: "Küldés"
        },
        validation: {
            firstNameReq: "Keresztnév megadása kötelező!",
            lastNameReq: "Vezetéknév megadása kötelező!",
            nameMustStartUppercase: "A névnek nagy kezdőbetűvel kell kezdődnie.",
            minCharacters: "Minimum 3 karakter.",
            emailRequired: "Az email cím megadása kötelező.",
            invalidEmailFormat: "Érvénytelen email formátum.",
            repeatEmailRequired: "Az email cím ismételt megadása kötelező.",
            emailsMustMatch: "Az email címeknek egyezniük kell.",
            phoneRequired: "A telefonszám megadása kötelező.",
            phoneMinDigits: "A telefonszámnak legalább 9 számjegyből kell állnia!",
            passwordRequired: "A jelszó megadása kötelező.",
            passwordMinLength: "A jelszónak legalább 8 karakterből kell állnia.",
            passwordMustIncludeNumber: "A jelszónak tartalmaznia kell legalább egy számot.",
            passwordSpecialChar: "A jelszónak tartalmaznia kell legalább egy speciális karaktert.",
            passwordUppercaseLetter: "A jelszónak tartalmaznia kell legalább egy nagybetűt.",
            passwordLowercaseLetter: "A jelszónak tartalmaznia kell legalább egy kisbetűt.",
            repeatPasswordRequired: "A jelszó megismétlése kötelező.",
            passwordMustMatch: "A jelszavaknak egyezniük kell."

        },
        text: {
            needToRegister1: "Még nincs fiókod?",
            needToRegister2: "itt.",
            alreadyHaveAccount1: "Már regisztráltál?",
            alreadyHaveAccount2: "itt."
        },
        hero: {
            title: "Garrison's haircraft and barbershop"
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