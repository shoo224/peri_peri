import './Reviews.css';
import reviewsData from '../data/reviews.json';

export default function Reviews(){
  return (
    <section className="reviews-section" id="reviews">
      <div className="reviews-inner">
        <h2>Customer Reviews</h2>
        <div className="reviews-grid">
          {reviewsData.map((r, idx) => (
            <div className="review-card" key={idx}>
              <div className="review-top">
                <div className="avatar">{r.name.charAt(0)}</div>
                <div>
                  <div className="reviewer-name">{r.name}</div>
                  <div className="review-meta">{r.location} • {r.date}</div>
                </div>
              </div>
              <div className="review-body">{r.text}</div>
              <div className="review-stars">{'★'.repeat(r.stars)}{'☆'.repeat(5-r.stars)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
