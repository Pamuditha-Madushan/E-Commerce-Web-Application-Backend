const getEmailTemplate = (verificationToken) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
        }
        .company-name {
            background-color: #4CAF50; /* Change this color as needed */
            color: white;
            padding: 20px;
            text-align: center;
            font-size: 24px;
        }
        .content {
            text-align: center;
            padding: 20px;
        }
        hr {
            margin: 20px 0;
            border: 1px solid #ccc;
        }
    </style>
</head>
<body>

    <div class="company-name">
        MPA
    </div>

    <div class="content">
        <div style="margin: 20px 0;">
            <h2>Verification Code</h2>
        </div>

        <div style="margin: 30px 0;">
            <h3><b>${verificationToken}</b></h3>
        </div>

        <div style="margin: 30px 0;">
            <p>( This code will expire 10 minutes after it was sent. )</p>
        </div>
        
        <hr>
        
        <p style="text-align: left;">MPA will never email you and ask you to disclose or verify your password, credit card, or banking account number. If you receive a suspicious email with a link to update your account information, do not click on the link. Instead, report the email to MPA for investigation.</p>

        <p style="margin: 20px 0; text-align: left;">If you did not request this code, please ignore this email.</p>
        
        <hr>
        
        <div style="margin: 20px 0;">
            <p>Thank you for verifying your email with us!</p>
        </div>
    </div>

</body>
</html>`;
};

module.exports = getEmailTemplate;
