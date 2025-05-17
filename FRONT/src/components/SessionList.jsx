import React from "react";

const SessionList = ({
  activeSessions,
  inactiveSessions,
  setActiveSession,
  showSessionModal,
  setShowSessionModal,
  downloadAllSessionsCSV,
  downloadingAllSessions,
}) => (
  <>
    <div className="flex justify-between items-center mb-2">
      <div className="font-semibold text-green-700">Active Sessions</div>
      <button
        onClick={downloadAllSessionsCSV}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition flex items-center gap-2"
        disabled={downloadingAllSessions}
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
        {downloadingAllSessions ? "Downloading…" : "Download All Sessions"}
      </button>
    </div>
    <div className="flex flex-wrap gap-8 mb-2">
      {activeSessions.map((session) => (
        <div
          key={session.id}
          className="w-48 h-16 bg-white border border-green-400 rounded-lg flex items-center justify-center shadow text-lg font-semibold cursor-pointer hover:bg-green-50 transition"
          onClick={() => setActiveSession(session)}
        >
          {session.title}
        </div>
      ))}
      {/* Add Session Card (only if no active session) */}
      {activeSessions.length === 0 && (
        <div
          className="w-48 h-16 flex items-center justify-center border-2 border-indigo-200 bg-indigo-50 rounded-lg cursor-pointer text-4xl text-indigo-300 hover:bg-indigo-100 transition"
          onClick={() => setShowSessionModal(true)}
        >
          <span>+</span>
        </div>
      )}
    </div>
    <div className="mb-2 font-semibold text-gray-700">Inactive Sessions</div>
    <div className="flex flex-wrap gap-8">
      {inactiveSessions.map((session) => (
        <div
          key={session.id}
          className="w-48 h-16 bg-white border border-gray-200 rounded-lg flex items-center justify-center shadow text-lg font-semibold cursor-pointer hover:bg-gray-50 transition"
          onClick={() => setActiveSession(session)}
        >
          {session.title}
        </div>
      ))}
    </div>
  </>
);

export default SessionList;
