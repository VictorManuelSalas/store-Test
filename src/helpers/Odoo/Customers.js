const axios = require("axios");

const getAllCustomersOdoo = async (token) => {
  try {
    const resp = await axios
      .get(
        `${process.env.VUE_APP_Firebase_URL_API}/api/v1/odoo/customers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        // console.log("respuesta", response);
        return response.data;
      })
      .catch((error) => {
        console.error("error", error.response.status);
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
    console.error("Error: ", error);
    return error;
  }
};

module.exports = { getAllCustomersOdoo };
