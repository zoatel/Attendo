import { CheckCircle, XCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import useContextCustomHook from "@/components/globalcontext";

export default function StudentsTable() {
  const { students, setStudents } = useContextCustomHook();

  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [studentMAC, setStudentMAC] = useState("");
  const [studentState, setStudentState] = useState(false);

  const handleAddStudent = () => {
    if (!studentName || !studentId) {
      alert("please enter student name and its id");
      return;
    }

    if (students.some((s) => s.studentId === studentId)) {
      alert("this id is already used");
      return;
    }

    const newStudent = {
      studentName,
      studentId,
      studentMAC,
      studentState,
    };

    setStudents([...students, newStudent]);
    setStudentName("");
    setStudentId("");
    setStudentMAC("");
    setStudentState(false);
  };

  const handleDelete = (id) => {
    const updated = students.filter((s) => s.studentId !== id);
    setStudents(updated);
  };

  return (
    <div className="w-full h-full p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Students List</h2>

      <form className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Student Name"
          className="border px-3 py-2 rounded w-full md:w-1/4"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Student ID"
          className="border px-3 py-2 rounded w-full md:w-1/4"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Student MAC"
          className="border px-3 py-2 rounded w-full md:w-1/4"
          value={studentMAC}
          onChange={(e) => setStudentMAC(e.target.value)}
        />
        <button
          onClick={handleAddStudent}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          add
        </button>
      </form>

      <div className="overflow-x-auto rounded-xl shadow-lg">
        <table className="min-w-full bg-white text-center border border-gray-200">
          <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
            <tr>
              <th className="py-3 px-6 border-b">#</th>
              <th className="py-3 px-6 border-b">Student Name</th>
              <th className="py-3 px-6 border-b">Student ID</th>
              <th className="py-3 px-6 border-b">Student MAC</th>
              <th className="py-3 px-6 border-b">State</th>
              <th className="py-3 px-6 border-b">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {students.map((student, index) => (
              <tr
                key={student.studentId}
                className="hover:bg-gray-50 transition-all duration-150"
              >
                <td className="py-3 px-6 border-b">{index + 1}</td>
                <td className="py-3 px-6 border-b capitalize font-medium">
                  {student.studentName}
                </td>
                <td className="py-3 px-6 border-b">{student.studentId}</td>
                <td className="py-3 px-6 border-b">{student.studentMAC}</td>
                <td className="py-3 px-6 border-b">
                  {student.studentState ? (
                    <span className="flex justify-center items-center text-green-500 gap-1">
                      <CheckCircle size={18} />
                      Verified
                    </span>
                  ) : (
                    <span className="flex justify-center items-center text-red-500 gap-1">
                      <XCircle size={18} />
                      Not Verified
                    </span>
                  )}
                </td>
                <td className="py-3 px-6 border-b">
                  <button
                    onClick={() => handleDelete(student.studentId)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete Student"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan="5" className="py-4 text-gray-400 italic">
                  No students there..
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
