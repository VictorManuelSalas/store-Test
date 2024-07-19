import {
  getFirestore,
  collection,
  addDoc,
  Timestamp,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
const axios = require("axios");

const db = getFirestore();

//Create User
const createUser = async (data) => {
  try {
    if ("name" in data.avatar) {
      data.avatar = await uploadImage(data.avatar)
        .then((downloadURL) => {
          return downloadURL;
        })
        .catch((error) => {
          console.error("Upload failed:", error);
        });
    } else {
      data.avatar = [];
    }
    const docRef = await addDoc(collection(db, "users"), {
      ...data,
      archived: false,
      createAt: Timestamp.fromDate(new Date()),
    });
    return { id: docRef.id, status: true };
  } catch (e) {
    console.error("Error adding user: ", e);
    return e.message;
  }
};

//Update User
const updateUser = async (id, data, imgChanged, proccess) => {
  try {
    if (proccess !== "archive") {
      console.log("esta es la data que recibo ", data);
      imgChanged ? await deleteImage(imgChanged) : null;
      if (
        data.avatar !== null &&
        typeof data.avatar !== "string" &&
        "name" in data.avatar
      ) {
        data.avatar = await uploadImage(data.avatar)
          .then((downloadURL) => {
            return downloadURL;
          })
          .catch((error) => {
            console.error("Upload failed:", error);
          });
      }
      console.log(data);

      if (data.avatar == null) {
        data.avatar = [];
      }
    }

    const docRef = await setDoc(
      doc(db, "users", id),
      { ...data, modifiedAt: Timestamp.fromDate(new Date()) },
      { merge: true }
    );
    console.log("update user", docRef);
    return { status: 200, customer: data };
  } catch (e) {
    console.error("Error update document: ", e);
    return { status: 400, error: e.message, customer: null };
  }
};

//delete User
const deleteUser = async (id, imgDelete, token) => {
  try {
    console.log("imgDelete", imgDelete);
    imgDelete ? await deleteImage(imgDelete) : null;

    const resp = await axios
      .delete(
        `https://us-central1-smartstore-90c07.cloudfunctions.net/app/api/v1/customers/${id}`,
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
          throw new Error(error.response.data);
        }
        throw new Error(error.response.data.body.msg);
      });

    if (resp.error) {
      return resp.body.msg;
    }
    return resp.body;
  } catch (error) {
    console.log("Error: ", error);
    return error.message;
  }
};

// Define una función async para subir la imagen y obtener la URL de descarga
const uploadImage = async (file) => {
  const storage = getStorage();
  const storageRef = ref(storage, "usersIMG/" + new Date().getTime());
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        console.error("Error uploading image:", error);
        reject(error);
      },
      async () => {
        console.log("Image uploaded successfully!");
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("File available at", downloadURL);
          resolve(downloadURL);
        } catch (error) {
          console.error("Error getting download URL:", error);
          reject(error);
        }
      }
    );
  });
};

const deleteImage = async (img) => {
  try {
    const storage = getStorage();
    console.log("se debe de borrar ", img);
    const regex = /\/o\/(.*?)\?/;
    const match = img.match(regex);
    if (match) {
      const desertRef = ref(
        storage,
        match[1].replace(/%2F/g, "/").replace(/%20/g, " ")
      );
      console.log("ref", desertRef);
      return await deleteObject(desertRef)
        .then(() => {
          console.log("se elimino");
          return 200;
        })
        .catch((error) => {
          throw new Error(error);
        });
    }
  } catch (error) {
    console.log(error);
    return error;
  }
};

export { createUser, updateUser, deleteUser, deleteImage, uploadImage };
