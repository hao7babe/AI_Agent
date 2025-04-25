import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconType } from 'react-icons'; 
import { FaLandmark, FaMountain, FaUtensils, FaHiking, FaUmbrellaBeach, FaShoppingBag, FaHistory, FaGlassCheers } from 'react-icons/fa';
import { generateTravelPlan } from '../../services/ai/travelAIService';
import { FormInput } from '../../models/FormInput';
import { Interest } from '../../models/Enums';
import '../../styles/global.css';
import '../../styles/FormPage.css';

interface InterestOption {
  id: Interest;
  icon: IconType;
  label: string;
}

const interestOptions: InterestOption[] = [
  { id: Interest.Culture, icon: FaLandmark, label: 'Culture' },
  { id: Interest.Nature, icon: FaMountain, label: 'Nature' },
  { id: Interest.Food, icon: FaUtensils, label: 'Food' },
  { id: Interest.Adventure, icon: FaHiking, label: 'Adventure' },
  { id: Interest.Relaxation, icon: FaUmbrellaBeach, label: 'Relaxation' },
  { id: Interest.Shopping, icon: FaShoppingBag, label: 'Shopping' },
  { id: Interest.History, icon: FaHistory, label: 'History' },
  { id: Interest.Nightlife, icon: FaGlassCheers, label: 'Nightlife' },
];

const InputForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormInput>({
    destination: '',
    startDate: '',
    endDate: '',
    interests: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showLongTripDialog, setShowLongTripDialog] = useState(false);

  const validateDates = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    
    if (startDate < today) {
      setError('Start date cannot be in the past');
      return false;
    }
    
    if (endDate < startDate) {
      setError('End date cannot be before start date');
      return false;
    }
    
    const dayDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    if (dayDiff > 10) {
      setShowLongTripDialog(true);
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateDates()) {
      return;
    }
    
    setIsLoading(true);
    try {
      const travelPlan = await generateTravelPlan(formData);
      localStorage.setItem('currentTravelPlan', JSON.stringify(travelPlan));
      navigate('/outcome');
    } catch (err) {
      setError('Failed to generate travel plan. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInterestChange = (interest: Interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleConfirmLongTrip = () => {
    setShowLongTripDialog(false);
    setIsLoading(true);
    generateTravelPlan(formData)
      .then(travelPlan => {
        localStorage.setItem('currentTravelPlan', JSON.stringify(travelPlan));
        navigate('/outcome');
      })
      .catch(err => {
        setError('Failed to generate travel plan. Please try again.');
        console.error('Error:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="form-page">
      <div className="form-container">
        <div className="form-header">
          <h1>Plan Your Trip</h1>
          <p>Tell us about your travel preferences and we'll create a personalized itinerary</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="travel-form">
          <div className="form-group">
            <label htmlFor="destination">Destination</label>
            <input
              type="text"
              id="destination"
              value={formData.destination}
              onChange={(e) => setFormData({...formData, destination: e.target.value})}
              placeholder="Enter city, country, or region (e.g., Paris, France or Southeast Asia)"
              required
            />
          </div>

          <div className="date-group">
            <div className="form-group">
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                id="startDate"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="endDate">End Date</label>
              <input
                type="date"
                id="endDate"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                min={formData.startDate || new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>

          <section className="form-group">
            <header className="interests-header">
              <label>Interests</label>
              <span className="multi-select-hint">Select multiple interests</span>
            </header>
            <nav className="interests-grid">
              {interestOptions.map(({ id, icon: Icon, label }) => {
                const IconComponent = Icon as React.ComponentType<{ size?: number; className?: string }>;
                return (
                  <button
                    key={id}
                    type="button"
                    className={`interest-button ${formData.interests.includes(id) ? 'selected' : ''}`}
                    onClick={() => handleInterestChange(id)}
                  >
                    <IconComponent size={24} className="interest-icon" />
                    <span>{label}</span>
                  </button>
                );
              })}
            </nav>
          </section>

          <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? 'Generating Itinerary...' : 'Generate Itinerary'}
          </button>
        </form>
      </div>

      {showLongTripDialog && (
        <dialog className="dialog-overlay" open>
          <section className="dialog-content">
            <h3>Long Trip Warning</h3>
            <p>Your trip duration is more than 10 days. We recommend either:</p>
            <ul>
              <li>Reducing the trip duration to make it more manageable</li>
              <li>Creating multiple shorter trips instead</li>
            </ul>
            <p>Would you like to continue with this long trip?</p>
            <footer className="dialog-buttons">
              <button 
                className="secondary-button"
                onClick={() => setShowLongTripDialog(false)}
              >
                Adjust Dates
              </button>
              <button 
                className="primary-button"
                onClick={handleConfirmLongTrip}
              >
                Continue Anyway
              </button>
            </footer>
          </section>
        </dialog>
      )}
    </div>
  );
};

export default InputForm;
