import { useState } from "react";
import { useSocket } from "use-socketio";

export default function Messages() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    messageSocket.emit("message", text);
    setText("");
  };

  useSocket("server_message", (message) => setMessages([...messages, message]));
  const { socket: messageSocket } = useSocket("message", (message) =>
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

      <form onSubmit={handleSend}>
        <input
          type="text"
          onChange={(e) => setText(e.target.value)}
          value={text}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
