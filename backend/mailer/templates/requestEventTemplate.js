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
                <h2 style="color: #8f6a48;">Új időpontkérés érkezett</h2>
                <p><strong>${fullName}</strong> új időpontot kért.</p>
                <div style="height: 1px; background-color: #8f6a48; margin: 20px 0; width: 100%;"></div>

                <p style="color: #0c0a09;"><strong>Szolgáltatás:</strong> ${service.title}</p>
                <p style="color: #0c0a09;"><strong>Ár:</strong> ${service.price} HUF</p>
                <p style="color: #0c0a09;"><strong>Dátum:</strong> ${formattedDate}</p>
                <p style="color: #0c0a09;"><strong>Időtartam:</strong> ${service.duration} perc</p>
                <p style="color: #0c0a09;"><strong>Kezdés ideje:</strong> ${formattedStartTime}</p>
                <p style="color: #0c0a09;"><strong>Befejezés ideje:</strong> ${formattedEndTime}</p>
                <a href="http://localhost:5000/api/events/confirmEvent/${eventId}" style="background-color: #8f6a48; color: #fff; padding: 10px 15px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block;">Időpont jóváhagyása</a>
                <a href="http://localhost:5000/api/events/deletePendingEvent/${eventId}" style="background-color: #e6413d; color: #fff; padding: 10px 15px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block;">Időpont elutasítása</a>
            </div>
        </div>
    `;
}

module.exports = appointmentRequestTemplate;
