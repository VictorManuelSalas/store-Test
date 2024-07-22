const axios = require("axios");

const getInvoicesUser = async (usersId, token) => {
  try {
    console.log(
      `https://us-central1-smartstore-90c07.cloudfunctions.net/app/api/v1/odoo/getInvoices/${usersId}`,
      `Bearer ${token}`
    );
    const resp = await axios
      .get(
        `https://us-central1-smartstore-90c07.cloudfunctions.net/app/api/v1/odoo/getInvoices/${usersId}`,
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
    return resp.body.invoices;
  } catch (error) { 
    return error;
  }
};

const downloadInvoice = async (invoice, token) => {
  try {
    const { name } = invoice;
    const response = await axios.post(
      "https://us-central1-smartstore-90c07.cloudfunctions.net/app/api/v1/odoo/downloadInvoice",
      invoice,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        responseType: "blob",
      }
    );

    // Crear un enlace temporal para descargar el archivo
    const blob = new Blob([response.data], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `${name}.pdf`; // nombre del archivo que se descargará
    link.click();
    window.URL.revokeObjectURL(link.href); // limpiar el URL del objeto después de la descarga
    return 200;
  } catch (error) {
    console.error("Error al descargar el PDF:", error);
    return error;
  }
};

const openInvoiceView = async (invoice, token) => {
  try {
    const response = await axios.post(
      "https://us-central1-smartstore-90c07.cloudfunctions.net/app/api/v1/odoo/openInvoice",
      invoice,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        responseType: "blob",
      }
    );

    // Crear un enlace temporal para descargar el archivo
    const blob = new Blob([response.data], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    window.URL.revokeObjectURL(link.href); // limpiar el URL del objeto después de la descarga
    return 200;
  } catch (error) {
    console.error("Error al descargar el PDF:", error);
    return error;
  }
};
module.exports = { getInvoicesUser, downloadInvoice, openInvoiceView };
