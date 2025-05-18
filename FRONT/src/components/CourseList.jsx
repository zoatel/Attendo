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
        // <div
        //   key={course.id}
        //   className="w-56 h-56 bg-white border-2 border-gray-200 rounded-2xl flex flex-col items-center justify-center shadow cursor-pointer hover:bg-indigo-50 hover:border-indigo-300 transition-3d"
        //   onClick={() => setActiveCourse(course)}
        // >
        //   {course.image && (
        //     <img
        //       src={course.image}
        //       alt={course.title}
        //       className="w-28 h-28 object-cover rounded-full mb-2"
        //     />
        //   )}
        //   <div className="font-bold text-center text-xl capitalize text-gray-700">
        //     {course.title}
        //   </div>
        //   <div className="text-sm text-gray-500">
        //     Batch: {batchObj ? batchObj.title : course.batch}
        //   </div>
        //   <div className="text-sm text-gray-500">
        //     Classroom: {classroomObj ? classroomObj.hallName : course.classroom}
        //   </div>
        // </div>
        <div
          key={course.id}
          className="relative group w-56 h-56 bg-white border-2 border-gray-200 rounded-2xl shadow cursor-pointer transition-3d overflow-hidden hover:border-indigo-500"
          onClick={() => setActiveCourse(course)}
        >
          {/* الصورة اللي هتكبر وتاخد الخلفية */}
          {course.image && (
            <img
              src={course.image}
              alt={course.title}
              className="absolute top-18 left-1/2 -translate-x-1/2 -translate-y-1/2 my-auto w-28 h-28 object-cover rounded-full-boda transition-3d z-0
                 group-hover:w-full group-hover:h-full group-hover:rounded-none group-hover:scale-110 group-hover:top-1/2 will-transform"
            />
          )}

          {/* overlay خفيف عند الهوفر */}
          <div className="absolute inset-0 bg-indigo-500 opacity-0 group-hover:opacity-40 transition-3d z-10" />

          {/* المحتوى فوق الصورة */}
          <div className="relative z-20 flex flex-col items-center justify-center h-full px-2 text-center mt-15">
            <div className="font-bold text-xl capitalize text-gray-700 group-hover:text-white  transition-3d">
              {course.title}
            </div>
            <div className="text-sm text-gray-500 group-hover:text-gray-200 transition-3d  ">
              Batch: {batchObj ? batchObj.title : course.batch}
            </div>
            <div className="text-sm text-gray-500 group-hover:text-gray-200 transition-3d ">
              Classroom:{" "}
              {classroomObj ? classroomObj.hallName : course.classroom}
            </div>
          </div>
        </div>
      );
    })}
    {/* Add Course Card */}
    <div
      className="w-56 h-56 flex items-center text-center p-0 justify-center border-2 border-gray-200 bg-gray-100 rounded-2xl cursor-pointer text-9xl text-white hover:bg-indigo-200 hover:border-indigo-400 transition-3d"
      onClick={() => setShowModal(true)}
    >
      <span className="relative top-[-17px]">+</span>
    </div>
  </div>
);

export default CourseList;
