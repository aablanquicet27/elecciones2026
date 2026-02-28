import Footer from '../components/Footer';
import SenadoHero from '../components/senado/SenadoHero';
import SenadoStats from '../components/senado/SenadoStats';
import SenadoCorruptionTable from '../components/senado/SenadoCorruptionTable';
import SenadoPartyGrid from '../components/senado/SenadoPartyGrid';
import SenadoVotingGuide from '../components/senado/SenadoVotingGuide';
import SenadoCTA from '../components/senado/SenadoCTA';

const SenadoPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <SenadoHero />
      <SenadoStats />
      <SenadoCorruptionTable />
      <SenadoPartyGrid />
      <SenadoVotingGuide />
      <SenadoCTA />
      <Footer />
    </div>
  );
};

export default SenadoPage;
