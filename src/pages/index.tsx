import dynamic from "next/dynamic";
import { SocketIOProvider } from "use-socketio";

const Socket = dynamic(() => import("../components/messages"));

export default function () {
  return (
    <SocketIOProvider
      url={`${process.env.API_URL}:${process.env.WEBSOCKET_PORT}`}
    >
      <Socket />
    </SocketIOProvider>
  );
}
