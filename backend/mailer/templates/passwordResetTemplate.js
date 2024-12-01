function passwordResetTemplate(resetLink){
    return `
                <h2>Password Reset Request</h2>
                <p>Click the link below to reset your password:</p>
                <a href="${resetLink}">Reset Password</a>
                <p>This link is valid for 10 minutes.</p>
            `;
}

module.exports=passwordResetTemplate;