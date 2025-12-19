import { useEffect, useRef, useState } from "react";
import { FaMicrophone, FaStop } from "react-icons/fa";

export default function ChatInput({ onSend }) {
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const [volume, setVolume] = useState(0);
  const [listeningDots, setListeningDots] = useState("");

  const recognitionRef = useRef(null);
  const finalTextRef = useRef("");
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const rafRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const startingRef = useRef(false);

  /*  SPEECH  */
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setListening(true);
      finalTextRef.current = "";
      startWaveform();
    };

    recognition.onresult = (e) => {
      clearTimeout(silenceTimerRef.current);

      let transcript = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        transcript += e.results[i][0].transcript;
      }

      finalTextRef.current = transcript;
      setText(transcript);

      silenceTimerRef.current = setTimeout(() => {
        recognition.stop();
      }, 1200);
    };

    recognition.onend = () => {
      setListening(false);
      fadeOutWaveform();
      stopWaveform();
      sendFinal();
      startingRef.current = false;
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop?.();
      stopWaveform();
    };
  }, []);

  /*  LISTENING DOTS  */
  useEffect(() => {
    if (!listening) {
      setListeningDots("");
      return;
    }

    const i = setInterval(() => {
      setListeningDots((d) => (d.length < 3 ? d + "." : ""));
    }, 400);

    return () => clearInterval(i);
  }, [listening]);

  /*  AUDIO / WAVEFORM  */
  const startWaveform = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    audioCtxRef.current = new (window.AudioContext ||
      window.webkitAudioContext)();

    if (audioCtxRef.current.state === "suspended") {
      await audioCtxRef.current.resume();
    }

    const source = audioCtxRef.current.createMediaStreamSource(stream);
    analyserRef.current = audioCtxRef.current.createAnalyser();
    analyserRef.current.fftSize = 64;

    source.connect(analyserRef.current);

    const data = new Uint8Array(analyserRef.current.frequencyBinCount);

    const animate = () => {
      analyserRef.current.getByteFrequencyData(data);
      const avg = data.reduce((a, b) => a + b, 0) / data.length / 255;
      const gated = avg < 0.03 ? 0 : avg; // noise gate
      setVolume(gated);
      rafRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  const fadeOutWaveform = () => {
    cancelAnimationFrame(rafRef.current);

    const fade = () => {
      setVolume((v) => {
        const next = Math.max(0, v - 0.05);
        if (next > 0) rafRef.current = requestAnimationFrame(fade);
        return next;
      });
    };

    fade();
  };

  const stopWaveform = () => {
    cancelAnimationFrame(rafRef.current);
    audioCtxRef.current?.close();
  };

  /*  MIC CONTROL  */
  const startListening = () => {
    if (startingRef.current) return;
    startingRef.current = true;
    recognitionRef.current?.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
  };

  /*  SEND WITH SMART PUNCTUATION  */
  const sendFinal = () => {
    let finalText = finalTextRef.current.trim();
    if (!finalText) return;

    finalText = finalText.replace(/\s+/g, " "); // normalize spaces
    finalText = finalText.replace(/\s(and|but|so|then)\s/gi, ", $1 "); // commas
    finalText = finalText.charAt(0).toUpperCase() + finalText.slice(1); // capitalize
    if (!/[.?!]$/.test(finalText)) {
      if (/^(who|what|when|where|why|how)\b/i.test(finalText)) {
        finalText += "?";
      } else {
        finalText += ".";
      }
    }

    onSend(finalText);
    setText("");
    finalTextRef.current = "";
  };

  const sendTyped = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  /*  UI  */
  const waveColor =
    volume < 0.05
      ? "border-gray-300"
      : volume < 0.25
        ? "border-blue-400"
        : volume < 0.5
          ? "border-green-400"
          : "border-red-400";

  return (
    <div className="border-t bg-white px-3 py-2">
      <div className="flex items-center gap-2">
        <input
          className="flex-1 border rounded-full px-4 py-2 text-sm outline-none"
          placeholder={listening ? `Listening${listeningDots}` : "Speak or type..."}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendTyped()}
        />

        {/* MIC with  WAVE */}
        <div className="relative flex items-center justify-center">
          {listening && (
            <div
              className={`absolute rounded-full border-2 ${waveColor}`}
              style={{
                width: `${36 + volume * 30}px`,
                height: `${36 + volume * 30}px`,
                opacity: 0.4 + volume,
                transition: "all 80ms linear",
              }}
            />
          )}

          <button
            onMouseDown={startListening}
            onMouseUp={stopListening}
            onTouchStart={startListening}
            onTouchEnd={stopListening}
            onClick={() => listening && stopListening()}
            className={`relative z-10 p-2 rounded-full ${listening ? "bg-red-500 text-white" : "bg-gray-200 text-gray-600"
              }`}
          >
            {listening ? <FaStop /> : <FaMicrophone />}
          </button>
        </div>

        {/* SEND BUTTON */}
        <button
          onClick={sendTyped}
          className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}