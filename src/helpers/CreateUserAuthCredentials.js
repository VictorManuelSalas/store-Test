import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";

const registerUserAndSendVerificationEmail = async (email, password) => {
  try {
    const auth = getAuth();

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    await sendEmailVerification(user);
    console.log("Correo de verificación enviado a:", email);

    return user
  } catch (error) {
    console.error(
      "Error al registrar el usuario y enviar el correo de verificación:",
      error.message
    );
    return error.message
  }
};

export default registerUserAndSendVerificationEmail;
