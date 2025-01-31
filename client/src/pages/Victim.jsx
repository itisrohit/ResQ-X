import React from 'react'
import '../components/stylesheet/Victim.css'

const Victim = () => {
  return (
    <div className="victim">
        <div className='location box'>
          <h3>Current Location:</h3>
          <button className='HistoryLogs'>Logs</button>
        </div> 
        <div className='victim-form-container'>
          <form action="/api/victims/sos" method="POST" className='victim-form'>
            <label htmlFor="category" className='victim-form-label'>Category: </label>
            <select name="category" id="category" className='victim-form-dropdown'>
              <option value="">Select Category</option>
              <option value="medical">Medical</option>
              <option value="food">Food</option>
              <option value="Other">Other</option>
            </select>
            <label htmlFor="description" className='victim-form-label'>Description: </label>
            <input type="text" name="description" placeholder="Description" className='victim-form-input' />
            <label htmlFor="severity" className='victim-form-label'>Severity</label><br />
            <input type="range" min="1" max="10" step="2" id="severity" name="severity" list="values" className='victim-form-range' />
            <datalist id="values">
              <option value="0" label="0"></option>
              <option value="25" label="25"></option>
              <option value="50" label="50"></option>
              <option value="75" label="75"></option>
              <option value="100" label="100"></option>
            </datalist>
            <button type="submit" className='victim-form-btn'>SOS</button>
          </form>
        </div>
    </div>
  )
}

export default Victim
