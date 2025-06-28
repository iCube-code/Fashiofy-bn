function otpTemplate(otp_code) {
  return `
    <!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Your OTP Code</title>
</head>

<body style="margin:0; padding:0; background-color:#f4f4f4; font-family: Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f4; padding: 40px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" border="0"
                    style="background-color:#222222; border-radius:8px; padding:30px; box-shadow:0 2px 4px rgba(0,0,0,0.1);">
                    <tr>
                        <td align="center" style="padding-bottom: 20px;">
                            <h2 style="color:#bdbdbd; margin:0; font-size:24px;">Verification Code</h2>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="font-size:16px; color:#bdbdbd; padding-bottom: 20px;">
                            Use the code below to verify your email address:
                        </td>
                    </tr>
                    <tr>
                        <td align="center"
                            style="font-size:32px; font-weight:bold; color:#1a73e8; letter-spacing:5px; padding: 30px 0;">
                            ${otp_code}
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="font-size:16px; color:#959595; padding-bottom: 20px;">
                            This code is valid for 10 minutes. If you didn’t request this, please ignore this email.
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="font-size:12px; color:#aaaaaa; padding-top:20px;">
                            &copy; 2025 Your Company Name. All rights reserved.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>

    `
}


module.exports = { otpTemplate }