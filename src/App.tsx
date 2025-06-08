import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CandidatePage from './pages/CandidatePage';
import AnalysisPage from './pages/AnalysisPage';
import { Candidate } from './types/election';
import { parseCandidateData } from './utils/csvParser';

function App() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/candidatos_presidenciales_2026_completo.csv');
        const csvText = await response.text();
        const parsedCandidates = parseCandidateData(csvText);
        setCandidates(parsedCandidates);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white mx-auto mb-6"></div>
          <p className="text-white text-xl font-medium">Cargando análisis electoral...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage candidates={candidates} />} />
        <Route path="/candidato/:slug" element={<CandidatePage candidates={candidates} />} />
        <Route path="/analisis" element={<AnalysisPage candidates={candidates} />} />
      </Routes>
    </Router>
  );
}

export default App;