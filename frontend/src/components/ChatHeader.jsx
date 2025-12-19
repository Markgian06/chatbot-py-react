import { FaRobot } from "react-icons/fa";

function ChatHeader() {
  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 bg-blue-500 text-white px-4 py-3 rounded-t-2xl shadow-md w-full">
      
      {/* Robot Logo */}
      <div className="flex-shrink-0">
        <FaRobot size={36} className="text-white" />
      </div>

      {/* Title and subtitle */}
      <div className="flex flex-col text-center sm:text-left">
        <h1 className="text-base sm:text-lg md:text-xl font-bold leading-tight">
          Chatbot
        </h1>
        <p className="text-[10px] sm:text-xs md:text-sm text-blue-100 mt-1 sm:mt-0.5">
          Ask me anything about machine learning
        </p>
      </div>
    </div>
  );
}

export default ChatHeader;