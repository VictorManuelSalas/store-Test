import {
  getFirestore,
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

const createUser = async (data) => {
  const db = getFirestore();
  try {
    console.log(data.avatar);
    console.log(typeof data.avatar);
    if ("name" in data.avatar) {
      data.avatar = await uploadImage(data.avatar)
        .then((downloadURL) => {
          return downloadURL;
        })
        .catch((error) => {
          console.error("Upload failed:", error);
        });
    }
    console.log(data);
    const docRef = await addDoc(collection(db, "users"), {
      ...data,
      createAt: Timestamp.fromDate(new Date()),
    });
    return { id: docRef.id, status: true };
  } catch (e) {
    console.error("Error adding document: ", e);
    return e.message;
  }
};

// Define una función async para subir la imagen y obtener la URL de descarga
const uploadImage = async (file) => {
  const storage = getStorage();
  const storageRef = ref(storage, "usersIMG/" + file.name);
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

export default createUser;
