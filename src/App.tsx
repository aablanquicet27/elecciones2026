import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import HomePage from './pages/HomePage';
import CandidatePage from './pages/CandidatePage';
import AnalysisPage from './pages/AnalysisPage';
import SenadoPage from './pages/SenadoPage';
import NoticiasPage from './pages/NoticiasPage';
import AdminPage from './pages/AdminPage';
import SubscriptionModal from './components/SubscriptionModal';
import AIChatBubble from './components/AIChatBubble';
import { useSubscription } from './hooks/useSubscription';
import { Candidate } from './types/election';
import { parseCandidateData } from './utils/csvParser';

function App() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const { showModal, handleSubscribe, handleCloseModal } = useSubscription();

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
          <p className="text-white text-xl font-medium">Cargando analisis electoral...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage candidates={candidates} />} />
          <Route path="/candidato/:slug" element={<CandidatePage candidates={candidates} />} />
          <Route path="/analisis" element={<AnalysisPage candidates={candidates} />} />
          <Route path="/noticias" element={<NoticiasPage />} />
          <Route path="/senado" element={<SenadoPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>

        <SubscriptionModal
          isOpen={showModal}
          onClose={handleCloseModal}
          onSubscribe={handleSubscribe}
        />

        <AIChatBubble />
      </Router>
      <Analytics />
    </>
  );
}

export default App;
