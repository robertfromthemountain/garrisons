function passwordResetTemplate(resetLink) {
    return `
    <div style="font-family: 'Bebas Neue', sans-serif; background-color: #f5f5f5; color: #333; padding: 20px;">
        <div style="background-color: #fff; border-radius: 8px; padding: 20px;">
            <h2 style="color: #8f6a48;">Jelszó visszaállítása</h2>
            <p style="color: #0c0a09;">Kedves Felhasználó,</p>
            <div style="height: 1px; background-color: #8f6a48; margin: 20px 0; width: 100%;"></div>
            <p style="color: #0c0a09;">Egy kérést kaptunk a fiókod jelszavának visszaállítására. Ha te kezdeményezted ezt a műveletet, kattints az alábbi linkre a folytatáshoz:</p>
            <a href="${resetLink}" style="background-color: #8f6a48; color: #fff; padding: 10px 15px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block;">Jelszó visszaállítása</a>
            <br><br>
            <p style="color: #0c0a09;">Ha a fenti gomb nem működik, másold be az alábbi URL-t a böngésződ címsorába:</p>
            <p style="color: #0c0a09;"><a href="${resetLink}" style="color: #8f6a48; text-decoration: none;">${resetLink}</a></p>
            <br>
            <p style="color: #0c0a09;">Figyelem! Ez a link csak 10 percig érvényes.</p>
            <br>
            <p style="color: #0c0a09;">Ha nem te kérted a jelszó visszaállítását, kérjük, hagyd figyelmen kívül ezt az emailt, és a fiókod továbbra is biztonságban marad.</p>
            <br>
            <p style="color: #0c0a09;">Köszönjük, hogy a <strong>Garrison's Haircraft</strong>-ot választod. Ha bármilyen segítségre van szükséged, fordulj bizalommal hozzánk!</p>
            <br>
            <p style="color: #0c0a09;">Üdvözlettel,</p>
            <p style="color: #0c0a09;">A Garrison's Haircraft csapata</p>
            <p style="color: #0c0a09;"><strong>noreply@garrisons.com</strong></p>
        </div>
    </div>
    `;
}

module.exports = passwordResetTemplate;
