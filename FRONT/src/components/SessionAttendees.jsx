import React from "react";

const SessionAttendees = ({
  activeSession,
  formatDate,
  attendees,
  attendeesLoading,
  handleEndSession,
  downloadCSV,
  downloadingSession,
  setActiveSession,
}) => (
  <>
    <div className=" rounded-xl w-full h-[700px] shadow p-16 bg-white  mt-10">
      <div className="flex justify-between items-center mb-6">
        <div className="text-3xl font-bold">Attendees</div>
        <div className="flex justify-center items-center gap-5">
          <button
            onClick={downloadCSV}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
            disabled={downloadingSession}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            {downloadingSession ? "Downloading…" : "Download CSV"}
          </button>
          {activeSession.active && (
            <button
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
              onClick={handleEndSession}
            >
              End Session
            </button>
          )}
        </div>
      </div>
      <div className="mb-4 flex flex-row justify-between">
        <div className="text-gray-700 text-sm">
          <span className="font-semibold">Created At:</span>{" "}
          {formatDate(activeSession.createdAt)}
        </div>
        {!activeSession.active && activeSession.endedAt && (
          <div className="text-red-700 text-sm font-semibold">
            <span className="font-semibold">Ended At:</span>{" "}
            {formatDate(activeSession.endedAt)}
          </div>
        )}
      </div>
      {attendeesLoading ? (
        <div>Loading attendees...</div>
      ) : (
        <>
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <div className="max-h-[400px] overflow-y-auto">
              <table className="min-w-full table-fixed divide-y divide-gray-200 bg-white">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 text-center text-md font-bold text-gray-700  tracking-wider border-r border-gray-300 w-[50px]"></th>
                    <th className="px-6 py-3 text-center text-md font-bold text-gray-700  tracking-wider border-r border-gray-300 w-[150px]">
                      Student UID
                    </th>
                    <th className="px-6 py-3 text-center text-md font-bold text-gray-700  tracking-wider border-r border-gray-300 w-[200px]">
                      Student Name
                    </th>
                    <th className="px-6 py-3 text-center text-md font-bold text-gray-700  tracking-wider border-r border-gray-300 w-[200px]">
                      Student MAC
                    </th>
                    <th className="px-6 py-3 text-center text-md font-bold text-gray-700  tracking-wider border-r border-gray-300 w-[300px]">
                      Recorded At
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {attendees.map((att, idx) => (
                    <tr key={att.UID} className="hover:bg-gray-100 transition">
                      <td className="px-6 py-3 text-center text-md text-gray-700 border-r border-gray-300">
                        {idx + 1}
                      </td>
                      <td className="px-6 py-3 text-center text-md text-gray-700 border-r border-gray-300">
                        {att.UID}
                      </td>
                      <td className="px-6 py-3 text-center text-md text-gray-700 border-r border-gray-300">
                        {att.name}
                      </td>
                      <td className="px-6 py-3 text-center text-md text-gray-700 border-r border-gray-300">
                        {att.MAC}
                      </td>
                      <td className="px-6 py-3 text-center text-md text-gray-700 border-r border-gray-300">
                        {att.recordedAt}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  </>
);

export default SessionAttendees;
