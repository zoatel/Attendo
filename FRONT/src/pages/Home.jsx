import React, { useState, useEffect } from "react";
import BGHome from "../components/BGHome";
import { useUser } from "../App";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import Sidebar from "../components/Sidebar";
import CourseList from "../components/CourseList";
import BatchList from "../components/BatchList";
import StudentList from "../components/StudentList";
import SessionList from "../components/SessionList";
import SessionAttendees from "../components/SessionAttendees";
import AddCourseModal from "../components/AddCourseModal";
import AddBatchModal from "../components/AddBatchModal";
import AddSessionModal from "../components/AddSessionModal";
import Alert from "../components/Alert";

// API base URL constant
const API_BASE_URL = "http://localhost:3000";

const Home = () => {
  const [alert, setAlert] = useState(null);

  const user = useUser();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [activeCourse, setActiveCourse] = useState(null);
  const [toggleShowCourses, setToggleShowCourses] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [form, setForm] = useState({
    title: "",
    batch: "",
    classroom: "",
    image: "",
  });
  const [sessionForm, setSessionForm] = useState({ title: "" });
  const [loading, setLoading] = useState(false);

  // Batch management
  const [showBatches, setShowBatches] = useState(false);
  const [toggleShowBatches, setToggleShowBatches] = useState(false);
  const [batches, setBatches] = useState([]);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [batchForm, setBatchForm] = useState({ title: "" });

  // Student management
  const [activeBatch, setActiveBatch] = useState(null);
  const [students, setStudents] = useState([]);
  const [studentForm, setStudentForm] = useState({ name: "", UID: "" });
  const [studentLoading, setStudentLoading] = useState(false);

  // For course creation dropdowns
  const [allBatches, setAllBatches] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [allClassrooms, setAllClassrooms] = useState([]);

  const [sessionsRefresh, setSessionsRefresh] = useState(0);

  const [activeSessions, setActiveSessions] = useState([]);
  const [inactiveSessions, setInactiveSessions] = useState([]);

  const [activeSession, setActiveSession] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [attendeesLoading, setAttendeesLoading] = useState(false);

  const [downloadingAllSessions, setDownloadingAllSessions] = useState(false);

  // Function to convert attendees data to CSV (single session)
  const [downloadingSession, setDownloadingSession] = useState(false);
  const downloadCSV = () => {
    if (!attendees.length || downloadingSession) return;
    setDownloadingSession(true);
    try {
      // CSV Headers
      const headers = ["UID", "Name", "MAC", "Recorded At"];
      // Convert data to CSV rows
      const csvRows = [
        headers.join(","),
        ...attendees.map((att) =>
          [
            att.UID,
            `"${att.name.replace(/"/g, '""')}"`, // Escape quotes in name
            att.MAC,
            att.recordedAt,
          ].join(",")
        ),
      ];
      // Create CSV content
      const csvContent = csvRows.join("\n");
      // Add BOM for proper Arabic text handling
      const BOM = "\uFEFF";
      const csvContentWithBOM = BOM + csvContent;
      // Create and trigger download with UTF-8 encoding
      const blob = new Blob([csvContentWithBOM], {
        type: "text/csv;charset=utf-8",
      });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `attendance_${activeSession.title}_${
          new Date().toISOString().split("T")[0]
        }.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setDownloadingSession(false);
    }
  };

  // Fetch only courses in instructor/{uid}/courses
  useEffect(() => {
    const fetchInstructorCourses = async () => {
      if (!user?.uid) return;
      const instructorCoursesRef = collection(
        db,
        `instructor/${user.uid}/courses`
      );
      const instructorCoursesSnap = await getDocs(instructorCoursesRef);
      const courseIds = instructorCoursesSnap.docs.map((doc) => doc.id);
      const courseList = [];
      for (const courseId of courseIds) {
        const courseDoc = await getDoc(doc(db, "courses", courseId));
        if (courseDoc.exists()) {
          courseList.push({ id: courseDoc.id, ...courseDoc.data() });
        }
      }
      setCourses(courseList);
      // Do NOT auto-select the first course
      // if (courseList.length > 0 && !activeCourse) {
      //   setActiveCourse(courseList[0]);
      // }
    };
    fetchInstructorCourses();
    // eslint-disable-next-line
  }, [showModal, user]); // refetch after adding or user changes

  // Fetch sessions for the active course
  useEffect(() => {
    const fetchSessions = async () => {
      if (!activeCourse) {
        setSessions([]);
        setActiveSessions([]);
        setInactiveSessions([]);
        return;
      }
      const sessionsRef = collection(db, `courses/${activeCourse.id}/sessions`);
      const sessionsSnap = await getDocs(sessionsRef);
      const sessionList = [];
      sessionsSnap.forEach((doc) => {
        sessionList.push({ id: doc.id, ...doc.data() });
      });
      setSessions(sessionList);
      // Sort sessions by title
      const sortedActiveSessions = sessionList
        .filter((s) => s.active)
        .sort((a, b) => a.title.localeCompare(b.title));
      const sortedInactiveSessions = sessionList
        .filter((s) => !s.active)
        .sort((a, b) => a.title.localeCompare(b.title));
      setActiveSessions(sortedActiveSessions);
      setInactiveSessions(sortedInactiveSessions);
    };
    fetchSessions();
  }, [activeCourse, sessionsRefresh]);

  // Fetch batches
  useEffect(() => {
    if (!showBatches) return;
    const fetchBatches = async () => {
      const batchesRef = collection(db, "batches");
      const batchesSnap = await getDocs(batchesRef);
      const batchList = [];
      batchesSnap.forEach((doc) => {
        batchList.push({ id: doc.id, ...doc.data() });
      });
      setBatches(batchList);
    };
    fetchBatches();
    console.log(batches);
  }, [showBatches, showBatchModal]);

  // Fetch students for the active batch
  useEffect(() => {
    if (!activeBatch) return setStudents([]);
    const fetchStudents = async () => {
      const studentsRef = collection(db, `batches/${activeBatch.id}/students`);
      const studentsSnap = await getDocs(studentsRef);
      const studentList = [];
      studentsSnap.forEach((doc) => {
        studentList.push({ id: doc.id, ...doc.data() });
      });
      setStudents(studentList);
    };
    fetchStudents();
  }, [activeBatch, studentLoading]);

  // Fetch all batches for dropdown
  useEffect(() => {
    const fetchAllBatches = async () => {
      const batchesRef = collection(db, "batches");
      const batchesSnap = await getDocs(batchesRef);
      const batchList = [];
      batchesSnap.forEach((doc) => {
        batchList.push({ id: doc.id, ...doc.data() });
      });
      setAllBatches(batchList);
    };
    fetchAllBatches();
  }, [showModal]);

  // Fetch available classrooms for dropdown
  useEffect(() => {
    const fetchClassrooms = async () => {
      const classroomsRef = collection(db, "classrooms");
      const classroomsSnap = await getDocs(classroomsRef);
      const classroomList = [];
      const allList = [];
      classroomsSnap.forEach((doc) => {
        const data = doc.data();
        allList.push({ id: doc.id, ...data });
        if (data.available) {
          classroomList.push({ id: doc.id, ...data });
        }
      });
      setClassrooms(classroomList);
      setAllClassrooms(allList);
    };
    fetchClassrooms();
  }, [showModal]);

  // Fetch attendees for the active session (real-time)
  useEffect(() => {
    if (!activeSession || !activeCourse) {
      setAttendees([]);
      return;
    }
    setAttendeesLoading(true);
    const attendeesRef = collection(
      db,
      `courses/${activeCourse.id}/sessions/${activeSession.id}/attendees`
    );
    const unsubscribe = onSnapshot(attendeesRef, async (attendeesSnap) => {
      const attendeeList = [];
      for (const docSnap of attendeesSnap.docs) {
        const uid = docSnap.id;
        const attendeeData = docSnap.data();
        // Fetch student info from batch
        const studentDoc = await getDoc(
          doc(db, `batches/${activeCourse.batch}/students/${uid}`)
        );
        if (studentDoc.exists()) {
          const studentData = studentDoc.data();
          attendeeList.push({
            UID: uid,
            name: studentData.name,
            MAC: studentData.MAC,
            recordedAt: attendeeData.recordedAt
              ? formatDate(attendeeData.recordedAt)
              : "-",
          });
        } else {
          attendeeList.push({
            UID: uid,
            name: "-",
            MAC: "-",
            recordedAt: attendeeData.recordedAt
              ? formatDate(attendeeData.recordedAt)
              : "-",
          });
        }
      }
      setAttendees(attendeeList);
      setAttendeesLoading(false);
    });
    return () => unsubscribe();
  }, [activeSession, activeCourse]);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Add to courses collection
      const docRef = await addDoc(collection(db, "courses"), form);
      // Add to instructor/{uid}/courses/{courseId}
      await setDoc(doc(db, `instructor/${user.uid}/courses/${docRef.id}`), {
        ...form,
      });
      // Set classroom to unavailable
      if (form.classroom) {
        await updateDoc(doc(db, "classrooms", form.classroom), {
          available: false,
        });
      }
      setShowModal(false);
      setForm({ title: "", batch: "", classroom: "", image: "" });
    } catch (err) {
      setAlert({
        type: "error",
        message: "Error adding course: " + err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Session modal handlers (front-end only)
  const handleSessionInputChange = (e) => {
    setSessionForm({ ...sessionForm, [e.target.name]: e.target.value });
  };
  const handleAddSession = async (e) => {
    e.preventDefault();
    // Backend integration for creating a session
    if (!activeCourse) return;
    try {
      const payload = {
        batchID: activeCourse.batch,
        classroomID: activeCourse.classroom,
        courseID: activeCourse.id,
        sessionName: sessionForm.title,
      };
      const response = await fetch(`${API_BASE_URL}/createSession`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      setAlert({
        type: data.success ? "success" : "error",
        message:
          data.message ||
          (data.success
            ? "Session created successfully"
            : "Failed to create session"),
      });
      setShowSessionModal(false);
      setSessionForm({ title: "" });
      setSessionsRefresh((r) => r + 1);
    } catch (err) {
      setAlert({
        type: "error",
        message: "Error creating session: " + err.message,
      });
    }
  };

  // Batch modal handlers
  const handleBatchInputChange = (e) => {
    setBatchForm({ ...batchForm, [e.target.name]: e.target.value });
  };
  const handleAddBatch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "batches"), batchForm);
      setShowBatchModal(false);
      setBatchForm({ title: "" });
    } catch (err) {
      setAlert({
        type: "error",
        message: "Error adding batch: " + err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Sidebar navigation
  const handleShowCourses = () => {
    setShowBatches(false);
    setToggleShowCourses((toggleShowCourses) => !toggleShowCourses);
    setToggleShowBatches(false);
    setActiveCourse(null);
    setActiveBatch(null);
    setActiveSession(null);
  };
  const handleShowBatches = () => {
    setShowBatches(true);
    setToggleShowCourses(false);
    setToggleShowBatches((toggleShowBatches) => !toggleShowBatches);
    setActiveCourse(null);
    setActiveBatch(null);
  };

  // Add student to batch
  const handleStudentInputChange = (e) => {
    setStudentForm({ ...studentForm, [e.target.name]: e.target.value });
  };
  const handleAddStudent = async (e) => {
    e.preventDefault();
    setStudentLoading(true);
    try {
      // Check UID uniqueness across all batches
      const batchesRef = collection(db, "batches");
      const batchesSnap = await getDocs(batchesRef);
      let uidExists = false;
      for (const batchDoc of batchesSnap.docs) {
        const studentDocRef = doc(
          db,
          `batches/${batchDoc.id}/students/${studentForm.UID}`
        );
        const studentDocSnap = await getDoc(studentDocRef);
        if (studentDocSnap.exists()) {
          uidExists = true;
          break;
        }
      }
      if (uidExists) {
        setAlert({
          type: "warning",
          message: "A student with this UID already exists in another batch.",
        });
        setStudentLoading(false);
        return;
      }
      await setDoc(
        doc(db, `batches/${activeBatch.id}/students/${studentForm.UID}`),
        {
          name: studentForm.name,
          UID: studentForm.UID,
          MAC: "",
          verifiedState: false,
        }
      );
      setStudentForm({ name: "", UID: "" });
    } catch (err) {
      setAlert({
        type: "error",
        message: "Error adding student: " + err.message,
      });
    } finally {
      setStudentLoading(false);
    }
  };
  // Delete student
  const handleDeleteStudent = async (uid) => {
    setStudentLoading(true);
    try {
      await deleteDoc(doc(db, `batches/${activeBatch.id}/students/${uid}`));
    } catch (err) {
      setAlert({
        type: "error",
        message: "Error deleting student: " + err.message,
      });
    } finally {
      setStudentLoading(false);
    }
  };

  // End session handler
  const handleEndSession = async () => {
    if (!activeSession || !activeCourse) return;
    // Find nodeID from classroom
    const classroomObj = allClassrooms.find(
      (c) => c.id === activeCourse.classroom
    );
    const nodeID = classroomObj ? classroomObj.nodeID : null;
    if (!nodeID) {
      setAlert({
        type: "error",
        message: "Node ID not found for this classroom.",
      });
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/endSession`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nodeID, sessionId: activeSession.id }),
      });
      const data = await response.json();
      setAlert({
        type: data.success ? "success" : "error",
        message:
          data.message ||
          (data.success
            ? "Session ended successfully"
            : "Failed to end session"),
      });

      setSessionsRefresh((r) => r + 1); // Refresh sessions list
      // Fetch updated session document and update activeSession
      const updatedSessionDoc = await getDoc(
        doc(db, `courses/${activeCourse.id}/sessions/${activeSession.id}`)
      );
      if (updatedSessionDoc.exists()) {
        setActiveSession({
          id: updatedSessionDoc.id,
          ...updatedSessionDoc.data(),
        });
      }
    } catch (err) {
      setAlert({
        type: "error",
        message: "Error ending session: " + err.message,
      });
    }
  };

  // Helper to format Firestore date string or Firestore Timestamp
  const formatDate = (dateVal) => {
    if (!dateVal) return "-";

    // Firestore Timestamp object
    if (typeof dateVal === "object" && dateVal.seconds) {
      const date = new Date(dateVal.seconds * 1000);

      // Format date
      const dateStr = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      // Format time
      const timeStr = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });

      // Get timezone
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      return `${dateStr} at ${timeStr} (${timezone})`;
    }

    // Already a string
    return dateVal;
  };

  // Function to download all sessions attendance
  const downloadAllSessionsCSV = async () => {
    if (!sessions.length || downloadingAllSessions) return;
    setDownloadingAllSessions(true);
    try {
      // Get all sessions data with attendees
      const allSessionsData = [];
      for (const session of sessions) {
        const attendeesRef = collection(
          db,
          `courses/${activeCourse.id}/sessions/${session.id}/attendees`
        );
        const attendeesSnap = await getDocs(attendeesRef);
        const attendeeList = [];
        for (const docSnap of attendeesSnap.docs) {
          const uid = docSnap.id;
          const attendeeData = docSnap.data();
          // Fetch student info from batch
          const studentDoc = await getDoc(
            doc(db, `batches/${activeCourse.batch}/students/${uid}`)
          );
          if (studentDoc.exists()) {
            const studentData = studentDoc.data();
            attendeeList.push({
              UID: uid,
              name: studentData.name,
              MAC: studentData.MAC,
              recordedAt: attendeeData.recordedAt
                ? formatDate(attendeeData.recordedAt)
                : "-",
            });
          }
        }
        allSessionsData.push({
          sessionTitle: session.title,
          createdAt: formatDate(session.createdAt),
          endedAt: session.endedAt ? formatDate(session.endedAt) : "Active",
          attendees: attendeeList,
        });
      }
      // Sort sessions by title
      allSessionsData.sort((a, b) =>
        a.sessionTitle.localeCompare(b.sessionTitle)
      );
      // Create CSV content
      const headers = [
        "Session",
        "Created At",
        "Ended At",
        "UID",
        "Name",
        "MAC",
        "Recorded At",
      ];
      const csvRows = [headers.join(",")];
      // Add data rows
      allSessionsData.forEach((session) => {
        if (session.attendees.length === 0) {
          csvRows.push(
            [
              `"${session.sessionTitle}"`,
              `"${session.createdAt}"`,
              `"${session.endedAt}"`,
              "No attendees",
              "",
              "",
              "",
            ].join(",")
          );
        } else {
          session.attendees.forEach((att) => {
            csvRows.push(
              [
                `"${session.sessionTitle}"`,
                `"${session.createdAt}"`,
                `"${session.endedAt}"`,
                att.UID,
                `"${att.name.replace(/"/g, '""')}"`,
                att.MAC,
                `"${att.recordedAt}"`,
              ].join(",")
            );
          });
        }
      });
      // Add BOM for proper Arabic text handling
      const BOM = "\uFEFF";
      const csvContent = BOM + csvRows.join("\n");
      // Create and trigger download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `all_sessions_attendance_${activeCourse.title}_${
          new Date().toISOString().split("T")[0]
        }.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setDownloadingAllSessions(false);
    }
  };

  return (
    <div className="relative w-full h-screen flex  bg-[#f5f6fb]">
      {/* <BGHome /> */}

      {/* Sidebar */}
      <Sidebar
        user={user}
        onShowCourses={handleShowCourses}
        onShowBatches={handleShowBatches}
        showBatches={showBatches}
        toggleShowBatches={toggleShowBatches}
        toggleShowCourses={toggleShowCourses}
        courses={courses}
        activeCourse={activeCourse}
        setActiveCourse={setActiveCourse}
        batches={batches}
        activeBatch={activeBatch}
        setActiveBatch={setActiveBatch}
        handleLogout={handleLogout}
        setActiveSession={setActiveSession}
      />
      {/* Main Content */}
      <div className="flex-1 p-20 h-screen">
        {/* Batches View */}
        {showBatches ? (
          <>
            <div className="text-gray-400 text-lg font-medium mb-2">
              {activeBatch && (
                <>
                  <span
                    className="hover:underline cursor-pointer capitalize"
                    onClick={() => {
                      setActiveBatch(null);
                    }}
                  >
                    Batches
                  </span>{" "}
                  <span>&gt;&gt;</span>{" "}
                  <span className="hover:underline cursor-pointer capitalize">
                    {activeBatch.title}
                  </span>
                </>
              )}
            </div>
            <div className="text-4xl font-black mb-2 ">
              {activeBatch ? activeBatch.title : "Select a Batch"}
            </div>
            {activeBatch ? (
              <>
                <StudentList
                  students={students}
                  studentForm={studentForm}
                  handleStudentInputChange={handleStudentInputChange}
                  handleAddStudent={handleAddStudent}
                  studentLoading={studentLoading}
                  handleDeleteStudent={handleDeleteStudent}
                />
              </>
            ) : (
              <>
                <div className="text-gray-400 text-xl mb-12">
                  Please select a batch to view its Students.
                </div>
                <BatchList
                  batches={batches}
                  setActiveBatch={setActiveBatch}
                  setShowBatchModal={setShowBatchModal}
                  showBatchModal={showBatchModal}
                  batchForm={batchForm}
                  handleBatchInputChange={handleBatchInputChange}
                  handleAddBatch={handleAddBatch}
                  loading={loading}
                />
              </>
            )}
          </>
        ) : (
          <>
            <div className="text-gray-400 text-lg font-medium mb-2">
              {activeCourse && (
                <>
                  <span
                    className="hover:underline cursor-pointer capitalize"
                    onClick={() => {
                      setActiveCourse(null);
                      setActiveSession(null);
                    }}
                  >
                    Courses
                  </span>{" "}
                  <span>&gt;&gt;</span>{" "}
                  <span
                    className="hover:underline cursor-pointer capitalize"
                    onClick={() => setActiveSession(null)}
                  >
                    {activeCourse.title}
                  </span>{" "}
                  <span>&gt;&gt;</span>{" "}
                  {activeSession && (
                    <span className="hover:underline cursor-pointer capitalize">
                      {activeSession.title}
                    </span>
                  )}
                </>
              )}
            </div>
            <div className="text-4xl font-black mb-2">
              {!activeSession
                ? activeCourse
                  ? "Classes"
                  : "Select a Course"
                : activeSession.title}
            </div>
            {activeCourse ? (
              <>
                {activeSession ? (
                  <>
                    <SessionAttendees
                      activeSession={activeSession}
                      formatDate={formatDate}
                      attendees={attendees}
                      attendeesLoading={attendeesLoading}
                      handleEndSession={handleEndSession}
                      downloadCSV={downloadCSV}
                      downloadingSession={downloadingSession}
                      setActiveSession={setActiveSession}
                    />
                  </>
                ) : (
                  <SessionList
                    activeSessions={activeSessions}
                    inactiveSessions={inactiveSessions}
                    setActiveSession={setActiveSession}
                    showSessionModal={showSessionModal}
                    setShowSessionModal={setShowSessionModal}
                    downloadAllSessionsCSV={downloadAllSessionsCSV}
                    downloadingAllSessions={downloadingAllSessions}
                  />
                )}
              </>
            ) : (
              <>
                <div className="text-gray-400 text-xl mb-12">
                  Please select a course to view its classes.
                </div>
                <CourseList
                  courses={courses}
                  allBatches={allBatches}
                  allClassrooms={allClassrooms}
                  setActiveCourse={setActiveCourse}
                  setShowModal={setShowModal}
                />
              </>
            )}
          </>
        )}
        {/* Add Session Modal */}
        <AddSessionModal
          show={showSessionModal}
          onClose={() => setShowSessionModal(false)}
          onSubmit={handleAddSession}
          sessionForm={sessionForm}
          onInputChange={handleSessionInputChange}
          loading={loading}
        />
        {/* Add Course Modal */}
        <AddCourseModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleAddCourse}
          form={form}
          onInputChange={handleInputChange}
          loading={loading}
          allBatches={allBatches}
          classrooms={classrooms}
        />
        {/* Add Batch Modal */}
        <AddBatchModal
          show={showBatchModal}
          onClose={() => setShowBatchModal(false)}
          onSubmit={handleAddBatch}
          batchForm={batchForm}
          onInputChange={handleBatchInputChange}
          loading={loading}
        />
      </div>
      {alert && <Alert type={alert.type} message={alert.message} />}
    </div>
  );
};

export default Home;
