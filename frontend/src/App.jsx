import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/officer/Dashboard";
import Cases from "./pages/officer/Cases";
import CaseDetails from "./pages/officer/CaseDetails";
import Alerts from "./pages/officer/Alerts";
import Reports from "./pages/officer/Reports";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />

        <Route
          path="/officer/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/officer/cases"
          element={<Cases />}
        />

        <Route
          path="/officer/cases/:id"
          element={<CaseDetails />}
        />

        <Route
          path="/officer/alerts"
          element={<Alerts />}
        />

        <Route
          path="/officer/reports"
          element={<Reports />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;