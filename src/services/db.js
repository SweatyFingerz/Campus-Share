import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

/**
 * Add a document to a collection
 */
export const addDocument = async (collectionName, data) => {
  const docRef = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

/**
 * Get a single document by ID
 */
export const getDocument = async (collectionName, docId) => {
  const docSnap = await getDoc(doc(db, collectionName, docId));
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
};

/**
 * Get all documents from a collection with optional filters
 */
export const getDocuments = async (collectionName, filters = [], sortField = "createdAt") => {
  const constraints = filters.map((f) => where(f.field, f.operator, f.value));
  const q = query(collection(db, collectionName), ...constraints, orderBy(sortField, "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

/**
 * Update a document
 */
export const updateDocument = async (collectionName, docId, data) => {
  const docRef = doc(db, collectionName, docId);
  await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
};

/**
 * Delete a document
 */
export const deleteDocument = async (collectionName, docId) => {
  await deleteDoc(doc(db, collectionName, docId));
};
