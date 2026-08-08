import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import Admin from "./pages/Admin";
import Vendeur from "./pages/Vendeur";
import Acheteur from "./pages/Acheteur";

import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Pages publiques */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard />} />
        {/* Pages protégées */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="ADMIN">
              <Admin />
            </ProtectedRoute>
          }
        />


        <Route
          path="/vendeur"
          element={
            <ProtectedRoute role="VENDEUR">
              <Vendeur />
            </ProtectedRoute>
          }
        />


        <Route
          path="/acheteur"
          element={
            <ProtectedRoute role="ACHETEUR">
              <Acheteur />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;