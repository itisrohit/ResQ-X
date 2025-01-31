import React, { useState } from 'react';
import '../components/stylesheet/Volunteer.css';

const Volunteer = () => {
  const [isOnDuty, setIsOnDuty] = useState(false);

  const handleToggle = () => {
    setIsOnDuty(!isOnDuty);
  };

  return (
    <div className="volunteer">
      <div className="volunteer-container">
        <div className="volunteer-toggle-box">
          <div className="toggle-status">{isOnDuty ? 'On Duty 🔥' : 'Off Duty 💤'}</div>
          <label className="toggle-button">
            <input 
              type="checkbox" 
              checked={isOnDuty}
              onChange={handleToggle}
            />
            <span className="slider"></span>
          </label>
        </div>
        <div className="volunteer-content">
          <h1>{isOnDuty ? 'Ready to Help! 🚑' : 'Standing By ⏱️'}</h1>
        </div>
      </div>
    </div>
  );
};

export default Volunteer;