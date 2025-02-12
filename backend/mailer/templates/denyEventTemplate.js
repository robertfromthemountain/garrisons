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
                <h2 style="color: #8f6a48;">Időpont visszautasítva</h2>
                <p>Kedves <strong>${userName}</strong>,</p>
                <p>We regret to inform you that your appointment request for the following service has been denied:</p>
                <p>Sajnálattal tudatjuk, hogy időpontfoglalási kérelmed vissza lett utasítva.</p>
                <ul>
                    <li><strong>Szolgáltatás:</strong> ${event.title}</li>
                    <li><strong>Ár:</strong> ${event.price} HUF</li>
                    <li><strong>Dátum:</strong> ${formattedDate}</li>
                    <li><strong>Kezdet:</strong> ${formattedStartTime}</li>
                    <li><strong>Időtartam:</strong> ${event.duration} minutes</li>
                    <li><strong>Befejezés:</strong> ${formattedEndTime}</li>
                </ul>
                <p style="color: #0c0a09;">Kérdés esetén keress minket bátran!</p>
                <p><br>Garrison's Haircraft csapata</p>
            </div>
        </div>
    `;
}

module.exports = appointmentDenialTemplate;
