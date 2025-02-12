function registerEmailTemplate(fullName, verificationLink) {
    return `
    <div style="font-family: 'Bebas Neue', sans-serif; background-color: #f5f5f5; color: #333; padding: 20px;">
        <div style="background-color: #fff; border-radius: 8px; padding: 20px;">
            <h2 style="color: #8f6a48;">Üdvözlünk a Garrison's Haircraft & Barbershop-nál! Kérjük, erősítsd meg az email címedet</h2>
            <p>Kedves <strong>${fullName}</strong>,</p>
        <div style="height: 1px; background-color: #8f6a48; margin: 20px 0; width: 100%;"></div>
        <p style="color: #0c0a09;">Üdvözlünk a <strong>Garrison's Haircraft & Barbershop</strong> közösségében – örömünkre szolgál, hogy csatlakoztál hozzánk!</p>
        <br>
        <p style="color: #0c0a09;">Mielőtt elkezdenéd használni szolgáltatásainkat, kérjük, erősítsd meg az email címedet, hogy aktiválhassuk a fiókodat, és biztosíthassuk az adataid biztonságát.</p>
        <br>
        <p style="color: #0c0a09;">A regisztráció befejezéséhez kattints az alábbi linkre:</p>
        <a href="${verificationLink}" style="background-color: #8f6a48; color: #fff; padding: 10px 15px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block;">Email cím megerősítése</a>
        <br><br>
        <p style="color: #0c0a09;">Ha a fenti gomb nem működik, másold be az alábbi URL-t a böngésződ címsorába:</p>
        <p style="color: #0c0a09;"><a href="${verificationLink}" style="color: #8f6a48; text-decoration: none;">${verificationLink}</a></p>
        <br>
        <p style="color: #0c0a09;">Az email cím megerősítése után hozzáférhetsz:</p>
        <ul style="color: #0c0a09;">
            <li>Exkluzív ajánlatokhoz és akciókhoz</li>
            <li>Kedvenc szolgáltatásaid könnyű foglalásához</li>
            <li>Személyre szabott ajánlásokhoz</li>
        </ul>
        <p style="color: #0c0a09;">Ha nem te hoztad létre ezt a fiókot, kérjük, hagyd figyelmen kívül ezt az emailt.</p>
        <br>
        <p style="color: #0c0a09;">Köszönjük, hogy a <strong>Garrison's Haircraft</strong>-ot választottad. Alig várjuk, hogy kiváló élményt nyújthassunk neked!</p>
        <br>
        <p style="color: #0c0a09;">Üdvözlettel,</p>
        <p style="color: #0c0a09;">A Garrison's Haircraft csapata</p>
        <p style="color: #0c0a09;"><strong>noreply@garrisons.com</strong></p>
    </div>
</div>
`;
}

module.exports = registerEmailTemplate;
