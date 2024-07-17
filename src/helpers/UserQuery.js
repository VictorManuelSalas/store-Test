import {
  getFirestore,
  collection,
  getDocs,
  where,
  query,
  doc,
  getDoc,
} from "firebase/firestore";

const db = getFirestore();

const getUserByEmail = async (email) => {
  try {
    const users = [];
    const q = query(collection(db, "users"), where("email", "==", email));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      users.push(doc.data());
    });
    return users;
  } catch (e) {
    console.error("Error getting document: ", e);
    return e;
  }
};

const getUserByID = async (id) => {
  try {
    const docRef = doc(db, "users", id);
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      return docSnapshot.data();
    } else {
      return null;  
    }
  } catch (e) {
    console.error("Error getting document:", e);
    return e;  
  }
};

const getAdmins = async () => {
  try {
    const admins = [];
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

//Get all users
const getAllCustomers = async () => {
  try {
    const customers = [];

    const querySnapshot = await getDocs(collection(db, "users"));

    querySnapshot.forEach((doc) => {
      customers.push({ id: doc.id, ...doc.data() });
    });
    return customers;
  } catch (e) {
    console.error("Error adding document: ", e);
    return e;
  }
};

export { getUserByEmail, getAdmins, getAllCustomers, getUserByID };
