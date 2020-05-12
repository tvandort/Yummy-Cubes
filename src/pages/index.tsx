import dynamic from "next/dynamic";
import { SocketIOProvider } from "use-socketio";

const Socket = dynamic(() => import("../components/messages"));

export default function () {
  return (
    <SocketIOProvider url="/">
      <Socket />
    </SocketIOProvider>
  );
}
