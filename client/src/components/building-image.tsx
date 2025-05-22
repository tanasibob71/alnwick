import React from 'react';

interface BuildingImageProps {
  className?: string;
}

const BuildingImage: React.FC<BuildingImageProps> = ({
  className = "",
}) => {
  return (
    <div className={`overflow-hidden ${className}`}>
      {/* Using a placeholder community center image from Unsplash */}
      <img 
        src="https://images.unsplash.com/photo-1575517111839-3a3843ee7f5d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500"
        alt="Community Center Building"
        className="w-full h-full object-cover rounded-lg"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </div>
  );
};

export default BuildingImage;