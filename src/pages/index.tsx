import { SocketIOProvider } from "use-socketio";
import Messages from "@app/components/messages";

export default function () {
  const foo: string = 1;
  return (
    <SocketIOProvider url="/">
      <Messages />
    </SocketIOProvider>
  );
}
