"use client";
import { createContext, useContext, useState, useEffect } from "react";

const Context = createContext(undefined);

export function Provider({ children }) {
  const Courses = [
    {
      courseImg: "/cn.jpg",
      courseName: "Computer Network",
      studentsNo: 25,
      courseId: 0,
      courseBatchId: 1,
      courseClassroom: "5",
    },
    {
      courseImg: "/ds.jpg",
      courseName: "Data Structures",
      studentsNo: 15,
      courseId: 1,
      courseBatchId: 2,
      courseClassroom: "2",
    },
    {
      courseImg: "/Embedded-System.jpg",
      courseName: "Embedded Systems",
      studentsNo: 35,
      courseId: 2,
      courseBatchId: 3,
      courseClassroom: "1",
    },
    {
      courseImg: "/Embedded-System.jpg",
      courseName: "Embedded Systems",
      studentsNo: 35,
      courseId: 3,
      courseBatchId: 4,
      courseClassroom: "3",
    },
    {
      courseImg: "/Embedded-System.jpg",
      courseName: "Embedded Systems",
      studentsNo: 35,
      courseId: 4,
      courseBatchId: 5,
      courseClassroom: "505",
    },
  ];
  const Classes = [
    {
      classNo: 1,
      classId: 0,
      className: "",
    },
    {
      classNo: 2,
      classId: 1,
      className: "",
    },
    {
      classNo: 3,
      classId: 2,
      className: "",
    },
    {
      classNo: 4,
      classId: 3,
      className: "",
    },
    {
      classNo: 5,
      classId: 4,
      className: "",
    },
    {
      classNo: 6,
      classId: 5,
      className: "",
    },
    {
      classNo: 7,
      classId: 6,
      className: "",
    },
    {
      classNo: 8,
      classId: 7,
      className: "",
    },
    {
      classNo: 9,
      classId: 8,
      className: "",
    },
    {
      classNo: 10,
      classId: 9,
      className: "",
    },
    {
      classNo: 11,
      classId: 10,
      className: "",
    },
    {
      classNo: 12,
      classId: 11,
      className: "",
    },
    {
      classNo: 13,
      classId: 12,
      className: "",
    },
    {
      classNo: 14,
      classId: 13,
      className: "",
    },
    {
      classNo: 15,
      classId: 14,
      className: "",
    },
    {
      classNo: 16,
      classId: 15,
      className: "",
    },
    {
      classNo: 17,
      classId: 16,
      className: "",
    },
    {
      classNo: 18,
      classId: 17,
      className: "",
    },
    {
      classNo: 19,
      classId: 18,
      className: "",
    },
  ];
  const [courses, setCourses] = useState(Courses);
  const [showModal, setShowModal] = useState(false);
  const [classes, setClasses] = useState(Classes);
  const [courseId, setCourseId] = useState(-1);
  const [showClassModal, setShowClassModal] = useState(false);

  return (
    <Context.Provider
      value={{
        courses,
        setCourses,
        showModal,
        setShowModal,
        classes,
        setClasses,
        courseId,
        setCourseId,
        showClassModal,
        setShowClassModal,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export default function useContextCustomHook() {
  const context = useContext(Context);
  if (!context) {
    throw new Error(
      "useProfileImage must be used within a ProfileImageProvider"
    );
  }
  return context;
}
