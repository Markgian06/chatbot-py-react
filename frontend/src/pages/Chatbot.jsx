import { useState } from "react"
import ChatHeader from "../components/ChatHeader"
import ChatMessages from "../components/ChatMessages"
import ChatInput from "../components/ChatInput"
import { sendMessageMock } from "../services/chatService"

function Chatbot() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! How can I help you today?",
      time: getTime(),
    }
  ])
  const [typing, setTyping] = useState(false)

  function getTime() {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  async function handleSend(text) {
    setMessages(prev => [
      ...prev,
      {
        sender: "user",
        text,
        time: getTime(),
      }
    ])

    setTyping(true)

    const response = await sendMessageMock(text)

    setTyping(false)
    setMessages(prev => [
      ...prev,
      {
        sender: "bot",
        text: response.reply,
        time: getTime(),
      }
    ])
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-2">
      <div className="
        w-full
        max-w-4xl
        h-[95vh]
        bg-white
        flex flex-col
        rounded-2xl
        shadow-xl
        overflow-hidden
      ">
        <ChatHeader />
        <ChatMessages messages={messages} typing={typing} />
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  )
}
export default Chatbot