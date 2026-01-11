import { betterAuth, email } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.nodemailerlUser,
    pass: process.env.nodemailerPass,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  trustedOrigins:[process.env.APP_Origins!],
  user: {
    additionalFields:{
        role: {
            type: "string",
            defaultValue:"USER",
            required: false
        },
        phone: {
            type: "string",
            required: false
        },
        status: {
            type: "string",
            defaultValue: "ACTIVE",
            required: false
        }
    }
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true
  },
   emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ( { user, url, token }, request) => {
    const verificationToken = `${process.env.APP_Origins}/verify-email?token=${token}`
    const info = await transporter.sendMail({
    from: '"prisma Blog App" <prismablog.gmail.com>',
    to: user.email,
    subject: "Hello ✔",
    text: "Hello world?", // Plain-text version of the message
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
</head>
<body style="font-family: Arial, sans-serif; background:#f9f9f9; padding:20px;">
  <div style="max-width:500px; margin:auto; background:#ffffff; padding:20px; border-radius:6px;">
    
    <h2>Email Verification</h2>

    <p>Hello,</p>

    <p>
      Please verify your email address by clicking the button below:
    </p>

    <p style="margin:20px 0;">
      <a href="${verificationToken}"
         style="background:#2563eb; color:#ffffff; padding:10px 16px; text-decoration:none; border-radius:4px;">
        Verify Email
      </a>
    </p>

    <p>
      If you did not create an account, you can safely ignore this email.
    </p>

    <p style="font-size:12px; color:#888;">
      This link will expire in a short time.
    </p>

  </div>
</body>
</html>
`
  });

  console.log("Message sent:", info.messageId);
    },
  },

  socialProviders: {
        google: { 
          prompt: "select_account consent",
          accessType: "offline", 
          clientId: process.env.GOOGLE_CLIENT_ID as string, 
          clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },
});
