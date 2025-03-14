import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { auth, database } from '@/firebaseConfig';

const roles = {
  ADMIN: 'admin',
  NGO: 'ngo',
  USER: 'user',
};
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'admin', 'ngo', or 'user'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        // Fetch user data from Realtime Database to determine role
        const userRef = ref(database, `users/${user.uid}`);
        const userSnapshot = await get(userRef);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.val();
          setRole(userData.role);
        } else {
          // Check if the user is an NGO
          const ngoRef = ref(database, `ngos/${user.uid}`);
          const ngoSnapshot = await get(ngoRef);
          if (ngoSnapshot.exists()) {
            const ngoData = ngoSnapshot.val();
            setRole(ngoData.role);
          } else {
            setRole(null);
          }
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, role, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => useContext(UserContext);
