function appointmentUpdateTemplate({
    fullName,
    eventData,
    formattedDate,
    formattedStartTime,
    formattedEndTime,
}) {
    return `
        <div style="font-family: 'Bebas Neue', sans-serif; background-color: #f5f5f5; color: #333; padding: 20px;">
            <div style="background-color: #fff; border-radius: 8px; padding: 20px;">
                <h2 style="color: #8f6a48;">Appointment Updated at Garrison's Haircraft</h2>
                <p>Hi <strong>${fullName}</strong>,</p>
                <div style="height: 1px; background-color: #8f6a48; margin: 20px 0; width: 100%;"></div>
                <p style="color: #0c0a09;">Your appointment has been updated with the following details:</p>
                <br>
                <p style="color: #0c0a09;"><strong>Service:</strong> ${eventData.title}</p>
                <p style="color: #0c0a09;"><strong>Date:</strong> ${formattedDate}</p>
                <p style="color: #0c0a09;"><strong>Start Time:</strong> ${formattedStartTime}</p>
                <p style="color: #0c0a09;"><strong>End Time:</strong> ${formattedEndTime}</p>
                <br>
                <p style="color: #0c0a09;">If you have any questions, feel free to contact us.</p>
                <br>
                <p style="color: #0c0a09;">Best regards,</p>
                <p style="color: #0c0a09;">The Garrison's Haircraft Team</p>
                <p style="color: #0c0a09;"><strong>noreply@garrisons.com</strong></p>
            </div>
        </div>
    `;
}

module.exports = appointmentUpdateTemplate;
