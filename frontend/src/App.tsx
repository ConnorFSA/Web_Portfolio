import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import ProtectedRoute from "./components/admin/ProtectedRoute";

// public pages
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import ProjectDetailPage from "./pages/ProjectDetailPage";

// admin pages
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProjectEdit from "./pages/AdminProjectEdit";

import "./App.css";

export default function App() {
  return (
    // AuthProvider wraps everything so useAuth() works in Header too
    <AuthProvider>
      <BrowserRouter>
        <div className="app">
          <Header />
          <main>
            <Routes>
              {/* public routes*/}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:slug" element={<ProjectDetailPage />} />

              {/*Admin routes*/}
              <Route path="/admin/login" element={<LoginPage />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/projects/:slug/edit"
                element={
                  <ProtectedRoute>
                    <AdminProjectEdit />
                  </ProtectedRoute>}
              />
              
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}