import { useEffect, useRef } from "react"
import { FaRobot, FaUser } from "react-icons/fa"

function ChatMessages({ messages, typing }) {
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, typing])

  return (
    <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 space-y-4 bg-gray-100 scroll-smooth">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex items-center gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
        >
          {msg.sender === "bot" && (
            <div className="flex items-center justify-center p-2 bg-gray-200 rounded-full shrink-0">
              <FaRobot className="text-gray-700 text-lg sm:text-xl" />
            </div>
          )}

          <div
            className={`max-w-[85%] sm:max-w-[70%] px-4 py-2 rounded-2xl text-sm leading-relaxed break-words shadow-sm ${
              msg.sender === "user"
                ? "bg-blue-400 text-white rounded-br-none"
                : "bg-white text-gray-900 border rounded-bl-none"
            }`}
          >
            {msg.text}
            <div className="text-[11px] text-white-400 mt-1 text-right">{msg.time}</div>
          </div>

          {msg.sender === "user" && (
            <div className="flex items-center justify-center p-2 bg-blue-100 rounded-full shrink-0">
              <FaUser className="text-blue-600 text-lg sm:text-xl" />
            </div>
          )}
        </div>
      ))}

      {/* Typing indicator as a bot message */}
      {typing && (
        <div className="flex items-center gap-2 justify-start">
          <div className="flex items-center justify-center p-2 bg-gray-200 rounded-full shrink-0">
            <FaRobot className="text-gray-700 text-lg sm:text-xl" />
          </div>
          <div className="max-w-[70%] px-4 py-2 rounded-2xl bg-white border text-sm text-gray-900 shadow-sm flex items-center gap-1">
            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  )
}

export default ChatMessages
