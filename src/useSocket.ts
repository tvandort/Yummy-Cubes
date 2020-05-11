import { useEffect, useRef } from "react";
import io from "socket.io-client";

interface SocketIOClientStaticConstructors {
  (uri: string, opts?: SocketIOClient.ConnectOpts):
    | SocketIOClient.Socket
    | undefined;
  (opts?: SocketIOClient.ConnectOpts): SocketIOClient.Socket | undefined;
}

const useSocket: SocketIOClientStaticConstructors = (...args: any[]) => {
  console.log("the hook");
  const ref = useRef<SocketIOClient.Socket>();
  useEffect(() => {
    console.log("running effect");
    let socket = ref.current;
    if (socket === null) {
      ref.current = io(...args);
    }
    return () => {
      console.log("destroying connection");
      if (socket) {
        socket.removeAllListeners();
        socket.close();
      }
    };
  }, []);

  return ref.current;
};

export default useSocket;
