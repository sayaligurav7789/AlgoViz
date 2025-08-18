import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import Features from './components/Features';
import Demo from './components/Demo';
import About from './components/About';
import Contact from './components/Contact';
import TopicsPage from './components/TopicsPage';
import SortingAlgorithmsPage from './components/SortingAlgorithmsPage';

// Import your visualizer components
import BubbleSortVisualizer from './components/visualizers/BubbleSortVisualizer';
import SelectionSortVisualizer from './components/visualizers/SelectionSortVisualizer';
import QuickSortVisualizer from './components/visualizers/QuickSort';
import MergeSortVisualizer from './components/visualizers/MergeSortVisualizer';
import InsertionSortVisualizer from './components/visualizers/InsertionSortVisualizer';
import CountSortVisualizer from "./components/visualizers/CountSortVisualizer";
import RadixSortVisualizer from "./components/visualizers/RadixSortVisualizer";


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Home */}
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

        {/* Topics */}
        <Route path="/get-started" element={<TopicsPage />} />
        <Route path="/topics/sorting" element={<SortingAlgorithmsPage />} />

        {/* Sorting Visualizers */}
        <Route path="/sorting/bubble" element={<BubbleSortVisualizer />} />
        <Route path="/sorting/selection" element={<SelectionSortVisualizer />} />
        <Route path="/sorting/quick" element={<QuickSortVisualizer />} />
        <Route path="/sorting/merge" element={<MergeSortVisualizer />} />
        <Route path="/sorting/insertion" element={<InsertionSortVisualizer />} /> 
        <Route path="/sorting/count" element={<CountSortVisualizer/>} />
        <Route path="/sorting/radix" element={<RadixSortVisualizer/>} />

      </Routes>
    </Router>
  );
}

export default App;
