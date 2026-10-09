import sendEmail from "../../../utils/sendEmail.js";
import {
  verifyEmailTemplate,
  verifyOtpTemplate,
} from "../../../templates/verifyEmail.js";

interface EmailVerify {
  email: string;
  name: string;
  otp: string;
}

export const sendVerificationEmail = async ({
  email,
  name,
  otp,
}: EmailVerify) => {
  await sendEmail({
    to: email,
    subject: "Verify your AI Resume Reviewer account",
    html: verifyEmailTemplate(name, otp),
  });
};

export const sendResetPasswordEmail = async ({
  email,
  name,
  otp,
}: EmailVerify) => {
  await sendEmail({
    to: email,
    subject: "Verify your AI Resume Reviewer account",
    html: verifyOtpTemplate(name, otp),
  });
};
