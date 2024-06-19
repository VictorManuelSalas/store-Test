import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const logIn = async (email, password) => {
  const auth = getAuth();
  return await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      return userCredential.user;
    })
    .catch((error) => {
      const errorMessage = error.message;
      return errorMessage;
    });
};

export default logIn;
