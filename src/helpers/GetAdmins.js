import {
  getFirestore,
  collection,
  getDocs,
  where,
  query,
} from "firebase/firestore";

const getAdmins = async () => {
  try {
    const admins = [];
    const db = getFirestore();
    const q = query(collection(db, "users"), where("role", "==", "admin"));

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      admins.push(doc.data());
    });
    return admins;
  } catch (e) {
    console.error("Error adding document: ", e);
    return e;
  }
};

export default getAdmins;
