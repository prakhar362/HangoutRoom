import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { io } from "socket.io-client";
import "./App.css";
import LandingPage from './Pages/Landing/LandingPage';
import AuthPage from './Pages/Auth/AuthPage';
import Homepage from './Pages/Dashboard/Homepage';

function App() {

  return (
    <>
    <div>
    <BrowserRouter>
    <Routes>
    <Route exact path="/" element={<LandingPage />} />
    <Route exact path="/auth" element={<AuthPage />} />
    {/**Try to add auth or protected routes for home page onwards */}
    <Route exact path="/home" element={<Homepage />} />

    </Routes>
    </BrowserRouter>
    </div>
    </>
  );
}

export default App;
