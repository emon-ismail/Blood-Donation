import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressIndicator = ({ currentStep, totalSteps, completedSteps }) => {
  const steps = [
    { id: 1, name: 'ব্যক্তিগত তথ্য', icon: 'User' },
    { id: 2, name: 'রক্তের তথ্য', icon: 'Droplets' },
    { id: 3, name: 'যোগাযোগ', icon: 'Phone' },
    { id: 4, name: 'যাচাইকরণ', icon: 'Shield' }
  ];

  const progressPercentage = (completedSteps / totalSteps) * 100;

  return (
    <div className="mb-8">
      {/* Progress Bar */}
      <div className="relative mb-6">
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="absolute -top-1 right-0 bg-white px-2 py-1 rounded-full shadow-brand text-xs font-medium text-primary">
          {Math.round(progressPercentage)}%
        </div>
      </div>
      {/* Step Indicators */}
      <div className="flex justify-between items-center">
        {steps?.map((step, index) => {
          const isCompleted = index < completedSteps;
          const isCurrent = index === currentStep - 1;
          const isUpcoming = index > currentStep - 1;

          return (
            <div key={step?.id} className="flex flex-col items-center space-y-2">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                ${isCompleted ? 'bg-success text-white shadow-brand' : ''}
                ${isCurrent ? 'bg-primary text-white shadow-brand heartbeat' : ''}
                ${isUpcoming ? 'bg-muted text-muted-foreground' : ''}
              `}>
                {isCompleted ? (
                  <Icon name="Check" size={20} />
                ) : (
                  <Icon name={step?.icon} size={20} />
                )}
              </div>
              <span className={`
                text-xs font-bengali text-center max-w-16
                ${isCompleted ? 'text-success font-medium' : ''}
                ${isCurrent ? 'text-primary font-medium' : ''}
                ${isUpcoming ? 'text-muted-foreground' : ''}
              `}>
                {step?.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressIndicator;