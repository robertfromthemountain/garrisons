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
                <h2 style="color: #8f6a48;">Időpontod módosult a Garrison's Haircraft-nál</h2>
                <p>Kedves <strong>${fullName}</strong>,</p>
                <div style="height: 1px; background-color: #8f6a48; margin: 20px 0; width: 100%;"></div>
                <p style="color: #0c0a09;">Az időpontod az alábbi részletekkel frissült:</p>
                <br>
                <p style="color: #0c0a09;"><strong>Szolgáltatás:</strong> ${eventData.title}</p>
                <p style="color: #0c0a09;"><strong>Ár:</strong> ${eventData.price} HUF</p>
                <p style="color: #0c0a09;"><strong>Dátum:</strong> ${formattedDate}</p>
                <p style="color: #0c0a09;"><strong>Kezdés ideje:</strong> ${formattedStartTime}</p>
                <p style="color: #0c0a09;"><strong>Időtartam:</strong> ${eventData.duration} perc</p>
                <p style="color: #0c0a09;"><strong>Befejezés ideje:</strong> ${formattedEndTime}</p>
                <br>
                <p style="color: #0c0a09;">Ha bármilyen kérdésed van, fordulj hozzánk bizalommal.</p>
                <br>
                <p style="color: #0c0a09;">Üdvözlettel,</p>
                <p style="color: #0c0a09;">A Garrison's Haircraft csapata</p>
                <p style="color: #0c0a09;"><strong>noreply@garrisons.com</strong></p>
            </div>
        </div>
    `;
}

module.exports = appointmentUpdateTemplate;
