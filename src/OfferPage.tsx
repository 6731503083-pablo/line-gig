import { useState, useEffect } from 'react';
import { BottomNav } from './components/BottomNav';

type Offer = {
  id: string;
  title: string;
  description: string;
  budget: string;
  employerId: number;
  requirements: string;
  deadline: string;
  status: string;
  createdAt: string;
};

const OfferPage: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [expandedOfferId, setExpandedOfferId] = useState<string | null>(null);
  const userType = localStorage.getItem("userType") as "employer" | "freelancer" | null;

  useEffect(() => {
    fetch('https://line-gig-api.vercel.app/offers')
      .then(res => res.json())
      .then(data => {
        setOffers(data);
      })
      .catch(error => console.error('Error fetching offers:', error));
  }, []);

  const handleToggle = (offerId: string) => {
    setExpandedOfferId(prevId => (prevId === offerId ? null : offerId));
  };

  const handleAccept = (offerId: string) => {
    alert(`✅ Accepted offer with ID: ${offerId}`);
  };

  const handleDecline = (offerId: string) => {
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
                {offer.title}
              </h2>
              <p>Budget: {offer.budget}</p>
              <p className="offer-status">Status: {offer.status}</p>
            </div>

            <div
              style={{
                fontSize: "15px",
                lineHeight: 1.5,
                color: "#444",
              }}
            >
              <p>{isExpanded ? offer.description : shortDesc + "..."}</p>
              
              {isExpanded && offer.requirements && (
                <div className="offer-requirements">
                  <h4>Requirements:</h4>
                  <p>{offer.requirements}</p>
                </div>
              )}
              
              {isExpanded && offer.deadline && (
                <div className="offer-deadline">
                  <h4>Deadline:</h4>
                  <p>{offer.deadline}</p>
                </div>
              )}
              
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
