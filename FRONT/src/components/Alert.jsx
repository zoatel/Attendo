const Alert = ({ type = "success", message }) => {
  const colors = {
    success: {
      bg: "bg-green-50",
      text: "text-green-800",
      border: "border-green-300",
      icon: "✅",
    },
    error: {
      bg: "bg-red-50",
      text: "text-red-800",
      border: "border-red-300",
      icon: "❌",
    },
    warning: {
      bg: "bg-yellow-50",
      text: "text-yellow-800",
      border: "border-yellow-300",
      icon: "⚠️",
    },
    info: {
      bg: "bg-blue-50",
      text: "text-blue-800",
      border: "border-blue-300",
      icon: "ℹ️",
    },
  };

  const { bg, text, border, icon } = colors[type];

  return (
    <div
      className={`p-4 mb-4 text-sm rounded-lg border ${bg} ${text} ${border} fixed top-4 left-1/2 transform -translate-x-1/2 z-50`}
      role="alert"
    >
      {icon} {message}
    </div>
  );
};

export default Alert;
