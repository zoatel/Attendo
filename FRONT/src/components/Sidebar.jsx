import React from "react";
import Top from "./Top";
import { ChevronDown, ChevronUp } from "lucide-react";

const Sidebar = ({
  user,
  onShowCourses,
  onShowBatches,
  showBatches,
  courses,
  activeCourse,
  setActiveCourse,
  setActiveSession,
  batches,
  activeBatch,
  setActiveBatch,
  handleLogout,
  toggleShowBatches,
  toggleShowCourses,
}) => (
  <div className="w-72 bg-white  shadow flex flex-col justify-between  min-h-full">
    <div>
      <Top />
      <div className="mt-8">
        <div
          className={`flex transition-1d justify-between items-center font-semibold text-xl  cursor-pointer px-8 py-2  hover:bg-gray-100 ${
            !showBatches ? "text-indigo-600" : ""
          }`}
          onClick={onShowCourses}
        >
          Courses
          {!showBatches && toggleShowCourses ? (
            <ChevronUp size={20} />
          ) : (
            <ChevronDown size={20} />
          )}
        </div>
        {!showBatches && toggleShowCourses && (
          <ul className="mb-4">
            {courses.map((course) => (
              <li
                key={course.id}
                className={` py-2 px-12 transition-1d hover:bg-gray-100 rounded cursor-pointer ${
                  activeCourse && activeCourse.id === course.id
                    ? "bg-gray-100 font-bold text-indigo-600"
                    : ""
                }`}
                onClick={() => {
                  setActiveCourse(course);
                  setActiveSession(null);
                }}
              >
                {course.title}
              </li>
            ))}
          </ul>
        )}
        <div
          className={`flex px-8 transition-1d justify-between items-center  font-semibold text-xl  cursor-pointer  py-2 hover:bg-gray-100 ${
            showBatches ? "text-indigo-600" : ""
          }`}
          onClick={onShowBatches}
        >
          Batches
          {showBatches && toggleShowBatches ? (
            <ChevronUp size={20} />
          ) : (
            <ChevronDown size={20} />
          )}
        </div>
        {showBatches && toggleShowBatches && (
          <ul className="mb-4">
            {batches.map((batch) => (
              <li
                key={batch.id}
                className={` py-2 px-12 transition-1d hover:bg-gray-100 rounded cursor-pointer ${
                  activeBatch && activeBatch.id === batch.id
                    ? "bg-gray-100 font-bold text-indigo-600"
                    : ""
                }`}
                onClick={() => setActiveBatch(batch)}
              >
                {batch.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
    <div className=" px-8 py-16 w-full h-fit flex justify-center items-center">
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-10 py-3 font-semibold transition-3d rounded-lg mt-8 hover:bg-red-600"
      >
        Sign Out
      </button>
    </div>
  </div>
);

export default Sidebar;
