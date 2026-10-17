import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/layout/Navbar";
import ProtectedRoute from "./components/layout/ProtectedRoute";

// Pages
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import PracticePage from "./pages/practice/PracticePage";
import TestPage from "./pages/test/TestPage";
import ResultPage from "./pages/result/ResultPage";
import HistoryPage from "./pages/result/HistoryPage";

// App layout wrapper to selectively display the Navbar (e.g. hide in active test mode)
const AppLayout = () => {
  const location = useLocation();
  const isTestMode = location.pathname.startsWith("/test/");

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 antialiased">
      {!isTestMode && <Navbar />}
      <main className="flex-1 flex flex-col">
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Student Routes */}
          <Route path="/dashboard" element={<ProtectedRoute> <DashboardPage /> </ProtectedRoute> } />
          <Route path="/practice" element={<ProtectedRoute>    <PracticePage />  </ProtectedRoute>}/>
          <Route path="/test/:id"  element={    <ProtectedRoute>  <TestPage /></ProtectedRoute> }/>
          <Route path="/results/:id"  element={  <ProtectedRoute>    <ResultPage />  </ProtectedRoute>}/>
          <Route path="/history" element={<ProtectedRoute>  <HistoryPage /></ProtectedRoute>}/>

          {/* Root and Fallback redirection */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
