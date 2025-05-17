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
    <button
      className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-700 transition"
      onClick={() => setActiveSession(null)}
    >
      ← Back to Sessions
    </button>
    <div className="bg-white rounded-xl shadow p-8 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="text-2xl font-bold">Attendees</div>
        <button
          onClick={downloadCSV}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition flex items-center gap-2"
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
      </div>
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:gap-8 gap-2">
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
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded shadow">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2">UID</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">MAC</th>
                <th className="px-4 py-2">Recorded At</th>
              </tr>
            </thead>
            <tbody>
              {attendees.map((att, idx) => (
                <tr key={att.UID} className="border-t">
                  <td className="px-4 py-2">{att.UID}</td>
                  <td className="px-4 py-2">{att.name}</td>
                  <td className="px-4 py-2">{att.MAC}</td>
                  <td className="px-4 py-2">{att.recordedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {activeSession.active && (
        <div className="flex justify-end mt-8">
          <button
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
            onClick={handleEndSession}
          >
            End Session
          </button>
        </div>
      )}
    </div>
  </>
);

export default SessionAttendees;
