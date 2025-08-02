import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BottomNav } from './components/BottomNav';

import './OfferPage.css';

type Offer = {
  id: number;
  name: string;
  description: string;
  offer_price: number;
};

const OfferPage: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [expandedOfferId, setExpandedOfferId] = useState<number | null>(null);
  const userType = localStorage.getItem("userType") as "employer" | "freelancer" | null;

  useEffect(() => {
    fetch('https://line-gig-api.vercel.app/offers')
      .then(res => res.json())
      .then(data => {
        setOffers(data);
      })
      .catch(error => console.error('Error fetching offers:', error));
  }, []);

  const handleToggle = (offerId: number) => {
    setExpandedOfferId(prevId => (prevId === offerId ? null : offerId));
  };

  const handleAccept = (offerId: number) => {
    alert(`✅ Accepted offer with ID: ${offerId}`);
    // You can add logic to send accept to backend
  };

  const handleDecline = (offerId: number) => {
    alert(`❌ Declined offer with ID: ${offerId}`);
    // You can add logic to send decline to backend
  };

  return (
    <div className="offer-list">
      {offers.map((offer) => {
        const isExpanded = expandedOfferId === offer.id;
        const shortDesc = offer.description.slice(0, 120);

        return (
          <div className="offer-container" key={offer.id}>
            <div className="offer-header">
              <h2>{offer.name}</h2>
              <p>💰 {offer.offer_price} THB</p>
            </div>

            <div className={`offer-description ${isExpanded ? 'expanded' : ''}`}>
              <p>{isExpanded ? offer.description : shortDesc + '...'}</p>
              <button className="toggle-btn" onClick={() => handleToggle(offer.id)}>
                {isExpanded ? 'Show Less' : 'Read More'}
              </button>
            </div>

            <div className="offer-buttons">
              <button onClick={() => handleAccept(offer.id)} className="btn-accept">Accept</button>
              <button onClick={() => handleDecline(offer.id)} className="btn-decline">Decline</button>
            </div>
          </div>
        );
      })}

      {/* Bottom Navigation */}
      <BottomNav userType={userType} />
    </div>
  );
};

export default OfferPage;
