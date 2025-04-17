import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Connect to the server
    const socketInstance = io("http://localhost:3000"); // Replace with your server's URL
    setSocket(socketInstance);

    // Listen for incoming messages
    socketInstance.on("connect", () => {
      console.log("Connected to the server with socket ID:", socketInstance.id);
    });

    socketInstance.on("message", (data) => {
      setMessage(data);
      console.log("Message from server:", data);
    });

    // Cleanup on component unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const sendMessageToServer = () => {
    if (socket) {
      socket.emit("message", { text: "Hello, Server!" });
    }
  };

  return (
    <>
      <div>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button className="bg-amber-200" onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <h1 className="text-3xl font-bold text-amber-300 underline">
    Hello world!
  </h1>
        <button onClick={sendMessageToServer}>Send Message to Server</button>
      </div>

      {message && <p>Message from server: {message.text}</p>}

      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
