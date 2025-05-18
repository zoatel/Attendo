import React, { useState, useEffect } from "react";
import BG from "../components/BG";
import Input from "../components/Input";
import Logo from "../components/Logo";
import SignBtn from "../components/SignBtn";
import Alert from "../components/Alert";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";

const validateEmail = (email) => {
  // Simple email regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const Registration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [errorField, setErrorField] = useState({
    fullname: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    const fullName = e.target.fullName.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (!fullName) {
      setAlert({ type: "error", message: "Please enter your full name." });
      setErrorField({
        fullname: true,
        email: false,
        password: false,
        confirmPassword: false,
      });
      return;
    }
    if (!validateEmail(email)) {
      setAlert({
        type: "error",
        message: "Please enter a valid email address.",
      });
      setErrorField({
        fullname: false,
        email: true,
        password: false,
        confirmPassword: false,
      });
      return;
    }
    if (password.length < 6) {
      setAlert({
        type: "error",
        message: "Password should be at least 6 characters.",
      });
      setErrorField({
        fullname: false,
        email: false,
        password: true,
        confirmPassword: false,
      });
      return;
    }
    if (password !== confirmPassword) {
      setAlert({ type: "error", message: "Passwords do not match." });
      setErrorField({
        fullname: false,
        email: false,
        password: false,
        confirmPassword: true,
      });
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, { displayName: fullName });
      navigate("/home");
    } catch (error) {
      setAlert({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    // لو في error على الحقل ده، رجّعه false
    if (errorField[field]) {
      setErrorField((prev) => ({ ...prev, [field]: false }));
    }
  };

  useEffect(() => {
    console.log(alert);
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);
  return (
    <div className="overflow-clip w-full h-screen flex flex-col justify-center p-4 sm:p-16 py-24 sm:py-44 items-center relative bg-[#f5f6fb]">
      <BG page={"registartion"} />
      <div className="w-full max-w-sm z-10">
        <Logo />
        <h2 className="text-center text-xl text-gray-400 mt-4">
          Monitor your class now
        </h2>
        <form
          className="mt-12 space-y-6"
          onSubmit={handleRegister}
          autoComplete="off"
        >
          <Input
            htmlfor="full-name"
            title="Full Name"
            id="fullName"
            autocomplete="name"
            placeholder="Full Name"
            type="text"
            error={errorField.fullname}
            onChange={handleInputChange}
          />
          <Input
            htmlfor="email-address"
            title="Email address"
            id="email"
            autocomplete="email"
            placeholder="Email address"
            type="email"
            error={errorField.email}
            onChange={handleInputChange}
          />
          <Input
            htmlfor="password"
            title="Password"
            id="password"
            autocomplete="new-password"
            placeholder="Password"
            type="password"
            error={errorField.password}
            onChange={handleInputChange}
          />
          <Input
            htmlfor="confirm-password"
            title="Confirm Password"
            id="confirmPassword"
            autocomplete="new-password"
            placeholder="Confirm Password"
            type="password"
            error={errorField.confirmPassword}
            onChange={handleInputChange}
          />
          <SignBtn title={loading ? "Registering..." : "Sign Up"} />
        </form>
        <div>
          <div className="border border-neutral-200 mt-8" />
          <div className="text-center mt-4 text-gray-600">
            Already have an account?
            <span
              className="ml-1 text-gray-500 hover:text-gray-800 cursor-pointer transition-3d"
              onClick={() => navigate("/")}
            >
              Sign In
            </span>
          </div>
        </div>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} />}
    </div>
  );
};

export default Registration;
