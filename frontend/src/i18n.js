import { createI18n } from "vue-i18n";

const messages = {
    en: {
        global: {
            tel: "+36 (30) 456 4526",
            email: "{'info@garrisons.hu'}",
            owner: "Bíró Dominik, E.V.",
            shop: "Garrisons Haircraft & Barbershop",
            developer: "Nagy Róbert"
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
                title: "Social Media",
            },
            toasts: {
                error: "Error fetching opening hours."
            },
            rights: "All rights reserved."
        },
        hero: {
            title: "Garrison's haircraft and barbershop",
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
                verifyEmail:"Please verify your email to activate your account.",
                bannedUser:"You are banned from the site. Please contact the owner."
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
            email: "info\\@garrisons.hu"
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