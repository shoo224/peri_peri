import Navbar from './Navbar';
import HeroSection from './HeroSection';
import Reviews from './Reviews';
import './Homepage.css';

export default function Homepage() {
  return (
    <div className="homepage">
      <Navbar />
      <HeroSection />
      <Reviews />
      {/* Reviews and RightCards removed; page watermark applied via CSS */}
      <footer className="contact-section">
        <div className="contact-inner">
          <h3>Contact Us</h3>
          <div className="contact-items">
            <a className="contact-item" href="https://wa.me/919876543210" target="_blank" rel="noreferrer">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.52 3.48A11.94 11.94 0 0012 0C5.373 0 0 5.373 0 12c0 2.11.55 4.09 1.6 5.84L0 24l6.38-1.6A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12 0-3.2-1.25-6.14-3.48-8.52z" fill="#25D366"/><path d="M17.22 14.08c-.28-.14-1.66-.82-1.92-.92-.26-.1-.45-.14-.64.14-.19.28-.73.92-.9 1.11-.17.19-.33.21-.61.07-.28-.14-1.18-.44-2.24-1.38-.83-.74-1.39-1.66-1.56-1.94-.17-.28-.02-.43.12-.57.12-.12.28-.32.42-.48.14-.17.19-.28.28-.47.09-.19.04-.36-.02-.5-.07-.14-.64-1.54-.88-2.11-.23-.55-.47-.48-.64-.49l-.55-.01c-.19 0-.5.07-.76.36-.26.28-1 1-1 2.44 0 1.44 1.03 2.84 1.17 3.04.14.19 2.02 3.08 4.9 4.32 2.88 1.25 2.88.83 3.4.78.52-.05 1.66-.68 1.9-1.34.24-.66.24-1.22.17-1.34-.07-.12-.26-.19-.54-.34z" fill="#fff"/></svg>
              <span className="contact-label">WhatsApp: +91 9876543210</span>
            </a>

            <a className="contact-item" href="tel:+919876543210">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 16.5l-5.27-.73a1 1 0 00-.95.27l-2.2 2.2a15.05 15.05 0 01-6.59-6.59l2.2-2.2a1 1 0 00.27-.95L7.5 3H3.5A1.5 1.5 0 002 4.5 19.5 19.5 0 0021 23.5 1.5 1.5 0 0022.5 22v-4z" fill="#ff6b35"/></svg>
              <span className="contact-label">Call: 9876543210</span>
            </a>

            <a className="contact-item" href="https://instagram.com/peri_peri_bites" target="_blank" rel="noreferrer">
              <svg width="28" height="28" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="igGrad" x1="0" x2="1">
                    <stop offset="0" stopColor="#feda75"/>
                    <stop offset="0.5" stopColor="#d62976"/>
                    <stop offset="1" stopColor="#515bd4"/>
                  </linearGradient>
                </defs>
                <rect x="2" y="2" width="20" height="20" rx="5" fill="url(#igGrad)" />
                <circle cx="12" cy="11" r="3" fill="#fff" opacity="0.95" />
                <circle cx="12" cy="11" r="1.6" fill="url(#igGrad)" />
                <circle cx="17.2" cy="6.8" r="0.9" fill="#fff" />
              </svg>
              <span className="contact-label">Instagram: @peri_peri_bites</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
