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
      state: 0,
    },
    {
      classNo: 2,
      classId: 1,
      className: "",
      state: 0,
    },
    {
      classNo: 3,
      classId: 2,
      className: "",
      state: 0,
    },
    {
      classNo: 4,
      classId: 3,
      className: "",
      state: 0,
    },
    {
      classNo: 5,
      classId: 4,
      className: "",
      state: 0,
    },
    {
      classNo: 6,
      classId: 5,
      className: "",
      state: 0,
    },
    {
      classNo: 7,
      classId: 6,
      className: "",
      state: 0,
    },
    {
      classNo: 8,
      classId: 7,
      className: "",
      state: 0,
    },
    {
      classNo: 9,
      classId: 8,
      className: "",
      state: 0,
    },
    {
      classNo: 10,
      classId: 9,
      className: "",
      state: 0,
    },
    {
      classNo: 11,
      classId: 10,
      className: "",
      state: 0,
    },
    {
      classNo: 12,
      classId: 11,
      className: "",
      state: 0,
    },
    {
      classNo: 13,
      classId: 12,
      className: "",
      state: 0,
    },
    {
      classNo: 14,
      classId: 13,
      className: "",
      state: 0,
    },
    {
      classNo: 15,
      classId: 14,
      className: "",
      state: 0,
    },
    {
      classNo: 16,
      classId: 15,
      className: "",
      state: 0,
    },
    {
      classNo: 17,
      classId: 16,
      className: "",
      state: 0,
    },
    {
      classNo: 18,
      classId: 17,
      className: "",
      state: 0,
    },
    {
      classNo: 19,
      classId: 18,
      className: "",
      state: 0,
    },
  ];
  const Student = [
    {
      studentName: "Black Boda",
      studentId: "6BD9B702",
      studentMAC: "fdfbca26eda8",
      studentState: 1,
    },
    {
      studentName: "Yaseen Bono",
      studentId: "F6468E02",
      studentMAC: "fdfbca26eda8",
      studentState: 0,
    },
    {
      studentName: "Smsm Smamsm",
      studentId: "9684B702",
      studentMAC: "fdfbca26eda8",
      studentState: 1,
    },
  ];
  const Batches = [
    {
      batchName: "batch 58",
      batchId: "58",
    },
    {
      batchName: "batch 59",
      batchId: "59",
    },
  ];
  const [courses, setCourses] = useState(Courses);
  const [showModal, setShowModal] = useState(false);
  const [classes, setClasses] = useState(Classes);
  const [courseId, setCourseId] = useState(-1);
  const [showClassModal, setShowClassModal] = useState(false);
  const [students, setStudents] = useState(Student);
  const [batches, setBatches] = useState(Batches);
  const [showBatchModal, setShowBatchModal] = useState(false);

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
        students,
        setStudents,
        batches,
        setBatches,
        showBatchModal,
        setShowBatchModal,
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
