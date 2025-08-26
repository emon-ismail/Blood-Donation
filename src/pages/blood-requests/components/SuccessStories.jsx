import React from 'react';
import Icon from '../../../components/AppIcon';


const SuccessStories = ({ stories }) => {
  if (!stories || stories?.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-brand p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="Heart" size={20} className="text-green-500" />
        <h3 className="text-lg font-bengali font-bold text-text-primary">সফলতার গল্প</h3>
      </div>
      <div className="space-y-4">
        {stories?.slice(0, 3)?.map((story, index) => (
          <div key={index} className="border border-border rounded-lg p-4 hover:shadow-brand transition-shadow">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Icon name="Heart" size={20} className="text-green-500" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-bengali font-semibold text-text-primary">{story?.patientName}</h4>
                  <span className="px-2 py-1 bg-primary text-white text-xs rounded-full font-bold">
                    {story?.bloodGroup}
                  </span>
                </div>
                
                <p className="text-sm font-bengali text-text-secondary mb-3">{story?.message}</p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Icon name="MapPin" size={12} />
                      <span className="font-bengali">{story?.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Users" size={12} />
                      <span className="font-bengali">{story?.donorsHelped} জন সাহায্য করেছেন</span>
                    </div>
                  </div>
                  <span className="font-bengali">{story?.completedDate}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-center">
        <button className="text-primary hover:text-secondary font-bengali text-sm font-medium transition-colors">
          আরও গল্প দেখুন →
        </button>
      </div>
    </div>
  );
};

export default SuccessStories;