// utils/validation.js

// First name validation
const validateFirstName = (value) => {
    if (!value) return "First name is required";
    if (!/^[A-Z][a-z]*/.test(value)) return "First name must start with an uppercase letter and have at least 3 characters";
    return null;
};

// Last name validation
const validateLastName = (value) => {
    if (!value) return "Last name is required";
    if (!/^[A-Z][a-z]*/.test(value)) return "Last name must start with an uppercase letter and have at least 3 characters";
    return null;
};

// Email validation
const validateEmail = (value) => {
    if (!value) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email format";
    return null;
};

// Phone number validation
const validatePhone = (value) => {
    if (!value) return "Phone number is required";
    if (value.length < 9 && /^\d+$/.test(value)) return "Phone number must be at least 9 digits";
    return null;
};

// Password validation
const validatePassword = (value) => {
    if (!value) return "Password is required";
    if (value.length < 8) return "Password must be at least 8 characters";
    if (!/\d/.test(value)) return "Password must include at least one number";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) return "Password must include at least one special character";
    if (!/[A-Z]/.test(value)) return "Password must include at least one uppercase letter";
    if (!/[a-z]/.test(value)) return "Password must include at least one lowercase letter";
    return null;
};

// Export all functions
module.exports = {
    validateFirstName,
    validateLastName,
    validateEmail,
    validatePhone,
    validatePassword,
};
