import React, { useState } from "react";
import BG from "../components/BG";
import Input from "../components/Input";
import Logo from "../components/Logo";
import SignBtn from "../components/SignBtn";
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

  const handleRegister = async (e) => {
    e.preventDefault();
    const fullName = e.target.fullName.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (!fullName) {
      alert("Please enter your full name.");
      return;
    }
    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      alert("Password should be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
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
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col p-4 sm:p-16 py-24 sm:py-44 items-center relative bg-[#f5f6fb]">
      <BG />
      <div className="w-full max-w-sm z-10">
        <Logo />
        <h2 className="text-center text-xl text-gray-400 mt-4">
          Create your account
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
          />
          <Input
            htmlfor="email-address"
            title="Email address"
            id="email"
            autocomplete="email"
            placeholder="Email address"
            type="email"
          />
          <Input
            htmlfor="password"
            title="Password"
            id="password"
            autocomplete="new-password"
            placeholder="Password"
            type="password"
          />
          <Input
            htmlfor="confirm-password"
            title="Confirm Password"
            id="confirmPassword"
            autocomplete="new-password"
            placeholder="Confirm Password"
            type="password"
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
    </div>
  );
};

export default Registration;
