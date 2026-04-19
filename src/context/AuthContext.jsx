import { createContext, useContext, useState, useEffect } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../services/firebaseConfig";
import { getDocument } from "../services/db";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch extended user profile from Firestore
        let profile = null;
        try {
          profile = await getDocument("users", firebaseUser.uid);
        } catch (e) {
          // Profile may not exist yet for new users
        }
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || profile?.displayName || "Student",
          ...profile,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const register = async (email, password, displayName) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName });
    // Create user document in Firestore
    await setDoc(doc(db, "users", cred.user.uid), {
      uid: cred.user.uid,
      email,
      displayName,
      createdAt: new Date(),
    });
    return cred.user;
  };

  const login = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value = { user, loading, register, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
