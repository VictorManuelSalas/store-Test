import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  verifyPasswordResetCode,
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  applyActionCode,
  deleteUser,
} from "firebase/auth";

const auth = getAuth();

const logIn = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      return userCredential.user;
    })
    .catch((error) => {
      const errorMessage = error.message;
      return errorMessage;
    });
};

const logOut = async ( ) => {
  console.log("cerrando sesion..." ); 
  return await signOut( auth)
    .then(() => {
      return 200;
    })
    .catch((error) => {
      const errorMessage = error.message;
      return errorMessage;
    });
};

const handleResetPassword = async (actionCode, newPassword) => {
  return await verifyPasswordResetCode(auth, actionCode)
    .then((email) => {
      const accountEmail = email;
      console.log(accountEmail);
      confirmPasswordReset(auth, actionCode, newPassword)
        .then((resp) => {
          console.log("entre y si se cambio", resp);
          return resp;
        })
        .catch((error) => {
          console.log(error);
          return error;
        });
    })
    .catch((error) => {
      return error.message;
    });
};

const registerUserAndSendVerificationEmail = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    await sendEmailVerification(user);
    console.log("Correo de verificación enviado a:", email);
    console.log(user);
    return user;
  } catch (error) {
    console.error(
      "Error al registrar el usuario y enviar el correo de verificación:",
      error.message
    );
    return error.message;
  }
};

const handleVerifyEmail = async (actionCode) => {
  console.log("test", auth.currentUser);
  return await applyActionCode(auth, actionCode)
    .then((resp) => {
      console.log("entre y si se verifico", resp);
      return resp;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
};

const getUserAuthByEmail = async (email) => {
  try {
    deleteUser("w9YMqgSjxGVAXNqE3dTOYDENLiy1")
      .then(() => {
        console.error("elimindai");
        // User deleted.
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        // An error ocurred
        // ...
      });

    return "user";
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};
export {
  logIn,
  logOut,
  handleResetPassword,
  registerUserAndSendVerificationEmail,
  handleVerifyEmail,
  getUserAuthByEmail,
};
