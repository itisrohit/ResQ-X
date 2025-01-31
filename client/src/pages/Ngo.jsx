import React from 'react';
import '../components/stylesheet/Ngo.css';

const Ngo = () => {
  return (
    <div className="ngo">
        <div className="ngo-container">
            <div className="ngo-log-box">
                <button className="log-button">
                    + New Log Entry
                </button>
            </div>
            <div className="ngo-content">
                    <div className="ngo-recent-requests">
                        <h1>No Open Requests</h1>
                        <p className="empty-state">All requests are currently resolved</p>
                    </div>
            </div>
        </div>
    </div>
  )
}

export default Ngo;