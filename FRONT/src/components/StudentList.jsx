import React from "react";

const StudentList = ({
  students,
  studentForm,
  handleStudentInputChange,
  handleAddStudent,
  studentLoading,
  handleDeleteStudent,
}) => (
  <div className="bg-white rounded-xl shadow p-8 max-w-4xl mx-auto">
    <div className="text-2xl font-bold mb-6">Students List</div>
    <form className="flex gap-4 mb-6" onSubmit={handleAddStudent}>
      <input
        type="text"
        name="name"
        placeholder="Student Name"
        value={studentForm.name}
        onChange={handleStudentInputChange}
        className="border rounded px-3 py-2 flex-1"
        required
      />
      <input
        type="text"
        name="UID"
        placeholder="Student UID"
        value={studentForm.UID}
        onChange={handleStudentInputChange}
        className="border rounded px-3 py-2 flex-1"
        required
      />
      <button
        type="submit"
        className="bg-indigo-600 text-white px-6 rounded hover:bg-indigo-700 transition"
        disabled={studentLoading}
      >
        add
      </button>
    </form>
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border rounded shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">STUDENT NAME</th>
            <th className="px-4 py-2">STUDENT UID</th>
            <th className="px-4 py-2">STUDENT MAC</th>
            <th className="px-4 py-2">STATE</th>
            <th className="px-4 py-2">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, idx) => (
            <tr key={student.id} className="border-t">
              <td className="px-4 py-2 text-center">{idx + 1}</td>
              <td className="px-4 py-2">{student.name}</td>
              <td className="px-4 py-2">{student.UID}</td>
              <td className="px-4 py-2">
                {student.verifiedState && student.MAC ? student.MAC : "-"}
              </td>
              <td className="px-4 py-2">
                {student.verifiedState && student.MAC ? (
                  <span className="text-green-600 flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 inline"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Verified
                  </span>
                ) : (
                  <span className="text-red-500 flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 inline"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Not Verified
                  </span>
                )}
              </td>
              <td className="px-4 py-2 text-center">
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDeleteStudent(student.id)}
                  title="Delete"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default StudentList;
