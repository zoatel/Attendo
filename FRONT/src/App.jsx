import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Home from "./pages/Home";
import React, { useEffect, useState, createContext, useContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, getCurrentUserId } from "./firebase";

// User context to provide userId across the app
export const UserContext = createContext(null);
export const useUser = () => useContext(UserContext);

function App() {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
        });
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Redirect logic
  useEffect(() => {
    if (user) {
      if (location.pathname === "/" || location.pathname === "/registration") {
        navigate("/home", { replace: true });
      }
    } else {
      if (location.pathname === "/home") {
        navigate("/", { replace: true });
      }
    }
    // eslint-disable-next-line
  }, [user, location.pathname]);

  return (
    <UserContext.Provider value={user}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/registration" element={<Registration />} />
      </Routes>
    </UserContext.Provider>
  );
}

export default App;
