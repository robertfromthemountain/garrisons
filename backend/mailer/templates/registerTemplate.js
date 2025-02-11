function registerEmailTemplate(fullName, verificationLink) {
    return `
    <div style="font-family: 'Bebas Neue', sans-serif; background-color: #f5f5f5; color: #333; padding: 20px;">
        <div style="background-color: #fff; border-radius: 8px; padding: 20px;">
            <h2 style="color: #8f6a48;">Welcome to Garrison's Haircraft & Barbershop! Please Verify Your Email</h2>
            <p>Hi <strong>${fullName}</strong>,</p>
        <div style="height: 1px; background-color: #8f6a48; margin: 20px 0; width: 100%;"></div>
        <p style="color: #0c0a09;">Welcome to <strong>Garrison's Haircraft & Barbershop</strong> – we’re thrilled to have you with us!</p>
        <br>
        <p style="color: #0c0a09;">Before you get started, we just need to verify your email address to activate your account and ensure the security of your details.</p>
        <br>
        <p style="color: #0c0a09;">To complete your registration, simply click the link below:</p>
        <a href="${verificationLink}" style="background-color: #8f6a48; color: #fff; padding: 10px 15px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block;">Verify My Email</a>
        <br><br>
        <p style="color: #0c0a09;">If the above button doesn't work, copy and paste the following URL into your browser:</p>
        <p style="color: #0c0a09;"><a href="${verificationLink}" style="color: #8f6a48; text-decoration: none;">${verificationLink}</a></p>
        <br>
        <p style="color: #0c0a09;">Once your email is verified, you'll have access to:</p>
        <ul style="color: #0c0a09;">
            <li>Exclusive offers and promotions</li>
            <li>Easy booking for your favorite services</li>
            <li>Personalized recommendations just for you</li>
        </ul>
        <p style="color: #0c0a09;">If you didn’t create an account with us, please ignore this email.</p>
        <br>
        <p style="color: #0c0a09;">Thank you for choosing <strong>Garrison's Haircraft</strong>. We look forward to giving you an exceptional experience!</p>
        <br>
        <p style="color: #0c0a09;">Best regards,</p>
        <p style="color: #0c0a09;">The Garrison's Haircraft Team</p>
        <p style="color: #0c0a09;"><strong>noreply@garrisons.com</strong></p>
    </div>
</div>
`;
}

module.exports = registerEmailTemplate;