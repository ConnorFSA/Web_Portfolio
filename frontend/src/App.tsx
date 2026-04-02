import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Test from "./pages/Test";
import ProjectDetailPage from "./pages/ProjectDetailPage";

import "./App.css";

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Projects" element={<Projects />} />
          <Route path="/About" element={<About />} />

          <Route path="/Test" element={<Test />} />
          // Routing for unique project page descrptions
          <Route path="/Projects/:slug" element={<ProjectDetailPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App
