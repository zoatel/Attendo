import React from "react";

const CourseList = ({
  courses,
  allBatches,
  allClassrooms,
  setActiveCourse,
  setShowModal,
}) => (
  <div className="flex flex-wrap gap-8">
    {courses.map((course) => {
      const batchObj = allBatches.find((b) => b.id === course.batch);
      const classroomObj = allClassrooms.find((c) => c.id === course.classroom);
      return (
        <div
          key={course.id}
          className="w-48 h-32 bg-white border border-indigo-200 rounded-lg flex flex-col items-center justify-center shadow cursor-pointer hover:bg-indigo-50 transition"
          onClick={() => setActiveCourse(course)}
        >
          {course.image && (
            <img
              src={course.image}
              alt={course.title}
              className="w-12 h-12 object-cover rounded mb-2"
            />
          )}
          <div className="font-bold text-center text-lg">{course.title}</div>
          <div className="text-xs text-gray-500">
            Batch: {batchObj ? batchObj.title : course.batch}
          </div>
          <div className="text-xs text-gray-500">
            Classroom: {classroomObj ? classroomObj.hallName : course.classroom}
          </div>
        </div>
      );
    })}
    {/* Add Course Card */}
    <div
      className="w-48 h-32 flex items-center justify-center border-2 border-indigo-400 bg-indigo-100 rounded-lg cursor-pointer text-6xl text-indigo-400 hover:bg-indigo-200 transition"
      onClick={() => setShowModal(true)}
    >
      <span>+</span>
    </div>
  </div>
);

export default CourseList;
