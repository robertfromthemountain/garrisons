function appointmentCancellationTemplate({
    fullName,
    eventData,
    formattedDate,
    formattedStartTime,
    formattedEndTime,
}) {
    return `
        <div style="font-family: 'Bebas Neue', sans-serif; background-color: #f5f5f5; color: #333; padding: 20px;">
            <div style="background-color: #fff; border-radius: 8px; padding: 20px;">
                <h2 style="color: #e6413d;">Appointment Cancelled at Garrison's Haircraft</h2>
                <p>Hi <strong>${fullName}</strong>,</p>
                <div style="height: 1px; background-color: #e6413d; margin: 20px 0; width: 100%;"></div>
                <p style="color: #0c0a09;">We regret to inform you that your appointment for the following service has been cancelled:</p>
                <p><strong>Service:</strong> ${eventData.title}</p>
                <p><strong>Date:</strong> ${formattedDate}</p>
                <p><strong>Start Time:</strong> ${formattedStartTime}</p>
                <p><strong>End Time:</strong> ${formattedEndTime}</p>
                <br>
                <p style="color: #0c0a09;">If you have any questions or would like to reschedule, please feel free to contact us.</p>
                <p>Best regards,<br>The Garrison's Haircraft Team</p>
            </div>
        </div>
    `;
}

module.exports = appointmentCancellationTemplate;
