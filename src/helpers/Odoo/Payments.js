const axios = require("axios");

const getPaymentsUser = async (usersId, token) => {
  try {
    console.log(
      `http://127.0.0.1:5001/smartstore-90c07/us-central1/app/api/v1/odoo/getPayments/${usersId}`,
      `Bearer ${token}`
    );
    const resp = await axios
      .get(
        `http://127.0.0.1:5001/smartstore-90c07/us-central1/app/api/v1/odoo/getPayments/${usersId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log("respuesta", response);
        return response.data;
      })
      .catch((error) => {
        console.log("respuesta", error.response.status);
        if (error.response.status === 403) {
          throw new Error(403);
        }
        throw new Error(error.response.data.body.msg);
      });

    if (resp.error) {
      return resp.body.msg;
    }
    return resp.body.payments;
  } catch (error) { 
    return error;
  }
};
 
module.exports = { getPaymentsUser };
