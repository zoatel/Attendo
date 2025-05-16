"use client";

import BG from "@/components/bg";
import Input from "@/components/Input";
import Logo from "@/components/Logo";
import SignBtn from "@/components/SignBtn";
import { useRouter } from "next/navigation";

export default function Registration() {
  const router = useRouter();

  // Handlers
  const goToRouterHandler = (path) => {
    router.push(path);
  };
  return (
    <>
      <div className="#BG w-full h-screen flex flex-col p-16 py-44 items-center relative">
        <BG />
        <div className="w-full max-w-sm">
          <Logo />
          <h2 className=" text-center text-xl text-gray-400 mt-4">
            Teach better. Track smarter.
          </h2>
          <form className="mt-12 space-y-6" action="#" method="POST">
            <div className="rounded-md shadow-sm -space-y-px"></div>
            <Input
              htmlfor="email-address"
              title="Email address"
              id="email"
              autocomplete="email"
              placeholder="Email address"
            />
            <Input
              htmlfor="password"
              title="Password"
              id="password"
              autocomplete="current-password"
              placeholder="Password"
            />
            <SignBtn title="sign up" />
          </form>
          <div>
            <div className="border border-neutral-200 mt-8 "></div>
            <div className="text-center mt-4  text-gray-600">
              Already have an account?
              <span
                className="ml-1 text-gray-500 hover:text-gray-800 cursor-pointer transition-3d"
                onClick={() => goToRouterHandler("/")}
              >
                Sign In
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
