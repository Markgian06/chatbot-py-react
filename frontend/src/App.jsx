import Chatbot from "./pages/Chatbot"

function App() {
  return <Chatbot />
}

export default App
import { useEffect, useState } from 'react'


// function App() {
//   const [message, setMessage] = useState("Connecting to backend...")


//   useEffect(() => {
//     // Replace '/' with your actual backend endpoint (e.g., '/api/data')
//     fetch('http://127.0.0.1:8000/')
//       .then((res) => res.json())
//       .then((data) => setMessage(JSON.stringify(data)))
//       .catch((err) => setMessage("Connection Failed: " + err.message))
//   }, [])


//   return (
//     <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 text-white">
//       <h1 className="text-3xl font-bold text-sky-400">Backend Status:</h1>
//       <pre className="mt-4 p-4 bg-slate-800 rounded-lg border border-slate-700">
//         {message}
//       </pre>
//     </div>
//   )
// }


// export default App