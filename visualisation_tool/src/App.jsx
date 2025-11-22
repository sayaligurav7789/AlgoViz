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
import SortingAlgorithmsPage from "./components/visualizers/Sorting/SortingAlgorithmsPage";
import SearchingAlgorithmPage from "./components/visualizers/Searching/SearchingAlgorithmPage"; 
import LinkedListAlgorithmPage from "./components/visualizers/Linkedlist/LinkedListAlgorithmPage";

// Import your visualizer components for different Techniques 
import BubbleSortVisualizer from './components/visualizers/Sorting/BubbleSortVisualizer';
import SelectionSortVisualizer from './components/visualizers/Sorting/SelectionSortVisualizer';
import QuickSortVisualizer from './components/visualizers/Sorting/QuickSort';
import MergeSortVisualizer from './components/visualizers/Sorting/MergeSortVisualizer';
import InsertionSortVisualizer from './components/visualizers/Sorting/InsertionSortVisualizer';
import CountSortVisualizer from "./components/visualizers/Sorting/CountSortVisualizer";
import RadixSortVisualizer from "./components/visualizers/Sorting/RadixSortVisualizer";
import HeapSortVisualizer from "./components/visualizers/Sorting/HeapSortVisualizer";
import Linear from "./components/visualizers/Searching/linear";
import Binary from "./components/visualizers/Searching/Binary";
import SinglyLinkedList from "./components/visualizers/Linkedlist/SinglyLinkedList";
import DoublyLinkedList from "./components/visualizers/Linkedlist/DoublyLinkedList";
import CircularLinkedList from "./components/visualizers/Linkedlist/CircularLinkedList";
import DoublyCircularLinkedList from "./components/visualizers/Linkedlist/DoublyCircularLinkedList";


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
        <Route path="/topics/searching" element={<SearchingAlgorithmPage />} />
        <Route path="/topics/linkedlist" element={<LinkedListAlgorithmPage />} />
        <Route path="/topics/linked-lists" element={<LinkedListAlgorithmPage />} />

        {/* Sorting Visualizers */}
        <Route path="/sorting/bubble" element={<BubbleSortVisualizer />} />
        <Route path="/sorting/selection" element={<SelectionSortVisualizer />} />
        <Route path="/sorting/quick" element={<QuickSortVisualizer />} />
        <Route path="/sorting/merge" element={<MergeSortVisualizer />} />
        <Route path="/sorting/insertion" element={<InsertionSortVisualizer />} /> 
        <Route path="/sorting/count" element={<CountSortVisualizer/>} />
        <Route path="/sorting/radix" element={<RadixSortVisualizer/>} />
        <Route path="/sorting/heap" element={<HeapSortVisualizer/>} />

        {/* Searching Visualizers */}
        <Route path="/searching/linear" element={<Linear/>} />
        <Route path="/searching/binary" element={<Binary/>} />
        
        {/* Linked List Visualizers */}
        <Route path="/linkedlist/singly" element={<SinglyLinkedList />} /> 
        <Route path="/linkedlist/doubly" element={<DoublyLinkedList />} />
        <Route path="/linkedlist/circular" element={<CircularLinkedList />} />
        <Route path="/linkedlist/doubly-circular" element={<DoublyCircularLinkedList />} />

      </Routes>
    </Router>
  );
}

export default App;
