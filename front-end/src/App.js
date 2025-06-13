// import logo from "./logo.svg";
// import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ProtectedRoute from "./ProtectedRoute";
import GoogleAuthSuccess from "./pages/GoogleAuthSuccess";
import ProfilingTest from './pages/ProfilingTest';
//import RedirectLogic from "./pages/RedirectLogic";

import PdfManager from "./pages/PdfManager";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/google-auth-success" element={<GoogleAuthSuccess />} />
          <Route path="/profiling-test" element={<ProfilingTest />} />
         


          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
        </Routes>
        <ErrorBoundary>
          <Routes>
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/google-auth-success"
              element={<GoogleAuthSuccess />}
            />
            <Route path="/" element={<Home />} />
            <Route
              path="/pdf-manager"
              element={
                <ProtectedRoute>
                  <PdfManager />
                </ProtectedRoute>
              }
            />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </div>
  );
}


export default App;