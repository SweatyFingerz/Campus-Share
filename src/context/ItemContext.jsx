import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { useAuthContext } from "./AuthContext";
import {
  getDocuments,
  addDocument,
  updateDocument,
  deleteDocument,
} from "../services/db";

const ItemContext = createContext(null);

export function ItemProvider({ children }) {
  const { user } = useAuthContext();

  const [libraryItems, setLibraryItems] = useState([]);
  const [itemRequests, setItemRequests] = useState([]);
  const [lostFoundPosts, setLostFoundPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ─── Fetch all library items ───
  const fetchLibraryItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await getDocuments("library_items");
      setLibraryItems(items);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Fetch all item requests ───
  const fetchItemRequests = useCallback(async () => {
    try {
      const requests = await getDocuments("item_requests");
      setItemRequests(requests);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  // ─── Fetch all lost & found posts ───
  const fetchLostFoundPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const posts = await getDocuments("lost_found");
      setLostFoundPosts(posts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Library CRUD ───
  const addLibraryItem = useCallback(async (itemData) => {
    const id = await addDocument("library_items", {
      ...itemData,
      ownerId: user.uid,
      ownerName: user.displayName,
      ownerEmail: user.email,
      status: "available",
      currentBorrowerId: null,
      currentBorrowerName: null,
    });
    await fetchLibraryItems();
    return id;
  }, [user, fetchLibraryItems]);

  const updateLibraryItem = useCallback(async (id, data) => {
    await updateDocument("library_items", id, data);
    await fetchLibraryItems();
  }, [fetchLibraryItems]);

  const deleteLibraryItem = useCallback(async (id) => {
    await deleteDocument("library_items", id);
    await fetchLibraryItems();
  }, [fetchLibraryItems]);

  // ─── Item Requests ───
  const createItemRequest = useCallback(async (itemId, itemName, ownerId) => {
    await addDocument("item_requests", {
      itemId,
      itemName,
      ownerId,
      requesterId: user.uid,
      requesterName: user.displayName,
      status: "pending",
    });
    await fetchItemRequests();
  }, [user, fetchItemRequests]);

  const handleRequest = useCallback(async (requestId, status, itemId, requesterId, requesterName) => {
    await updateDocument("item_requests", requestId, { status });
    if (status === "approved") {
      await updateDocument("library_items", itemId, {
        status: "borrowed",
        currentBorrowerId: requesterId,
        currentBorrowerName: requesterName,
      });
      await fetchLibraryItems();
    }
    await fetchItemRequests();
  }, [fetchLibraryItems, fetchItemRequests]);

  // ─── Return Item ───
  const returnItem = useCallback(async (itemId) => {
    await updateDocument("library_items", itemId, {
      status: "available",
      currentBorrowerId: null,
      currentBorrowerName: null,
    });
    await fetchLibraryItems();
  }, [fetchLibraryItems]);

  // ─── Lost & Found CRUD ───
  const addLostFoundPost = useCallback(async (postData) => {
    const id = await addDocument("lost_found", {
      ...postData,
      userId: user.uid,
      userName: user.displayName,
      userEmail: user.email,
      resolved: false,
    });
    await fetchLostFoundPosts();
    return id;
  }, [user, fetchLostFoundPosts]);

  const updateLostFoundPost = useCallback(async (id, data) => {
    await updateDocument("lost_found", id, data);
    await fetchLostFoundPosts();
  }, [fetchLostFoundPosts]);

  const deleteLostFoundPost = useCallback(async (id) => {
    await deleteDocument("lost_found", id);
    await fetchLostFoundPosts();
  }, [fetchLostFoundPosts]);

  // ─── Memoized filtered data for dashboard ───
  const myListings = useMemo(
    () => libraryItems.filter((item) => item.ownerId === user?.uid),
    [libraryItems, user]
  );

  const currentlyBorrowing = useMemo(
    () => libraryItems.filter((item) => item.currentBorrowerId === user?.uid),
    [libraryItems, user]
  );

  const pendingRequests = useMemo(
    () => itemRequests.filter((req) => req.ownerId === user?.uid && req.status === "pending"),
    [itemRequests, user]
  );

  const myLostFoundPosts = useMemo(
    () => lostFoundPosts.filter((post) => post.userId === user?.uid),
    [lostFoundPosts, user]
  );

  const value = {
    libraryItems,
    itemRequests,
    lostFoundPosts,
    loading,
    error,
    fetchLibraryItems,
    fetchItemRequests,
    fetchLostFoundPosts,
    addLibraryItem,
    updateLibraryItem,
    deleteLibraryItem,
    createItemRequest,
    handleRequest,
    returnItem,
    addLostFoundPost,
    updateLostFoundPost,
    deleteLostFoundPost,
    myListings,
    currentlyBorrowing,
    pendingRequests,
    myLostFoundPosts,
  };

  return (
    <ItemContext.Provider value={value}>
      {children}
    </ItemContext.Provider>
  );
}

export function useItemContext() {
  const context = useContext(ItemContext);
  if (!context) {
    throw new Error("useItemContext must be used within an ItemProvider");
  }
  return context;
}

export default ItemContext;
