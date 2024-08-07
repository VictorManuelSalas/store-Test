const axios = require("axios");

const getAllCustomersOdoo = async (token) => {
  try {
    const resp = await axios
      .get(
        `https://us-central1-smartstore-90c07.cloudfunctions.net/app/api/v1/odoo/customers`,
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
    return resp.body.customers;
  } catch (error) {
    console.log("Error: ", error);
    return error;
  }
};

module.exports = { getAllCustomersOdoo };
