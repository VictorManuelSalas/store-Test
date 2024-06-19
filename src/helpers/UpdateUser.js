import { getFirestore, doc, setDoc } from "firebase/firestore";

const updateUser = async (data) => {
  const db = getFirestore();
  try {
    const docRef = await setDoc(doc(db, "users", "LA"), data)
    console.log(docRef)
    return docRef;
  } catch (e) {
    console.error("Error update document: ", e);
    return e.message;
  }
};

export default updateUser;
