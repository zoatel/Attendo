import React from "react";
import BG from "../components/BG";
import Input from "../components/Input";
import Logo from "../components/Logo";
import SignBtn from "../components/SignBtn";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useUser } from "../App";

const Login = () => {
  const navigate = useNavigate();
  const user = useUser();

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div className="w-full h-screen flex flex-col p-4 sm:p-16 py-24 sm:py-44 items-center relative bg-[#f5f6fb]">
      <BG />
      <div className="w-full max-w-sm z-10">
        <Logo />
        <h2 className="text-center text-xl text-gray-400 mt-4">
          Teach better. Track smarter.
        </h2>
        <form
          className="mt-12 space-y-6"
          onSubmit={handleLogin}
          autoComplete="off"
        >
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
            autocomplete="current-password"
            placeholder="Password"
            type="password"
          />
          <SignBtn title="Sign In" />
        </form>
        <div>
          <div className="border border-neutral-200 mt-8" />
          <div className="text-center mt-4 text-gray-600">
            Don't have an account?
            <span
              className="ml-1 text-gray-500 hover:text-gray-800 cursor-pointer transition-3d"
              onClick={() => navigate("/registration")}
            >
              Sign Up
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
