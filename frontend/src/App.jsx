import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./App.css";
import { Button } from "@/components/ui/button"

function App() {

  return (
    <>
        <h1 className="text-3xl font-bold text-amber-300 underline">
    Hello world!
  </h1>
  <button className="px-4 py-2 text-sm font-medium rounded-b-sm bg-white text-black rounded transition-colors duration-300 hover:bg-black hover:text-white border border-amber-100"> 
    Click me</button>
    </>
  );
}

export default App;
