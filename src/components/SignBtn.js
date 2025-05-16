"use client";
import { useRouter } from "next/navigation";

export default function SignBtn({ title }) {
  const router = useRouter();

  // Handlers
  const goToRouterHandler = (path) => {
    router.push(path);
  };

  function signHandler() {
    if (title == "sign up") {
      goToRouterHandler("/");
    } else {
      goToRouterHandler("/home");
    }
  }
  return (
    <>
      <div className=" mt-8">
        <button
          type="submit"
          className="cursor-pointer group relative w-full flex justify-center py-3 px-12  text-md capitalize font-medium rounded-xl text-white bg-clr hover:bg-indigo-700 focus:outline-none transition-3d"
          onClick={signHandler}
        >
          {title}
        </button>
      </div>
    </>
  );
}
