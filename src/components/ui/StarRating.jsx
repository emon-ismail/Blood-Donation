import React from 'react';
import Icon from '../AppIcon';

const StarRating = ({ rating = 0, maxStars = 5, size = 16, showValue = true, className = '' }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <div className="flex items-center">
        {/* Full Stars */}
        {Array.from({ length: fullStars }).map((_, index) => (
          <Icon
            key={`full-${index}`}
            name="Star"
            size={size}
            className="text-warning fill-current"
          />
        ))}
        
        {/* Half Star */}
        {hasHalfStar && (
          <div className="relative">
            <Icon
              name="Star"
              size={size}
              className="text-muted-foreground"
            />
            <div 
              className="absolute top-0 left-0 overflow-hidden"
              style={{ width: '50%' }}
            >
              <Icon
                name="Star"
                size={size}
                className="text-warning fill-current"
              />
            </div>
          </div>
        )}
        
        {/* Empty Stars */}
        {Array.from({ length: emptyStars }).map((_, index) => (
          <Icon
            key={`empty-${index}`}
            name="Star"
            size={size}
            className="text-muted-foreground"
          />
        ))}
      </div>
      
      {showValue && (
        <span className="text-sm font-medium text-text-secondary ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;