import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CreateRfqPage from './pages/CreateRfqPage';
import AddCompanyPage from './pages/AddCompanyPage';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900 pb-12">
        <Navbar />
        <main className="max-w-6xl mx-auto px-6">
          <Routes>
            <Route path="/" element={<CreateRfqPage />} />
            <Route path="/add-company" element={<AddCompanyPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}