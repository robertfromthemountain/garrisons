const registerEmailTemplate = require('./registerTemplate'); // Add the new template
const passwordResetTemplate = require('./passwordResetTemplate');
const pwdResetSuccess = require('./pwdResetSuccessTemplate');
const appointmentRequestTemplate = require('./requestEventTemplate'); // Add the new template
const appointmentConfirmationTemplate = require('./confirmEventTemplate');
const appointmentDenialTemplate = require('./denyEventTemplate');
const appointmentUpdateTemplate = require('./updateAppointmentTemplate');
const appointmentCancellationTemplate = require('./cancelAppointmentTemplate');


module.exports = {
    registerEmailTemplate,
    passwordResetTemplate,
    pwdResetSuccess,
    appointmentRequestTemplate, // Export the new template
    appointmentConfirmationTemplate,
    appointmentDenialTemplate,
    appointmentUpdateTemplate,
    appointmentCancellationTemplate,
};
