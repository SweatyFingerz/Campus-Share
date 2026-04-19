import { useState, useEffect, useCallback } from "react";
import { getDocuments, addDocument, updateDocument, deleteDocument } from "../services/db";

/**
 * Custom hook for Firestore CRUD operations on any collection.
 * Provides loading/error state management and automatic data refresh.
 *
 * @param {string} collectionName - The Firestore collection to operate on
 * @param {Array} filters - Optional array of filter objects: { field, operator, value }
 */
export function useFirestore(collectionName, filters = []) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await getDocuments(collectionName, filters);
      setData(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [collectionName, JSON.stringify(filters)]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const add = useCallback(async (docData) => {
    setError(null);
    try {
      const id = await addDocument(collectionName, docData);
      await fetchData();
      return id;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [collectionName, fetchData]);

  const update = useCallback(async (docId, docData) => {
    setError(null);
    try {
      await updateDocument(collectionName, docId, docData);
      await fetchData();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [collectionName, fetchData]);

  const remove = useCallback(async (docId) => {
    setError(null);
    try {
      await deleteDocument(collectionName, docId);
      await fetchData();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [collectionName, fetchData]);

  return { data, loading, error, fetchData, add, update, remove };
}
