import React from 'react';
import Icon from '../../../components/AppIcon';

const StatsCard = ({ title, value, change, changeType, icon, color = 'primary' }) => {
  const getColorClasses = (colorType) => {
    const colors = {
      primary: 'bg-primary text-white',
      secondary: 'bg-secondary text-white',
      success: 'bg-success text-white',
      warning: 'bg-warning text-white',
      error: 'bg-error text-white',
      trust: 'bg-trust text-white'
    };
    return colors?.[colorType] || colors?.primary;
  };

  const getChangeColor = (type) => {
    return type === 'increase' ? 'text-success' : type === 'decrease' ? 'text-error' : 'text-muted-foreground';
  };

  return (
    <div className="bg-card rounded-lg p-4 sm:p-6 shadow-brand border border-border hover:shadow-brand-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center ${getColorClasses(color)}`}>
          <Icon name={icon} size={16} className="sm:w-6 sm:h-6" />
        </div>
        {change && (
          <div className={`flex items-center space-x-1 ${getChangeColor(changeType)}`}>
            <Icon 
              name={changeType === 'increase' ? 'TrendingUp' : changeType === 'decrease' ? 'TrendingDown' : 'Minus'} 
              size={12} 
              className="sm:w-4 sm:h-4"
            />
            <span className="text-xs sm:text-sm font-medium">{change}</span>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-lg sm:text-2xl font-bold text-text-primary mb-1">{value}</h3>
        <p className="text-xs sm:text-sm text-muted-foreground font-bengali">{title}</p>
      </div>
    </div>
  );
};

export default StatsCard;