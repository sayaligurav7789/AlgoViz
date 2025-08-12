import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Footer from './components/Footer'
import Features from './components/Features'
import { FaPlay, FaCode, FaProjectDiagram, FaChartLine } from "react-icons/fa";
import Demo from './components/Demo'
import About from './components/About'
import Contact from './components/Contact'
import TopicsPage from './components/TopicsPage';



function App() {
  

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <main className="pt-20 bg-gray-50 min-h-screen">
                <Hero />
                <Features />
                <Demo />
                <About />
                <Contact />
              </main>
              <Footer />
            </>
          }
        />
        <Route path="/get-started" element={<TopicsPage />} />
      </Routes>
    </Router>
  );
}

export default App
