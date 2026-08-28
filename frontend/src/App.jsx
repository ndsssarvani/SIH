import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Consent from "./pages/Consent";
import Complaint from "./pages/Complaint";



export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/consent" element={<Consent/>} />
        <Route path="/complaint" element={<Complaint/>} />
        {/* Add these once you build the pages, so the Login redirects work too */}
        {/* <Route path="/dashboard" element={<OfficerDashboard />} /> */}
        {/* <Route path="/support" element={<ClientSupport />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
