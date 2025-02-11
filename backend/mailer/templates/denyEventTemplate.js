function appointmentDenialTemplate({
    userName,
    event,
    formattedDate,
    formattedStartTime,
    formattedEndTime,
}) {
    return `
        <div style="font-family: 'Bebas Neue', sans-serif; background-color: #f5f5f5; color: #333; padding: 20px;">
            <div style="background-color: #fff; border-radius: 8px; padding: 20px;">
                <h2 style="color: #8f6a48;">Appointment Denied</h2>
                <p>Dear <strong>${userName}</strong>,</p>
                <p>We regret to inform you that your appointment request for the following service has been denied:</p>
                <ul>
                    <li><strong>Service:</strong> ${event.title}</li>
                    <li><strong>Duration:</strong> ${event.duration} minutes</li>
                    <li><strong>Price:</strong> ${event.price} HUF</li>
                    <li><strong>Date:</strong> ${formattedDate}</li>
                    <li><strong>Start Time:</strong> ${formattedStartTime}</li>
                    <li><strong>End Time:</strong> ${formattedEndTime}</li>
                </ul>
                <p>If you have any questions, feel free to contact us.</p>
            </div>
        </div>
    `;
}

module.exports = appointmentDenialTemplate;
