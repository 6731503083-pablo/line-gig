import React, { Component } from 'react';
import './OfferPage.css';

interface OfferPageState {
  expandedIndex: number | null;
}

class OfferPage extends Component<{}, OfferPageState> {
  state: OfferPageState = {
    expandedIndex: 1, // Track which job is expanded
  };

  handleToggle = (id: number | null) => {
    this.setState((prevState) => ({
      expandedIndex: prevState.expandedIndex === id ? null : id,
    }));
  };

  handleAccept = () => {
    alert("You have accepted the offer!");
    // Add logic for accept
  };

  handleDecline = () => {
    alert("You have declined the offer.");
    // Add logic for decline
  };

  render() {
    const jobs = [
      {
        id: 1,
        title: 'React Native Budget App',
        description: `We are seeking a React Native developer to build a cross-platform mobile app for a budgeting tool. You'll be responsible for implementing UI components, state management, and integration with backend APIs. Figma designs and API documentation will be provided.`,
      },
      {
        id: 2,
        title: 'Flutter Fitness App',
        description: `Develop a fitness app using Flutter that tracks workouts and calories. You'll integrate with wearable APIs, work closely with our designer, and maintain clean, maintainable code.`,
      },
      {
        id: 3,
        title: 'React Native Budget App',
        description: `We are seeking a React Native developer to build a cross-platform mobile app for a budgeting tool. You'll be responsible for implementing UI components, state management, and integration with backend APIs. Figma designs and API documentation will be provided.`,
      },
      {
        id: 4,
        title: 'Flutter Fitness App',
        description: `Develop a fitness app using Flutter that tracks workouts and calories. You'll integrate with wearable APIs, work closely with our designer, and maintain clean, maintainable code.`,
      },
    ];

    return (
      <div className="job-list">
        {jobs.map((job, id) => {
          const isExpanded = this.state.expandedIndex === id;
          const shortDesc = job.description.slice(0, 120);

          return (
            <div className="offer-container" key={id}>
              <div className="offer-header">
                <h2>{job.title}</h2>
              </div>

              <div className={`offer-description ${isExpanded ? 'expanded' : ''}`}>
                <p>
                  {isExpanded ? job.description : shortDesc + '...'}
                </p>
                <button className="toggle-btn" onClick={() => this.handleToggle(id)}>
                  {isExpanded ? 'Show Less' : 'Read More'}
                </button>
              </div>

              <div className="offer-buttons">
                <button onClick={() => this.handleAccept()} className="btn-accept">Accept</button>
                <button onClick={() => this.handleDecline()} className="btn-decline">Decline</button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default OfferPage;
