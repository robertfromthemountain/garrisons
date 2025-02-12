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
                <h2 style="color: #e6413d;">Időpontodat törölték a rendszerből!</h2>
                <p>Kedves <strong>${fullName}</strong>,</p>
                <div style="height: 1px; background-color: #e6413d; margin: 20px 0; width: 100%;"></div>
                <p style="color: #0c0a09;">Sajnálattal tudatjuk, hogy következő időpontod törlésre került:</p>
                <br>
                <p><strong>Szolgáltatás:</strong> ${eventData.title}</p>
                <p><strong>Dátum:</strong> ${formattedDate}</p>
                <p><strong>Kezdet:</strong> ${formattedStartTime}</p>
                <p><strong>Befejezés:</strong> ${formattedEndTime}</p>
                <br>
                <p style="color: #0c0a09;">Ha szeretnél, foglalj egy új időpontot a weboldalon.</p>
                <br>
                <p style="color: #0c0a09;">Kérdés esetén keress minket bátran!</p>
                <p><br>Garrison's Haircraft csapata</p>
            </div>
        </div>
    `;
}

module.exports = appointmentCancellationTemplate;
