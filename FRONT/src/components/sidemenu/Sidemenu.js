import Batches from "./Batches";
import Courses from "./Courses";
import SignoutBtn from "./SignoutBtn";

export default function SideMenu({}) {
  return (
    <>
      <div className="#SIDEMENU h-full w-1/5 bg-white flex flex-col justify-start items-center gap-y-6 ">
        <img src="/top2.png" alt="" className="w-full aspect-auto " />
        <div className="w-full flex-grow">
          <Courses />
          <Batches />
        </div>
        <SignoutBtn />
      </div>
    </>
  );
}
