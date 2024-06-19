import {
  getAuth,
  verifyPasswordResetCode,
  confirmPasswordReset,
} from "firebase/auth";

const handleResetPassword = async (actionCode, newPassword) => {
  const auth = getAuth();
  return await verifyPasswordResetCode(auth, actionCode)
    .then((email) => {
      const accountEmail = email;
      console.log(accountEmail);
      confirmPasswordReset(auth, actionCode, newPassword)
        .then((resp) => {
          console.log('entre y si se cambio', resp);
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

export default handleResetPassword;
