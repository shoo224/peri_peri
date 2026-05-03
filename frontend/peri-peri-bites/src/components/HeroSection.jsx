import './HeroSection.css';

export default function HeroSection() {
  return (
    <section id="home" className="hero-section">
      <div className="hero-content">
        <div className="hero-badges">
          <span className="badge badge-spicy">Spicy & Irresistible</span>
          <span className="badge badge-natural">100% Natural Ingredients</span>
        </div>
        
        <div className="hero-headline">
          <h1>Taste The</h1>
          <h1 className="highlight">Spicy Sensation</h1>
        </div>
        
        <p className="hero-description">
          Experience the perfect blend of crunch and spice. Our Peri Peri Bites 
          are expertly seasoned with premium peri peri spices for an unforgettable 
          flavor explosion.
        </p>
        
        <div className="hero-actions">
          <button className="btn btn-primary">Add to Cart</button>
          <button className="btn btn-secondary">Learn More</button>
        </div>
        
        <div className="hero-ratings">
          <div className="stars">
            {'★'.repeat(5)}
          </div>
          <p className="rating-text">10,000+ Happy Customers</p>
        </div>
      </div>
    </section>
  );
}
