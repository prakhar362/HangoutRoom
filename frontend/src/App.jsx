import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { io } from "socket.io-client";
import "./App.css";
import LandingPage from './Pages/Landing/LandingPage';
import AuthPage from './Pages/Auth/AuthPage';
import Homepage from './Pages/Dashboard/Homepage';
import ContactForm from './Pages/Dashboard/ContactForm';
import Room from './Pages/Dashboard/Room';
import Profile from './Pages/Dashboard/Profile';
import Settings from './Pages/Dashboard/Settings';

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
    <Route exact path="/contact-us" element={<ContactForm />} />
    <Route exact path="/rooms" element={<Room />} />
    <Route exact path="/profile" element={<Profile/>} />
    <Route exact path="/settings" element={<Settings />} />
    </Routes>
    </BrowserRouter>
    </div>
    </>
  );
}

export default App;
