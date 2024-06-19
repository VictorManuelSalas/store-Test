import { getAuth, applyActionCode } from "firebase/auth";

const handleVerifyEmail = async (actionCode) => {
  const auth = getAuth();
  console.log('test',auth.currentUser)
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

export default handleVerifyEmail;
