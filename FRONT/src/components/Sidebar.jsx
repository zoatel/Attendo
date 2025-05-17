import React from "react";
import Logo from "./Logo";

const Sidebar = ({
  user,
  onShowCourses,
  onShowBatches,
  showBatches,
  courses,
  activeCourse,
  setActiveCourse,
  handleLogout,
}) => (
  <div className="w-64 bg-white rounded-l-2xl shadow flex flex-col justify-between py-6 px-4 min-h-full">
    <div>
      <Logo />
      <div className="mt-8">
        <div
          className={`font-semibold text-lg mb-2 cursor-pointer ${
            !showBatches ? "text-indigo-600" : ""
          }`}
          onClick={onShowCourses}
        >
          Courses
        </div>
        {!showBatches && (
          <ul className="mb-4">
            {courses.map((course) => (
              <li
                key={course.id}
                className={`py-1 px-2 hover:bg-gray-100 rounded cursor-pointer ${
                  activeCourse && activeCourse.id === course.id
                    ? "bg-gray-100 font-bold text-indigo-600"
                    : ""
                }`}
                onClick={() => setActiveCourse(course)}
              >
                {course.title}
              </li>
            ))}
          </ul>
        )}
        <div
          className={`font-semibold text-lg mb-2 cursor-pointer ${
            showBatches ? "text-indigo-600" : ""
          }`}
          onClick={onShowBatches}
        >
          Batches
        </div>
      </div>
    </div>
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-6 py-2 rounded mt-8 hover:bg-red-600"
    >
      Sign Out
    </button>
  </div>
);

export default Sidebar;
