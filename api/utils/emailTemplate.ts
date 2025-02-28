type EmailType = 'passwordReset' | 'welcome' | 'verifyEmail';

const emailTypes: Record<
  EmailType,
  { title: string; message: string; footer: string; buttonContent: string }
> = {
  passwordReset: {
    title: 'Password Reset',
    message:
      'If you have lost your password or wish to reset it, use the link below to get started.',
    footer:
      'If you did not request a password reset, you can safely ignore this email. Only a person with access to your email can reset your account password.',
    buttonContent: 'Reset Your Password',
  },
  welcome: {
    title: 'Welcome to Complex Blog',
    message:
      'Thank you for signing up with us. We are excited to have you on board.',
    footer: 'For any queries, please contact us at  [email protected]',
    buttonContent: 'Get Started',
  },
  verifyEmail: {
    title: 'Verify Your Email',
    message: 'Please verify your email by clicking the button below.',
    footer:
      'If you did not create an account, you can safely ignore this email.',
    buttonContent: 'Verify Email',
  },
};

export const generateEmailTemplate = (
  emailType: EmailType,
  buttonLink: string,
): string => {
  const title = emailTypes[emailType].title;
  const message = emailTypes[emailType].message;
  const footer = emailTypes[emailType].footer;
  const buttonContent = emailTypes[emailType].buttonContent;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Password Reset</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .email-container {
      width: 100%;
      padding: 20px;
    }
    .email-content {
      max-width: 500px;
      margin: 0 auto;
      background: #ffffff;
      padding: 40px;
      text-align: center;
      border-radius: 8px;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    }
    .logo {
      margin-bottom: 20px;
    }
    .title {
      font-size: 22px;
      font-weight: bold;
      color: #333;
      margin-bottom: 10px;
    }
    .message {
      font-size: 16px;
      color: #555;
      margin-bottom: 20px;
    }
    .btn {
      display: inline-block;
      padding: 12px 20px;
      background-color: #3498db;
      color: #ffffff;
      text-decoration: none;
      font-size: 16px;
      border-radius: 5px;
      font-weight: bold;
    }
    .footer {
      font-size: 12px;
      color: #888;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-content">
      <img src="https://github.com/nathanaelcheramlak/complex-blog/blob/main/public/ComplexLogo.png" alt="Company Logo" class="logo" width="100">
      <h2 class="title">${title}</h2>
      <p class="message">${message}</p>
      <a href="${buttonLink}" class="btn">${buttonContent}</a>
      <p class="footer">
        ${footer}
      </p>
    </div>
  </div>
</body>
</html>

    `;
};
