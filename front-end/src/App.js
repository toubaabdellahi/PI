// import logo from "./logo.svg";
// import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ChatInput from "./pages/ChatInput";
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
            <Route path="/google-auth-success" element={<GoogleAuthSuccess />} />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pdf-manager"
              element={
                <ProtectedRoute>
                  <PdfManager />
                </ProtectedRoute>
              }
            />

            <Route
              path="/input"
              element={
                <ProtectedRoute>
                  <ChatInput />
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
