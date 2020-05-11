import { useState } from "react";
import { useSocket } from "use-socketio";

export default function Messages() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const handleSend = () => {
    socket.emit("message", text);
    setText("");
  };

  const { socket } = useSocket("message", (message) =>
    setMessages([...messages, message])
  );

  return (
    <div>
      <label>chat</label>
      <div
        style={{
          minHeight: "200px",
          width: "300px",
          border: "solid 1px",
          borderColor: "black"
        }}
      >
        {messages.map((m, index) => (
          <div key={index}>{m}</div>
        ))}
      </div>

      <input
        type="text"
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}
