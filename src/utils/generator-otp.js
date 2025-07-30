import { generate } from "otp-generator";

export const generateOtp = () => {
  return generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
    digits: true, // default true bo'ladi
  });
};
