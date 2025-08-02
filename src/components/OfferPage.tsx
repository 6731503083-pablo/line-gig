import { Component } from 'react';

import './OfferPage.css';

type Offer = {
  id: number;
  name: string;
  description: string;
  offer_price: number;
};

type OfferPageState = {
  offers: Offer[];
  expandedOfferId: number | null;
};

class OfferPage extends Component<{}, OfferPageState> {
  state: OfferPageState = {
    offers: [],
    expandedOfferId: null,
  };

  componentDidMount() {

    fetch('https://json-server--3000.local.webcontainer.io/comments') 
      .then(res => res.json())
      .then(data => {
        this.setState({ offers: data.offers });
      })
      .catch(error => console.error('Error fetching offers:', error));
  }

  handleToggle = (offerId: any) => {
    this.setState(prevState => ({
      expandedOfferId: prevState.expandedOfferId === offerId ? null : offerId
    }));
  };

  handleAccept = (offerId: any) => {
    alert(`✅ Accepted offer with ID: ${offerId}`);
    // You can add logic to send accept to backend
  };

  handleDecline = (offerId: any) => {
    alert(`❌ Declined offer with ID: ${offerId}`);
    // You can add logic to send decline to backend
  };

  render() {
    const { offers, expandedOfferId } = this.state;

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
                <button className="toggle-btn" onClick={() => this.handleToggle(offer.id)}>
                  {isExpanded ? 'Show Less' : 'Read More'}
                </button>
              </div>

              <div className="offer-buttons">
                <button onClick={() => this.handleAccept(offer.id)} className="btn-accept">Accept</button>
                <button onClick={() => this.handleDecline(offer.id)} className="btn-decline">Decline</button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default OfferPage;
