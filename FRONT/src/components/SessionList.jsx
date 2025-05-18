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
    <div className="flex justify-between items-center mb-3">
      <div className="font-semibold text-lg  text-green-700">
        Active Sessions
      </div>
      <button
        onClick={downloadAllSessionsCSV}
        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
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
    <div className="flex flex-wrap pl-7  gap-3 mb-10">
      {activeSessions.map((session) => (
        <div
          key={session.id}
          className="w-56 h-18 bg-white border border-green-400 rounded-lg flex items-center justify-center shadow text-lg font-semibold cursor-pointer hover:bg-green-50 transition"
          onClick={() => setActiveSession(session)}
        >
          {session.title}
        </div>
      ))}
      {/* Add Session Card (only if no active session) */}
      {activeSessions.length === 0 && (
        <div
          className="w-56 h-18 flex items-center justify-center border-2 border-gray-200 bg-gray-100 rounded-2xl cursor-pointer text-5xl leading-none text-white hover:bg-indigo-200 hover:border-indigo-400 transition"
          onClick={() => setShowSessionModal(true)}
        >
          <span className="relative top-[-5px]">+</span>
        </div>
      )}
    </div>
    <div className="mb-3 font-semibold text-gray-700  text-lg">
      Inactive Sessions
    </div>
    <div className="flex flex-wrap pl-7 mt-5 gap-3">
      {inactiveSessions.map((session) => (
        <div
          key={session.id}
          className="w-56 h-18 bg-white border-2  text-lg font-semibold text-gray-400 hover:text-gray-700 border-gray-200 rounded-2xl flex flex-col items-center justify-center shadow cursor-pointer  hover:bg-indigo-50 hover:border-indigo-300 transition-3d"
          onClick={() => setActiveSession(session)}
        >
          {session.title}
        </div>
      ))}
    </div>
  </>
);

export default SessionList;
