import { createI18n } from "vue-i18n";
import ResetPassword from "./components/ResetPassword.vue";

const messages = {
    en: {
        global: {
            tel: "+36 (30) 456 4526",
            email: "{'info@garrisons.hu'}",
            owner: "Bíró Dominik, E.V.",
            shop: "Garrisons Haircraft & Barbershop",
            developer: "Nagy Róbert",
            location: "Orosháza, Kossuth utca 25"
        },
        footer: {
            important: {
                title: "Important",
            },
            openingHours: {
                title: "Opening Hours",
                days: {
                    monday: "Monday",
                    tuesday: "Tuesday",
                    wednesday: "Wednesday",
                    thursday: "Thursday",
                    firday: "Friday",
                    saturday: "Saturday",
                    sunday: "Sunday"
                },
                closed: "CLOSED",
            },
            socials: {
                title: "Social",
            },
            toasts: {
                error: "Error fetching opening hours."
            },
            rights: "All rights reserved."
        },
        hero: {
            title: "Garrison's haircraft and barbershop",
            subtitle: "Let your hair do the talking!",
            button: "Book Now!"
        },
        intro: {
            about: "About me",
            services: "My services",
            businessHours: "Opening Hours"
        },
        references: {
            title: "References"
        },
        guestBooking: {
            title: "Book an Appointment!",
            subtitle: "Click into the calendar to start the booking process!",
            modal: {
                createAccount: "Click here to create an account!",
                haveAccount: "I already have an account!",
            },
            services: {
                title: "Services",
                subtitle: "You can decide what service do you want to book.",
            }
        },
        dashboard: {
            title: "Dashboard",
            manageEvents: {
                title: "Manage Reservations",
                dialog: {
                    confirmChanges: "Modified Appointments",
                    modifiedEvents: "Please confirm or deny your modifications!",
                    originalEventDetails: "Original: ",
                    modifiedEventDetails: "Modified: ",
                    button: {
                        close: "Close",
                        discard: "Discard",
                        save: "Save"
                    }
                }
            },
            managePendingEvents: {
                title: "Manage Pending Reservations",
                subtitle: "Here you can accept or deny the pending appointment booking requests.",
                noEvents: "There are no pending events at the moment. Take a break, grab some coffee, and wait for the next booking to come in!",
                table: {
                    service: "Service",
                    booker: "Booker",
                    date: "Date",
                    start: "Start Time",
                    end: "End Time",
                    actions: "Actions",
                    buttons: {
                        accept: "Accept",
                        deny: "Deny"
                    },
                },
                deleteModal: {
                    title: "Delete Pending Reservation",
                    message: "Are you sure you want to deny this pending reservation?"
                },
                toast: {
                    error: {
                        token: "You are not logged in. Please log in again.",
                        confirm: "Failed to confirm appointment, please try again later!",
                        noEvent: "No appointment selected to deny.",
                        deny: "Failed to deny event, please try again later!"

                    },
                    success: {
                        confirm: "Appointment successfully confirmed!",
                        deny: "Appointment successfully denied!",
                    }
                }
            },
            manageServices: {
                title: "Manage Services",
                subtitle: "Here you can add, delete or modify services.",
                table: {
                    title: "Title",
                    price: "Price",
                    duration: "Duration",
                    color: "Color",
                    search: "Search Services",
                    searchPlaceholder: "Search by title, price, or duration",
                    buttons: {
                        edit: "Edit",
                        delete: "Delete",
                        add: "Add Service"
                    },
                },
                editModal: {
                    title: "Edit Service",
                    textFields: {
                        labels: {
                            title: "Title",
                            price: "Price",
                            duration: "Duration (in minutes)",

                        }
                    },
                    colorLabel: "Color of the service:"
                },
                addModal: {
                    title: "Add New Service",
                    textFields: {
                        labels: {
                            title: "Title",
                            price: "Price",
                            duration: "Duration (in minutes)",
                            color: "Select Background Color"
                        }
                    },
                    buttons: {
                        cancel: "Cancel",
                        add: "Add"
                    }
                },
                deleteModal: {
                    title: "Delete Service",
                    message: "Are you sure you want to delete this service? This action cannot be undone."
                },
                buttons: {
                    cancel: "Cancel",
                    save: "Save"
                }
            },
            manageUsers: {
                title: "Manage User Accounts",
                subtitle: "Here you can manage the registered users.",
                table: {
                    name: "Name",
                    role: "Role",
                    email: "Email",
                    phone: "Phone number",
                    status: "Status",
                    search: "Search Users",
                    searchPlaceholder: "Search by first name, last name, email, etc.",
                    buttons: {
                        edit: "Edit",
                        delete: "Delete",
                    },
                },
                modal: {
                    title: "Edit user data",
                    textFields: {
                        labels: {
                            firstName: "First Name",
                            lastName: "Last Name",
                            role: "Role",
                            email: "Email",
                            phoneNumber: "Phone Number",
                            status: "Status"
                        }
                    },
                    buttons: {
                        cancel: "Cancel",
                        save: "Save"
                    }
                },
                deleteModal: {
                    title: "Delete User",
                    message: "Are you sure you want to delete this user? This action can not be undone!"
                },
            },
            toast: {
                error: {
                    tokenError: "You are not logged in. Please log in again!",
                    userUpdate: "Failed to update user details, please try again!",
                    userDelete: "Failed to delete user from the database!",
                    serviceDelete: "Failed to delete service, please try again!",
                    serviceUpdate: "Failed to update service, please try again!",
                    serviceAdd: "Failed to create new servce, please try again!",
                },
                success: {
                    userUpdate: "User details updated successfully!",
                    userDelete: "User successfully deleted from database!",
                    serviceDelete: "Service deleted successfully!",
                    serviceUpdate: "Service updated successfully!",
                    serviceAdd: "New service added successfully!",
                }
            },
            manageBusinessHours: {
                title: "Business Hours",
                subtitle: "Here you can edit your opening hours on the website globally.",
                table: {
                    days: "Days of Week",
                    open: "Opening Time",
                    close: "Closing Time",
                    actions: "Actions",
                    buttons: {
                        edit: "Edit",
                    },
                },
                modal: {
                    title: "Edit Opening Hours",
                    weekday: "Day of Week",
                    buttons: {
                        cancel: "Cancel",
                        save: "Save"
                    }
                },
                toast: {
                    tokenError: "You are not logged in. Please log in again.",
                    updateSuccess: "Business hours updated successfully!",
                    updateError: "Failed to update business hours!"
                }
            },
        },
        logout: {
            toasts: {
                success: "You have successfully logged out. See-ya!"
            }
        },
        registration: {
            toasts: {
                success: "Registration successful!",
                error: "Registration failed!",
                verificationEmailSent: "A verification email has been sent to your email address. Please check your inbox."
            }
        },
        login: {
            toasts: {
                missingFields: "Please fill in both email and password.",
                success: "Login successful! Welcome back.",
                invalidCredentials: "Invalid credentials. Please check your email and password.",
                userNotFound: "User not found. Please check your email or register.",
                serverError: "Server error. Please try again later.",
                genericError: "Login failed! Please try again.",
                networkError: "Network error. Please check your connection.",
                verifyEmail: "Please verify your email to activate your account.",
                bannedUser: "You are banned from the site. Please contact the owner."
            }
        },
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
        },

    },
    hu: {
        global: {
            tel: "+36 (30) 456 4526",
            email: "{'info@garrisons.hu'}",
            owner: "Bíró Dominik, E.V.",
            shop: "Garrisons Haircraft & Barbershop",
            developer: "Nagy Róbert"
        },
     
        footer: {
            important: {
                title: "Fontos",
            },
            openingHours: {
                title: "Nyitvatartás",
                days: {
                    monday: "Hétfő",
                    tuesday: "Kedd",
                    wednesday: "Szerda",
                    thursday: "Csütörtök",
                    firday: "Péntek",
                    saturday: "Szombat",
                    sunday: "Vasárnap"
                },
                closed: "ZÁRVA",
            },
            socials: {
                title: "Közösség",
            },
            toasts: {
                error: "A nyitvatartás lekérdezése sikertelen."
            },
            rights: "Minden jog fenntartva."
        },
        hero: {
            title: "Garrison's Haircraft and Barbershop",
            subtitle: "Engedd, hogy a hajad beszéljen helyetted!",
            button: "Foglalás"
        },
        intro: {
            about: "Rólam",
            services: "Szolgáltatásaim",
            businessHours: "Nyitvatartás"
        },
        references: {
            title: "Munkáim"
        },
        guestBooking: {
            title: "Foglalj Időpontot",
            subtitle: "Kattints a naptárba egy szabad időpontra, hogy elkezdődjön az időpontfoglalás!",
            modal: {
                createAccount: "Kattints ide a regisztrációhoz!",
                haveAccount: "Már van fiókom!",
            },
            services: {
                title: "Szolgáltatások",
                subtitle: "Kérlek válaszd ki melyik szolgáltatást szeretnéd igényelni.",
            }
        },
        dashboard: {
            title: "Dashboard",
            menuItems:{
                reservations: "Foglalások",
                pendings: "Foglalási kérések",
                services: "Szolgáltatások",
                businessHours: "Munkaidő",
                users: "Felhasználók",
                references: "Képek",
            },
            manageEvents: {
                title: "Időpontok kezelése",
                dialog: {
                    confirmChanges: "Módosított Időpontok",
                    modifiedEvents: "Kérlek erősítsd meg a módosításokat, hogy érvénybe lépjenek!",
                    originalEventDetails: "Eredeti: ",
                    modifiedEventDetails: "Módosított: ",
                    button: {
                        close: "Bezárás",
                        discard: "Elvetés",
                        save: "Mentés"
                    }
                }
            },
            managePendingEvents: {
                title: "Függőben lévő időpontok kezelése",
                subtitle: "A függőben lévő időpontokat itt is el tudod fogadni/utasítani, csak úgy mint emailben.",
                noEvents: "Jelenleg egy függőben lévő időpont sincs. Tarts szünetet, igyál egy kávét, és várd meg a következő időpontot!",
                table: {
                    service: "Szolgáltatás",
                    booker: "Vendég",
                    date: "Dátum",
                    start: "Kezdés",
                    end: "Befejezés",
                    actions: "Műveletek",
                    buttons: {
                        accept: "Elfogad",
                        deny: "Elutasít"
                    },
                },
                deleteModal: {
                    title: "Függőben lévő időpont elutasítása",
                    message: "Biztosan szeretnéd elutasítani a függőben lévő időpontot?"
                },
                toast: {
                    error: {
                        token: "Nem vagy bejelentkezve, kérlek lépj be a folytatáshoz!",
                        confirm: "Időpont elfogadása sikertelen, kérlek próbáld újra később!",
                        noEvent: "Kérlek válassz egy időpontot az elutasításhoz.",
                        deny: "Az időpont elutasítása sikertelen, kérlek próbáld újra később!"

                    },
                    success: {
                        confirm: "Időpont sikeresen elfogadva!",
                        deny: "Időpont sikeresen elutasítva!",
                    }
                }
            },
            manageServices: {
                title: "Szolgáltatások Kezelése",
                subtitle: "Hozzáadhatsz, szerkeszthetsz, vagy törölhetsz szolgáltatásokat. Hagy üresen az árat, ha nem szeretnéd hogy a felhasználó kiválaszthassa a szolgáltatást!",
                table: {
                    title: "Cím",
                    price: "Ár",
                    duration: "Időtartam",
                    color: "Szín",
                    search: "Keresés",
                    searchPlaceholder: "Keress cím, ár, vagy időtartam alapján",
                    buttons: {
                        edit: "Szerkesztés",
                        delete: "Törlés",
                        add: "Új szolgáltatás"
                    },
                },
                editModal: {
                    title: "Szolgáltatás szerkesztése",
                    textFields: {
                        labels: {
                            title: "Cím",
                            price: "Ár",
                            duration: "Időtartam (percben)",

                        }
                    },
                    colorLabel: "A szolgáltatás színe: (A naptárban így jelenik meg)"
                },
                addModal: {
                    title: "Új szolgáltatás hozzáadása",
                    textFields: {
                        labels: {
                            title: "Cím",
                            price: "Ár",
                            duration: "Időtartam (Percben)",
                            color: "A szolgáltatás színe: (A naptárban így jelenik meg)"
                        }
                    },
                    buttons: {
                        cancel: "Mégsem",
                        add: "Hozzáad"
                    }
                },
                deleteModal: {
                    title: "Szolgáltatás Törlése",
                    message: "Biztosan törlni szeretnéd a szolgáltatást? A törlés nem vonható vissza!"
                },
                buttons: {
                    cancel: "Mégsem",
                    save: "Mentés"
                }
            },
            manageUsers: {
                title: "Felhasználók kezelése",
                subtitle: "Itt kezelheted a regisztrált felhasználókat.",
                table: {
                    name: "Név",
                    role: "Jogosultság",
                    email: "Email",
                    phone: "Telefonszám",
                    status: "Státusz",
                    search: "Felhasználó keresése",
                    searchPlaceholder: "Keress vezetéknév, keresztnév, email, stb. alapján",
                    buttons: {
                        edit: "Szerkesztés",
                        delete: "Törlés",
                    },
                },
                modal: {
                    title: "Felhasználó adatainak szerkesztése",
                    textFields: {
                        labels: {
                            firstName: "Keresztnév",
                            lastName: "Vezetéknév",
                            role: "Jogosultság",
                            email: "Email",
                            phoneNumber: "Telefonszám",
                            status: "Státusz"
                        }
                    },
                    buttons: {
                        cancel: "Mégsem",
                        save: "Mentés"
                    }
                },
                deleteModal: {
                    title: "Felhasználó törlése",
                    message: "Biztosan törölni szeretnéd a felhasználót? A törlés nem vonható vissza!"
                },
            },
            toast: {
                error: {
                    tokenError: "Nem vagy bejelentkezve. Kérlek lépj be újra!",
                    userUpdate: "Nem sikerült módosítani a felhasználó adatait, kérlek próbáld újra!",
                    userDelete: "A felhasználó törlése sikertelen, kérlek próbáld újra!",
                    serviceDelete: "A szolgáltatás törlése sikeretelen, kérlek próbáld újra!",
                    serviceUpdate: "A szolgáltatás módosítása sikertelen, kérlek próbáld újra!",
                    serviceAdd: "Az új szolgáltatás létrehozása sikertelen, kérlek próbáld újra!",
                },
                success: {
                    userUpdate: "Felhasználó adatai sikeresen módosítva!",
                    userDelete: "Felhasználó sikeresen törölve!",
                    serviceDelete: "Szolgáltatás sikeresen törölve!",
                    serviceUpdate: "Szolgáltatás sikeresen módosítva!",
                    serviceAdd: "Új szolgáltatás sikeresen hozzáadva!",
                }
            },
            manageBusinessHours: {
                title: "Nyitvatartás",
                subtitle: "Módosíthatod a nyitvatartásod ami az egész oldalon és a naptárban is változik.",
                table: {
                    days: "Nap",
                    open: "Nyitás",
                    close: "Zárás",
                    actions: "Műveletek",
                    buttons: {
                        edit: "Szerkesztés",
                    },
                },
                modal: {
                    title: "Nyitvatartás szerkesztése",
                    weekday: "Nap",
                    buttons: {
                        cancel: "Mégsem",
                        save: "Mentés"
                    }
                },
                toast: {
                    tokenError: "Nem vagy bejelentkezve, kérlek lépj be újra.",
                    updateSuccess: "Nyitvatartás sikeresen módosítva!",
                    updateError: "Nyitvatartás módosítása sikertelen!"
                }
            },
        },
        logout: {
            toasts: {
                success: "Sikeres kijelentkezés. Várlak vissza!"
            }
        },
        registration: {
            toasts: {
                success: "Sikeres regisztráció!",
                error: "Sikertelen regisztráció!",
                verificationEmailSent: "Visszaigazoló email sikeresen elküldve. Kérlek ellenőrizd az email címed."
            }
        },
        login: {
            forgotPassword: {
                link: "Elfelejtette a jelszavát?",
                title1:"Adja meg email címét!",
                title2:"Adja meg új jelszavát!",
                submitButton: "Küldés",
                ResetPassword: {
                    success: "Jelszó változtatás sikeres!",
                    error:"Jelszó változtatás sikertelen, kérem próbálja újra!",
                }
            },
            toasts: {
                missingFields: "Kérlek töltsd ki az email és a jelszó mezőket is!",
                success: "Siekres bejelentkezés! Üdv újra itt!",
                invalidCredentials: "Hibás bejelentkezési adatok. Kérlek ellenőrizd az email címed és a jelszavad!",
                userNotFound: "Felhasználó nem található. Kérlek ellenőrizd az email címed, vagy regisztálj.",
                serverError: "Szerver hiba. Kérlek próbáld újra később.",
                genericError: "Sikertelen bejelentkezés! Kérlek próbáld újra.",
                networkError: "Kapcsolati hiba, kérlek ellenőrizd az internetkapcsolatod.",
                verifyEmail: "Kérlek erősítsd meg az email címed, hogy aktiváld a fiókod.",
                bannedUser: "Ki vagy tiltva az oldalról. Kérlek vedd fel a kapcsolatot a tulajdonossal.",
                passwordResetEmailSent: "Jelszó változtatási email sikeresen elküldve.",
                passwordResetError: "Jelszó változtatás sikertelen, kérem próbálkozzon újra!."
            }
        },
        link: {
            home: "Főoldal",
            booking: "Foglalás",
            rules: "Szabályzat",
            references: "Munkáim"
        },
        button: {
            login: "Bejelentkezés",
            register: "Regisztráció",
            logout:"Kijelentkezés",
            dashboard: "Dashboard",
            needToRegBtn: "Regisztrálj",
            alreadyHaveAccountBtn: "Lépj be",
            book: "Foglalás",
            tel: "+36 (30) 999 3211",
            email: "{'info@garrisons.hu'}",
            calendarEdit: "Szerkesztés"
        },
        inputFields: {
            firstName: "Keresztnév",
            lastName: "Vezetéknév",
            email: "Email",
            repeatEmail: "Email Újra",
            phoneNumber: "Telefonszám",
            password: "Jelszó",
            repeatPassword: "Jelszó Újra",
            submit: "Küldés",
            newPassword:"Új Jelszó",
            newPasswordRepeat:"Új Jelszó Ismétlése",
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
        dialog: {
            date: "Dátum:",
            time: "Idő",
            service: "Szolgáltatás:",
            duration: "Időtartam:",
            duration2: "perc",
            price: "Ár:",
            price2: "HUF",
            userName: "Név:",
            userEmail: "Email:",
            userPhone: "Telefonszám:",
            bookDialog: {
                title1: "Foglalj Időpontot",
                title2: "Erősítsd meg Időpontod",
                selectTitle: "Válassz szolgáltatást",
                noServices: "Jelenleg egy szolgáltatás sem elérhető."
            },
            button: {
                save: "Mentés",
                cancel: "Mégsem",
                next: "Tovább",
                requestBook: "Időpont Kérvényezése"
            }
        },
    }
};

const i18n = createI18n({
    legacy: false,
    locale: 'hu',
    fallbackLocale: 'en',
    messages,
});

export default i18n;