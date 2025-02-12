function pwdResetSuccess() {
    return `
    <div style="font-family: 'Bebas Neue', sans-serif; background-color: #f5f5f5; color: #333; padding: 20px;">
        <div style="background-color: #fff; border-radius: 8px; padding: 20px;">
            <h2 style="color: #8f6a48;">Jelszavad sikeresen megváltozott</h2>
            <p style="color: #0c0a09;">Kedves Felhasználó,</p>
            <div style="height: 1px; background-color: #8f6a48; margin: 20px 0; width: 100%;"></div>
            <p style="color: #0c0a09;">A jelszavadat sikeresen frissítettük. Ha nem te kérted ezt a változtatást, kérjük, azonnal lépj kapcsolatba az ügyfélszolgálatunkkal.</p>
            <br>
            <p style="color: #0c0a09;">Amennyiben te végezted el a változtatást, nincs további teendőd.</p>
            <br>
            <p style="color: #0c0a09;">Köszönjük, hogy a <strong>Garrison's Haircraft</strong>-ot választod!</p>
            <br>
            <p style="color: #0c0a09;">Üdvözlettel,</p>
            <p style="color: #0c0a09;">A Garrison's Haircraft csapata</p>
            <p style="color: #0c0a09;"><strong>noreply@garrisons.com</strong></p>
        </div>
    </div>
    `;
}

module.exports = pwdResetSuccess;
