import Navbar from './Navbar';
import HeroSection from './HeroSection';
import './Homepage.css';

export default function Homepage() {
  return (
    <div className="homepage">
      <Navbar />
      <HeroSection />
    </div>
  );
}
