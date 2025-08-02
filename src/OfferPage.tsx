import { useState, useEffect } from 'react';
import { BottomNav } from './components/BottomNav';

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
  };

  const handleDecline = (offerId: number) => {
    alert(`❌ Declined offer with ID: ${offerId}`);
  };

  return (
    <div
      style={{
        maxHeight: "85vh",
        overflowY: "auto",
        padding: "20px",
        background: "#f9f9f9",
      }}
    >
      {offers.map((offer) => {
        const isExpanded = expandedOfferId === offer.id;
        const shortDesc = offer.description.slice(0, 120);

        return (
          <div
            key={offer.id}
            style={{
              background: "#fff",
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <div>
              <h2 style={{ marginBottom: "10px", fontSize: "18px" }}>
                {offer.name}
              </h2>
              <p>Fees - {offer.offer_price} THB</p>
            </div>

            <div
              style={{
                fontSize: "15px",
                lineHeight: 1.5,
                color: "#444",
              }}
            >
              <p>{isExpanded ? offer.description : shortDesc + "..."}</p>
              <button
                onClick={() => handleToggle(offer.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#007bff",
                  cursor: "pointer",
                  fontSize: "14px",
                  padding: 0,
                }}
              >
                {isExpanded ? "Show Less" : "Read More"}
              </button>
            </div>

            <div
              style={{
                marginTop: "15px",
                display: "flex",
                gap: "15px",
              }}
            >
              <button
                onClick={() => handleAccept(offer.id)}
                style={{
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  color: "white",
                  backgroundColor: "#023d1b",
                  cursor: "pointer",
                }}
              >
                Accept
              </button>
              <button
                onClick={() => handleDecline(offer.id)}
                style={{
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  color: "white",
                  backgroundColor: "#dc3545",
                  cursor: "pointer",
                }}
              >
                Decline
              </button>
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
