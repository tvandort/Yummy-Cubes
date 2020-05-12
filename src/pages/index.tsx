import dynamic from "next/dynamic";
import { SocketIOProvider } from "use-socketio";
import Messages from "@app/components/messages";

export default function () {
  return (
    <SocketIOProvider url="/">
      <Messages />
    </SocketIOProvider>
  );
}
