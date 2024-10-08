import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  verifyPasswordResetCode,
  confirmPasswordReset,
  applyActionCode,
  deleteUser,
} from "firebase/auth";

const auth = getAuth();

const axios = require("axios");

//Backend Functions
const registerUserAndSendCredentials = async (data, token) => {
  try {
    // console.log(data, token);
    const resp = await axios
      .post(
        `${process.env.VUE_APP_Firebase_URL_API}/api/v1/customers/new`,
        { user: data },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        // console.log("respuesta", response.data);
        return response.data;
      })
      .catch((error) => {
        // console.log("respuesta", error.response.status);
        if (error.response.status === 403) {
          throw new Error(403);
        }
        throw new Error(error.response.data.body.msg);
      });

    if (resp.error) {
      return resp.body.msg;
    }
    return resp.body;
  } catch (error) {
    console.error("Error: ", error);
    return error;
  }
};

const verifyEmail = async (customer) => {
  try {
    const { firstname, lastname, auth, email } = customer;
    const data = {
      name: `${firstname} ${lastname}`,
      email: email,
    };
    const resp = await axios
      .post(
        `${process.env.VUE_APP_Firebase_URL_API}/api/v1/customers/sendVerificationEmail`,
        { customer: data },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      )
      .then((response) => { 
        return response.data;
      })
      .catch((error) => {
        console.error("respuesta", error.response.status);
        if (error.response.status === 403) {
          throw new Error(error.response.data);
        }
        throw new Error(error.response.data.body.msg);
      });

    if (resp.error) {
      return resp.body.msg;
    }
    return resp;
  } catch (error) {
    console.error("Error: ", error);
    return error;
  }
};

const changePasswordUser = async (user, auth) => {
  try {
    const resp = await axios
      .put(
        `${process.env.VUE_APP_Firebase_URL_API}/api/v1/profile/changePassword`,
        { user },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      )
      .then((response) => { 
        return response.data;
      })
      .catch((error) => {
        console.error("respuesta", error.response.status);
        if (error.response.status === 403) {
          throw new Error(403);
        }
        throw new Error(error.response.data.body.msg);
      });

    if (resp.error) {
      return resp.body.msg;
    }
    return resp;
  } catch (error) {
    console.log("Error: ", error);
    return error;
  }
};

//Firebase
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

const logOut = async () => {
  return await signOut(auth)
    .then(() => {
      console.log('Log out success')
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
      // const accountEmail = email;
      // console.log(accountEmail);
      confirmPasswordReset(auth, actionCode, newPassword)
        .then((resp) => {
          return resp;
        })
        .catch((error) => {
          // console.log(error);
          return error;
        });
    })
    .catch((error) => {
      return error.message;
    });
};

const handleVerifyEmail = async (actionCode) => {
  return await applyActionCode(auth, actionCode)
    .then((resp) => {
      return resp;
    })
    .catch((error) => {
      // console.log(error);
      return error;
    });
};

//Google API
const refreshToken = async (auth) => {
  try {
    const apiKey = auth.api_key;
    const refreshToken = auth.refreshToken;

    const tokenResponse = await axios
      .post(
        `https://securetoken.googleapis.com/v1/token?key=${apiKey}`,
        new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((response) => {
        // console.log("Response data:", response.data);
        return response.data;
      })
      .catch((error) => {
        console.error("Error:", error);
        throw new Error(error);
      });

    return tokenResponse;
  } catch (error) {
    return error;
  }
};

export {
  logIn,
  logOut,
  handleResetPassword,
  registerUserAndSendCredentials,
  handleVerifyEmail,
  verifyEmail,
  refreshToken,
  changePasswordUser,
};
