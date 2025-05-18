import React from "react";
import { CheckCircle, XCircle, Trash2 } from "lucide-react";
import Input from "./Input";

const StudentList = ({
  students,
  studentForm,
  handleStudentInputChange,
  handleAddStudent,
  studentLoading,
  handleDeleteStudent,
}) => (
  <div className="bg-white rounded-xl shadow p-16  w-full h-[700px]  mt-10">
    <div className="text-2xl font-bold mb-6">Students List</div>
    <form className="flex gap-4 w-3/5 mb-6" onSubmit={handleAddStudent}>
      <input
        type="text"
        name="name"
        placeholder="Student Name"
        value={studentForm.name}
        onChange={handleStudentInputChange}
        className={`transition-3d relative block w-full h-12 px-3 py-2 border-2 ${"border-gray-300"} placeholder-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-400 focus:border-indigo-400 focus:z-10 sm:text-lg`}
        required
      />
      <input
        type="text"
        name="UID"
        placeholder="Student UID"
        value={studentForm.UID}
        onChange={handleStudentInputChange}
        className={`transition-3d relative block w-full h-12 px-3 py-2 border-2 ${"border-gray-300"} placeholder-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-400 focus:border-indigo-400 focus:z-10 sm:text-lg`}
        required
      />
      <button
        type="submit"
        className="bg-indigo-600 text-white text-lg font-semibold  px-6 hover:bg-indigo-700 transition rounded-xl"
        disabled={studentLoading}
      >
        add
      </button>
    </form>

    <div className="overflow-hidden rounded-lg border border-gray-200">
      <div className="max-h-[450px] overflow-y-auto">
        <table className="min-w-full table-fixed divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-center text-md font-bold text-gray-700 uppercase tracking-wider border-r border-gray-300 w-[50px]"></th>
              <th className="px-6 py-3 text-center text-md font-bold text-gray-700 uppercase tracking-wider border-r border-gray-300 w-[150px]">
                STUDENT UID
              </th>
              <th className="px-6 py-3 text-center text-md font-bold text-gray-700 uppercase tracking-wider border-r border-gray-300 w-[200px]">
                STUDENT NAME
              </th>
              <th className="px-6 py-3 text-center text-md font-bold text-gray-700 uppercase tracking-wider border-r border-gray-300 w-[200px]">
                STUDENT MAC
              </th>
              <th className="px-6 py-3 text-center text-md font-bold text-gray-700 uppercase tracking-wider border-r border-gray-300 w-[150px]">
                STATE
              </th>
              <th className="px-6 py-3 text-center text-md font-bold text-gray-700 uppercase tracking-wider w-[100px]">
                ACTION
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {students.map((student, idx) => (
              <tr key={student.UID} className="hover:bg-gray-100 transition">
                <td className="px-6 py-3 text-center text-md text-gray-700 border-r border-gray-300">
                  {idx + 1}
                </td>
                <td className="px-6 py-3 text-center text-md text-gray-700 border-r border-gray-300">
                  {student.UID}
                </td>
                <td className="px-6 py-3 text-center text-md text-gray-700 border-r border-gray-300">
                  {student.name}
                </td>
                <td className="px-6 py-3 text-center text-md text-gray-700 border-r border-gray-300">
                  {student.verifiedState && student.MAC ? student.MAC : "-"}
                </td>
                <td className="px-6 py-3 text-center text-md text-gray-700 border-r border-gray-300">
                  {student.verifiedState && student.MAC ? (
                    <span className="text-green-600 flex justify-center items-center gap-1">
                      <CheckCircle size={18} />
                      Verified
                    </span>
                  ) : (
                    <span className="text-red-500 flex justify-center items-center gap-1">
                      <XCircle size={18} />
                      Not Verified
                    </span>
                  )}
                </td>
                <td className="px-6 py-3 text-center text-md text-gray-700">
                  <button
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                    onClick={() => handleDeleteStudent(student.id)}
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default StudentList;
