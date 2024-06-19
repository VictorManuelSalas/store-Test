import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const sendTemplatePasswordResetEmail = async (email) => {
  const auth = getAuth();
  try {
    await sendPasswordResetEmail(auth, email);
    return "Email was send it";
  } catch (error) {
    return error.message;
  }
};

export default sendTemplatePasswordResetEmail;
