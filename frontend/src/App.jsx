import React from "react";
import { useState, useEffect } from "react";
import Login from "./components/Login";
import Chat from "./components/Chat";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebase";
import { fetchProfile } from "./services/api";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, async (user) => {
  //     if (user) {
  //       try {
  //         const token = await user.getIdToken();
  //         //const profile = await fetchProfile(token);
  //         //console.log("profile",profile)
  //         //setUser({ ...user, profile});
  //         setUser(user);
  //       } catch (error) {
  //         console.error("Error fetching profile:", error);
  //         setUser(user);
  //       }
  //     } else {
  //       setUser(null);
  //     }
  //     setLoading(false);
  //   });

  //   return () => unsubscribe();
  // }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid min-vh-100">
      {user ? <Chat user={user} /> : <Login />}
    </div>
  );
}

export default App;
