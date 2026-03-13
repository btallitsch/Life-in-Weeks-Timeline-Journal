import React, { useState } from 'react';
import { useAppContext } from '../../store/AppContext';
import './SetupScreen.css';

export default function SetupScreen() {
  const { dispatch } = useAppContext();
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [lifespan, setLifespan] = useState(90);
  const [step, setStep] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthDate) return;
    dispatch({
      type: 'SET_BIRTHDATE',
      payload: { birthDate, userName: name || 'You', lifespanYears: lifespan },
    });
  };

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 1);

  return (
    <div className="setup-screen">
      <div className="setup-backdrop" />
      <div className="setup-container">
        <div className="setup-header">
          <div className="setup-ornament">◆</div>
          <h1 className="setup-title">Life in Weeks</h1>
          <p className="setup-subtitle">
            A visual record of your time on earth —<br />
            <em>every week, a story waiting to be told.</em>
          </p>
        </div>

        <form className="setup-form" onSubmit={handleSubmit}>
          {step === 0 && (
            <div className="setup-step">
              <label className="setup-label">What shall we call you?</label>
              <input
                className="setup-input"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                autoFocus
              />
              <button
                type="button"
                className="setup-btn"
                onClick={() => setStep(1)}
              >
                Continue →
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="setup-step">
              <label className="setup-label">When were you born?</label>
              <p className="setup-hint">This anchors every week in your timeline.</p>
              <input
                className="setup-input"
                type="date"
                value={birthDate}
                onChange={e => setBirthDate(e.target.value)}
                max={maxDate.toISOString().split('T')[0]}
                required
                autoFocus
              />
              <button
                type="button"
                className="setup-btn"
                onClick={() => birthDate && setStep(2)}
                disabled={!birthDate}
              >
                Continue →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="setup-step">
              <label className="setup-label">Projected lifespan</label>
              <p className="setup-hint">How many years does your grid span?</p>
              <div className="setup-slider-row">
                <input
                  type="range"
                  min={60}
                  max={120}
                  value={lifespan}
                  onChange={e => setLifespan(Number(e.target.value))}
                  className="setup-slider"
                />
                <span className="setup-slider-val">{lifespan} yrs</span>
              </div>
              <p className="setup-hint-sm">
                That's {(lifespan * 52).toLocaleString()} weeks — {(lifespan * 52 * 7).toLocaleString()} days.
              </p>
              <button type="submit" className="setup-btn setup-btn-primary">
                Begin my timeline →
              </button>
            </div>
          )}

          <div className="setup-steps-indicator">
            {[0, 1, 2].map(i => (
              <div key={i} className={`step-dot ${i === step ? 'active' : i < step ? 'done' : ''}`} />
            ))}
          </div>
        </form>

        <p className="setup-privacy">
          All data is stored locally in your browser. Nothing is sent to any server.
        </p>
      </div>
    </div>
  );
}
