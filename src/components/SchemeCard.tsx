import React from 'react';
import { Scheme } from '../types';

interface SchemeCardProps {
  scheme: Scheme;
  onViewDetails?: (scheme: Scheme) => void;
  className?: string;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({
  scheme,
  onViewDetails,
  className = ''
}) => {
  return (
    <div className={`scheme-card ${className}`}>
      <div className="scheme-header">
        <h3 className="scheme-title">{scheme.name}</h3>
        <span className="scheme-category">{scheme.category}</span>
      </div>
      
      <div className="scheme-content">
        <p className="scheme-description">{scheme.description}</p>
        
        <div className="scheme-benefits">
          <h4>Key Benefits:</h4>
          <ul>
            {scheme.benefits.slice(0, 3).map((benefit, index) => (
              <li key={index}>{benefit}</li>
            ))}
            {scheme.benefits.length > 3 && (
              <li>...and {scheme.benefits.length - 3} more</li>
            )}
          </ul>
        </div>
        
        <div className="scheme-eligibility">
          <h4>Eligibility:</h4>
          <ul>
            {scheme.eligibility.slice(0, 2).map((criteria, index) => (
              <li key={index}>{criteria}</li>
            ))}
            {scheme.eligibility.length > 2 && (
              <li>...and {scheme.eligibility.length - 2} more criteria</li>
            )}
          </ul>
        </div>
      </div>
      
      <div className="scheme-footer">
        {scheme.state && (
          <span className="scheme-state">📍 {scheme.state}</span>
        )}
        <button
          className="view-details-btn"
          onClick={() => onViewDetails?.(scheme)}
        >
          View Details
        </button>
      </div>
    </div>
  );
};
