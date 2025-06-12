// import logo from "./logo.svg";
// import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ProtectedRoute from "./ProtectedRoute";
import GoogleAuthSuccess from "./pages/GoogleAuthSuccess";
import PdfManager from "./pages/PdfManager";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <div>
      <BrowserRouter>
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
