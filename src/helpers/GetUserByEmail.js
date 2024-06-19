import {
  getFirestore,
  collection,
  getDocs,
  where,
  query,
} from "firebase/firestore";

const getAdmins = async (email) => {
  try {
    const admins = [];
    const db = getFirestore();
    const q = query(collection(db, "users"), where("email", "==", email));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      admins.push(doc.data());
    });
    return admins;
  } catch (e) {
    console.error("Error getting document: ", e);
    return e;
  }
};

export default getAdmins;
