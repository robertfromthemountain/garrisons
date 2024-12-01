function appointmentRequestTemplate({
    fullName,
    service,
    formattedDate,
    formattedStartTime,
    formattedEndTime,
    eventId,
}) {
    return `
        <div style="font-family: 'Bebas Neue', sans-serif; background-color: #f5f5f5; color: #333; padding: 20px;">
            <div style="background-color: #fff; border-radius: 8px; padding: 20px;">
                <h2 style="color: #8f6a48;">New Appointment Request</h2>
                <p>A new appointment has been requested by <strong>${fullName}</strong></p>
                <div style="height: 1px; background-color: #8f6a48; margin: 20px 0; width: 100%;"></div>

                <p style="color: #0c0a09;"><strong>Service:</strong> ${service.title}</p>
                <p style="color: #0c0a09;"><strong>Duration:</strong> ${service.duration} minutes</p>
                <p style="color: #0c0a09;"><strong>Price:</strong> ${service.price} HUF</p>
                <p style="color: #0c0a09;"><strong>Date:</strong> ${formattedDate}</p>
                <p style="color: #0c0a09;"><strong>Start Time:</strong> ${formattedStartTime}</p>
                <p style="color: #0c0a09;"><strong>End Time:</strong> ${formattedEndTime}</p>
                <a href="http://localhost:5000/api/events/confirmEvent/${eventId}" style="background-color: #8f6a48; color: #fff; padding: 10px 15px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block;">Confirm Appointment</a>
                <a href="http://localhost:5000/api/events/deletePendingEvent/${eventId}" style="background-color: #e6413d; color: #fff; padding: 10px 15px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block;">Deny Appointment</a>
                <p style="color: #0c0a09;">If you have any questions, feel free to contact us.</p>
            </div>
        </div>
    `;
}

module.exports = appointmentRequestTemplate;
